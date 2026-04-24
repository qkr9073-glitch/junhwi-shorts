import type { VercelRequest, VercelResponse } from "@vercel/node";
import { Communicate } from "edge-tts-universal";

// 레이트리밋 — IP당 분당 10회
const RATE_LIMIT_MAX = 10;
const RATE_LIMIT_WINDOW_MS = 60_000;
type Bucket = { count: number; resetAt: number };
const buckets = new Map<string, Bucket>();

function getClientIp(req: VercelRequest): string {
  const fwd = req.headers["x-forwarded-for"];
  if (typeof fwd === "string" && fwd.length > 0) {
    return fwd.split(",")[0].trim();
  }
  if (Array.isArray(fwd) && fwd.length > 0) return fwd[0];
  const real = req.headers["x-real-ip"];
  if (typeof real === "string" && real.length > 0) return real;
  return req.socket?.remoteAddress ?? "unknown";
}

function checkRateLimit(ip: string): { ok: boolean; retryAfter: number } {
  const now = Date.now();
  const b = buckets.get(ip);
  if (!b || now >= b.resetAt) {
    buckets.set(ip, { count: 1, resetAt: now + RATE_LIMIT_WINDOW_MS });
    return { ok: true, retryAfter: 0 };
  }
  if (b.count >= RATE_LIMIT_MAX) {
    return { ok: false, retryAfter: Math.ceil((b.resetAt - now) / 1000) };
  }
  b.count += 1;
  return { ok: true, retryAfter: 0 };
}

function sweepBuckets() {
  const now = Date.now();
  for (const [k, v] of buckets) {
    if (now >= v.resetAt) buckets.delete(k);
  }
}

const ALLOWED_VOICES = new Set([
  "ko-KR-SunHiNeural",
  "ko-KR-InJoonNeural",
  "ko-KR-HyunsuMultilingualNeural",
  "ja-JP-NanamiNeural",
  "ja-JP-KeitaNeural",
  "ja-JP-AoiNeural",
  "ja-JP-DaichiNeural",
  "en-US-JennyNeural",
  "en-US-GuyNeural",
  "en-US-AriaNeural",
  "en-US-DavisNeural",
  "zh-CN-XiaoxiaoNeural",
  "zh-CN-YunxiNeural",
  "zh-CN-YunyangNeural",
  "zh-CN-XiaoyiNeural",
]);

const MAX_CHARS = 2000;
const BYTES_PER_SEC = 6000; // 24kHz 48kbps mono mp3
const HUNDRED_NS_PER_MS = 10_000;

function clampRate(v: unknown): string {
  const n = typeof v === "number" ? v : parseInt(String(v ?? 0), 10);
  if (Number.isNaN(n)) return "+0%";
  const c = Math.max(-50, Math.min(50, n));
  return `${c >= 0 ? "+" : ""}${c}%`;
}

function clampPitch(v: unknown): string {
  const n = typeof v === "number" ? v : parseInt(String(v ?? 0), 10);
  if (Number.isNaN(n)) return "+0Hz";
  const c = Math.max(-50, Math.min(50, n));
  return `${c >= 0 ? "+" : ""}${c}Hz`;
}

// 자막 라인 분절: 줄바꿈 · `/` · 문장종결 · 쉼표에서 끊음
function splitScript(raw: string): string[] {
  const HARD_BREAK = /[\n/]/;
  const SENTENCE_END = /[.!?。！？]/;
  const COMMA = /[,、，]/;

  const out: string[] = [];
  let buf = "";
  const flush = () => {
    const t = buf.trim();
    if (t) out.push(t);
    buf = "";
  };

  for (const ch of raw) {
    if (HARD_BREAK.test(ch)) {
      flush();
    } else if (SENTENCE_END.test(ch)) {
      buf += ch;
      flush();
    } else if (COMMA.test(ch)) {
      buf += ch;
      flush();
    } else {
      buf += ch;
    }
  }
  flush();

  // 너무 짧은 조각 (< 4자) 앞에 합치기
  const MIN_LEN = 4;
  const merged: string[] = [];
  for (const s of out) {
    if (merged.length > 0 && s.length < MIN_LEN) {
      merged[merged.length - 1] = merged[merged.length - 1] + " " + s;
    } else {
      merged.push(s);
    }
  }
  return merged;
}

