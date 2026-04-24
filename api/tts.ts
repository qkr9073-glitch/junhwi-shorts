import type { VercelRequest, VercelResponse } from "@vercel/node";
import { Communicate } from "edge-tts-universal";

// 레이트리밋 — IP당 분당 10회 (서버리스 인스턴스별 메모리, 콜드 스타트 시 리셋)
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
const MAX_SEGMENTS = 40;
const CONCURRENCY = 6;

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

// 자막용 분절 규칙:
// 1) 줄바꿈 → 무조건 끊기
// 2) `/` → 사용자 수동 호흡 마커
// 3) `.!?。！？` 등 문장 종결 → 끊기
// 4) `,、，` 쉼표 → 끊기 (단, 너무 짧은 조각은 뒤에 합치기)
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

  // 너무 짧은 조각 (< 4자)은 앞 조각에 합쳐서 자막이 잘리지 않게
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

async function synthesizeOne(
  text: string,
  voice: string,
  rate: string,
  pitch: string
): Promise<Buffer> {
  const communicate = new Communicate(text, {
    voice,
    rate,
    pitch,
    connectionTimeout: 15_000,
  });
  const chunks: Buffer[] = [];
  for await (const chunk of communicate.stream()) {
    if (chunk.type === "audio" && chunk.data) {
      chunks.push(Buffer.from(chunk.data));
    }
  }
  return Buffer.concat(chunks);
}

async function synthesizeAll(
  segments: string[],
  voice: string,
  rate: string,
  pitch: string
): Promise<Buffer[]> {
  const results: Buffer[] = new Array(segments.length);
  for (let i = 0; i < segments.length; i += CONCURRENCY) {
    const batch = segments.slice(i, i + CONCURRENCY);
    const batchRes = await Promise.all(
      batch.map((seg) => synthesizeOne(seg, voice, rate, pitch))
    );
    for (let j = 0; j < batchRes.length; j++) {
      results[i + j] = batchRes[j];
    }
  }
  return results;
}

// 24kHz 48kbps mono mp3 = 6000 bytes/sec → 바이트 수로 정확한 재생 시간 계산
const BYTES_PER_SEC = 6000;

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

function buildSrt(
  entries: { text: string; durationMs: number }[]
): string {
  let srt = "";
  let startMs = 0;
  for (let i = 0; i < entries.length; i++) {
    const { text, durationMs } = entries[i];
    const endMs = startMs + durationMs;
    srt +=
      String(i + 1) +
      "\n" +
      fmtSrtTime(startMs) +
      " --> " +
      fmtSrtTime(endMs) +
      "\n" +
      text +
      "\n\n";
    startMs = endMs;
  }
  return srt;
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
    return res
      .status(429)
      .json({ error: `요청이 너무 많습니다. ${rl.retryAfter}초 후 다시 시도해주세요.` });
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

  const segments = splitScript(text);
  if (segments.length === 0) {
    return res.status(400).json({ error: "읽을 문장이 없습니다." });
  }
  if (segments.length > MAX_SEGMENTS) {
    return res.status(400).json({
      error: `대본이 너무 많이 분절됩니다 (${segments.length}개). 최대 ${MAX_SEGMENTS}개까지. 짧은 문장을 합치거나 대본을 줄여주세요.`,
    });
  }

  const rateStr = clampRate(rate);
  const pitchStr = clampPitch(pitch);

  try {
    const audioBuffers = await synthesizeAll(segments, voice, rateStr, pitchStr);

    const entries: { text: string; durationMs: number }[] = [];
    for (let i = 0; i < segments.length; i++) {
      const buf = audioBuffers[i];
      if (!buf || buf.length === 0) {
        return res.status(502).json({
          error: `구간 ${i + 1} 합성 실패 (빈 오디오). 다시 시도해주세요.`,
        });
      }
      entries.push({
        text: segments[i],
        durationMs: (buf.length / BYTES_PER_SEC) * 1000,
      });
    }

    const combined = Buffer.concat(audioBuffers);
    const srt = buildSrt(entries);

    return res.status(200).json({
      audio: combined.toString("base64"),
      srt,
      segmentCount: segments.length,
      mime: "audio/mpeg",
    });
  } catch (err) {
    const msg = err instanceof Error ? err.message : "tts failed";
    return res.status(502).json({ error: `Edge TTS 실패: ${msg}` });
  }
}
