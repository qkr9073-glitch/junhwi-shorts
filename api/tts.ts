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
const MAX_SEGMENTS = 30;
const CONCURRENCY = 2;
const SEGMENT_RETRY = 5;
const RETRY_BACKOFF_MS = [500, 1200, 2500, 4500]; // attempt 1-4 실패 후 대기

function sleep(ms: number): Promise<void> {
  return new Promise((r) => setTimeout(r, ms));
}

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
    connectionTimeout: 12_000,
  });
  const chunks: Buffer[] = [];
  for await (const chunk of communicate.stream()) {
    if (chunk.type === "audio" && chunk.data) {
      chunks.push(Buffer.from(chunk.data));
    }
  }
  return Buffer.concat(chunks);
}

// 개별 구간 실패 시 재시도 (MS 쪽 간헐적 빈 응답 대응)
async function synthesizeWithRetry(
  text: string,
  voice: string,
  rate: string,
  pitch: string
): Promise<Buffer> {
  let lastErr: unknown = null;
  for (let attempt = 1; attempt <= SEGMENT_RETRY; attempt++) {
    try {
      const buf = await synthesizeOne(text, voice, rate, pitch);
      if (buf.length > 0) return buf;
      lastErr = new Error("empty audio");
    } catch (e) {
      lastErr = e;
    }
    if (attempt < SEGMENT_RETRY) {
      await sleep(RETRY_BACKOFF_MS[attempt - 1] ?? 5000);
    }
  }
  throw lastErr instanceof Error ? lastErr : new Error("synthesis failed");
}

type SegmentError = { index: number; segment: string; error: string };

async function synthesizeAll(
  segments: string[],
  voice: string,
  rate: string,
  pitch: string
): Promise<{ buffers: (Buffer | null)[]; errors: SegmentError[] }> {
  const buffers: (Buffer | null)[] = new Array(segments.length).fill(null);
  const errors: SegmentError[] = [];

  for (let i = 0; i < segments.length; i += CONCURRENCY) {
    const batch = segments.slice(i, i + CONCURRENCY);
    const settled = await Promise.allSettled(
      batch.map((seg) => synthesizeWithRetry(seg, voice, rate, pitch))
    );
    for (let j = 0; j < settled.length; j++) {
      const idx = i + j;
      const r = settled[j];
      if (r.status === "fulfilled") {
        buffers[idx] = r.value;
      } else {
        const msg = r.reason instanceof Error ? r.reason.message : String(r.reason);
        errors.push({ index: idx, segment: segments[idx], error: msg });
      }
    }
    // 배치 사이 MS 쪽 throttle 방지용 짧은 쉼
    if (i + CONCURRENCY < segments.length) await sleep(250);
  }
  return { buffers, errors };
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
    const { buffers, errors } = await synthesizeAll(
      segments,
      voice,
      rateStr,
      pitchStr
    );

    if (errors.length > 0) {
      const first = errors[0];
      const preview =
        first.segment.length > 30
          ? first.segment.slice(0, 30) + "…"
          : first.segment;
      return res.status(502).json({
        error:
          `구간 ${errors.length}/${segments.length}개 생성 실패. ` +
          `예: "${preview}" (${first.error}). ` +
          `잠시 후 다시 시도하거나 대본을 조금 짧게 해주세요.`,
        failedCount: errors.length,
        totalCount: segments.length,
      });
    }

    const entries: { text: string; durationMs: number }[] = [];
    const validBuffers: Buffer[] = [];
    for (let i = 0; i < segments.length; i++) {
      const buf = buffers[i];
      if (!buf || buf.length === 0) {
        return res.status(502).json({
          error: `구간 ${i + 1} 합성 실패 (빈 오디오). 다시 시도해주세요.`,
        });
      }
      validBuffers.push(buf);
      entries.push({
        text: segments[i],
        durationMs: (buf.length / BYTES_PER_SEC) * 1000,
      });
    }

    const combined = Buffer.concat(validBuffers);
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