// 정렬용 정규화: 공백·구두점 제거
const PUNCT_WHITESPACE_RE =
  /[\s、。，．,./!?！？()（）「」『』【】〈〉《》—–…·「」『』\-_"'`"“”'‘’　]/g;
function normalizeForAlign(s: string): string {
  return s.replace(PUNCT_WHITESPACE_RE, "");
}

type SrtEntry = { text: string; startMs: number; endMs: number };
type WordEvent = { offset: number; duration: number; text: string };

// WordBoundary 이벤트를 사용해 각 구간의 시작/끝 시간을 계산
// WordBoundary가 부족하면 글자 수 비례로 fallback
function alignSegments(
  segments: string[],
  words: WordEvent[],
  totalDurationMs: number
): SrtEntry[] {
  const segNorms = segments.map(normalizeForAlign);
  const totalChars = segNorms.reduce((a, b) => a + b.length, 0) || 1;

  // WordBoundary가 구간 수보다 적으면 비례 분배
  if (words.length < segments.length) {
    const entries: SrtEntry[] = [];
    let startMs = 0;
    for (let i = 0; i < segments.length; i++) {
      const ratio = segNorms[i].length / totalChars;
      const dur = ratio * totalDurationMs;
      entries.push({ text: segments[i], startMs, endMs: startMs + dur });
      startMs += dur;
    }
    return entries;
  }

  // 누적 목표 글자 수
  const cumulativeTargets: number[] = [];
  let cum = 0;
  for (const len of segNorms.map((s) => s.length)) {
    cum += len;
    cumulativeTargets.push(cum);
  }

  const entries: SrtEntry[] = [];
  let wordIdx = 0;
  let charCount = 0;
  let prevEndMs = 0;

  for (let i = 0; i < segments.length; i++) {
    let endMs = prevEndMs;
    while (wordIdx < words.length && charCount < cumulativeTargets[i]) {
      const w = words[wordIdx];
      charCount += normalizeForAlign(w.text).length;
      endMs = (w.offset + w.duration) / HUNDRED_NS_PER_MS;
      wordIdx++;
    }

    // 마지막 구간은 전체 길이까지 확장
    if (i === segments.length - 1) {
      endMs = totalDurationMs;
    }

    // 비정상적으로 짧으면 최소 300ms 보장
    if (endMs <= prevEndMs) {
      endMs = prevEndMs + 300;
    }

    entries.push({ text: segments[i], startMs: prevEndMs, endMs });
    prevEndMs = endMs;
  }

  return entries;
}

function fmtSrtTime(ms: number): string {
  const clamped = Math.max(0, Math.floor(ms));
  const h = Math.floor(clamped / 3600000);
  const m = Math.floor((clamped % 3600000) / 60000);
  const s = Math.floor((clamped % 60000) / 1000);
  const mmm = clamped % 1000;
  return (
    String(h).padStart(2, "0") +
    ":" +
    String(m).padStart(2, "0") +
    ":" +
    String(s).padStart(2, "0") +
    "," +
    String(mmm).padStart(3, "0")
  );
}

function buildSrt(entries: SrtEntry[]): string {
  let srt = "";
  for (let i = 0; i < entries.length; i++) {
    const { text, startMs, endMs } = entries[i];
    srt +=
      String(i + 1) +
      "\n" +
      fmtSrtTime(startMs) +
      " --> " +
      fmtSrtTime(endMs) +
      "\n" +
      text +
      "\n\n";
  }
  return srt;
}

async function synthesize(
  text: string,
  voice: string,
  rate: string,
  pitch: string
): Promise<{ audio: Buffer; words: WordEvent[] }> {
  const communicate = new Communicate(text, {
    voice,
    rate,
    pitch,
    connectionTimeout: 20_000,
  });
  const audioChunks: Buffer[] = [];
  const words: WordEvent[] = [];

  for await (const chunk of communicate.stream()) {
    if (chunk.type === "audio" && chunk.data) {
      audioChunks.push(Buffer.from(chunk.data));
    } else if (
      chunk.type === "WordBoundary" &&
      typeof chunk.offset === "number" &&
      typeof chunk.duration === "number" &&
      typeof chunk.text === "string" &&
      chunk.text.length > 0
    ) {
      words.push({
        offset: chunk.offset,
        duration: chunk.duration,
        text: chunk.text,
      });
    }
  }

  return { audio: Buffer.concat(audioChunks), words };
}

// 한 번 실패하면 한 번 더 시도
async function synthesizeWithRetry(
  text: string,
  voice: string,
  rate: string,
  pitch: string
): Promise<{ audio: Buffer; words: WordEvent[] }> {
  try {
    const r = await synthesize(text, voice, rate, pitch);
    if (r.audio.length > 0) return r;
    throw new Error("empty audio");
  } catch (_e) {
    await new Promise((r) => setTimeout(r, 800));
    const r = await synthesize(text, voice, rate, pitch);
    if (r.audio.length === 0) throw new Error("Edge TTS returned empty audio");
    return r;
  }
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  if (Math.random() < 0.1) sweepBuckets();
  const ip = getClientIp(req);
  const rl = checkRateLimit(ip);
  if (!rl.ok) {
    res.setHeader("Retry-After", String(rl.retryAfter));
    return res.status(429).json({
      error: `요청이 너무 많습니다. ${rl.retryAfter}초 후 다시 시도해주세요.`,
    });
  }

  const { text, voice, rate, pitch } = (req.body ?? {}) as {
    text?: string;
    voice?: string;
    rate?: number | string;
    pitch?: number | string;
  };

  if (!text || typeof text !== "string" || !text.trim()) {
    return res.status(400).json({ error: "text is required" });
  }
  if (text.length > MAX_CHARS) {
    return res
      .status(400)
      .json({ error: `text too long (max ${MAX_CHARS} chars)` });
  }
  if (!voice || !ALLOWED_VOICES.has(voice)) {
    return res.status(400).json({ error: "invalid voice" });
  }

  // SSML에 안전하도록 / 와 과다 공백을 정규화해서 TTS에 전달
  // (줄바꿈은 자연스러운 호흡으로 유지)
  const ttsText = text
    .replace(/\//g, " ")
    .replace(/[ \t]+/g, " ")
    .trim();

  const segments = splitScript(text);
  if (segments.length === 0) {
    return res.status(400).json({ error: "읽을 문장이 없습니다." });
  }

  try {
    const { audio, words } = await synthesizeWithRetry(
      ttsText,
      voice,
      clampRate(rate),
      clampPitch(pitch)
    );

    if (audio.length === 0) {
      return res.status(502).json({
        error: "Edge TTS에서 빈 응답이 왔습니다. 잠시 후 다시 시도해주세요.",
      });
    }

    const totalDurationMs = (audio.length / BYTES_PER_SEC) * 1000;
    const entries = alignSegments(segments, words, totalDurationMs);
    const srt = buildSrt(entries);

    return res.status(200).json({
      audio: audio.toString("base64"),
      srt,
      segmentCount: segments.length,
      mime: "audio/mpeg",
    });
  } catch (err) {
    const msg = err instanceof Error ? err.message : "tts failed";
    return res.status(502).json({ error: `Edge TTS 실패: ${msg}` });
  }
}
