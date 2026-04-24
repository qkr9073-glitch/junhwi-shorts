import type { VercelRequest, VercelResponse } from "@vercel/node";
import { MsEdgeTTS, OUTPUT_FORMAT } from "msedge-tts";

// 간단한 IP당 레이트리밋 — 분당 10회
// 서버리스 인스턴스별로 메모리 유지 (콜드 스타트 시 리셋)
const RATE_LIMIT_MAX = 10;
const RATE_LIMIT_WINDOW_MS = 60_000;
type Bucket = { count: number; resetAt: number };
const buckets = new Map<string, Bucket>();

function getClientIp(req: VercelRequest): string {
  const fwd = req.headers["x-forwarded-for"];
  if (typeof fwd === "string" && fwd.length > 0) {
    return fwd.split(",")[0].trim();
  }
  if (Array.isArray(fwd) && fwd.length > 0) {
    return fwd[0];
  }
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

// 메모리 누수 방지 — 가끔 만료된 버킷 청소
function sweepBuckets() {
  const now = Date.now();
  for (const [k, v] of buckets) {
    if (now >= v.resetAt) buckets.delete(k);
  }
}

const ALLOWED_VOICES = new Set([
  // 한국어
  "ko-KR-SunHiNeural",
  "ko-KR-InJoonNeural",
  "ko-KR-HyunsuMultilingualNeural",
  // 일본어
  "ja-JP-NanamiNeural",
  "ja-JP-KeitaNeural",
  "ja-JP-AoiNeural",
  "ja-JP-DaichiNeural",
  // 영어 (US)
  "en-US-JennyNeural",
  "en-US-GuyNeural",
  "en-US-AriaNeural",
  "en-US-DavisNeural",
  // 중국어 (Mandarin)
  "zh-CN-XiaoxiaoNeural",
  "zh-CN-YunxiNeural",
  "zh-CN-YunyangNeural",
  "zh-CN-XiaoyiNeural",
]);

const MAX_CHARS = 2000;

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

function escapeSSML(s: string): string {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  // 레이트리밋 체크
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

  try {
    const tts = new MsEdgeTTS();
    await tts.setMetadata(
      voice,
      OUTPUT_FORMAT.AUDIO_24KHZ_48KBITRATE_MONO_MP3
    );
    const { audioStream } = tts.toStream(escapeSSML(text), {
      rate: clampRate(rate),
      pitch: clampPitch(pitch),
    });

    const chunks: Buffer[] = [];
    await new Promise<void>((resolve, reject) => {
      audioStream.on("data", (c: Buffer) => chunks.push(c));
      audioStream.on("end", () => resolve());
      audioStream.on("error", reject);
    });

    const buf = Buffer.concat(chunks);
    res.setHeader("Content-Type", "audio/mpeg");
    res.setHeader("Content-Length", String(buf.length));
    res.setHeader("Cache-Control", "no-store");
    return res.status(200).send(buf);
  } catch (err) {
    const msg = err instanceof Error ? err.message : "tts failed";
    return res.status(500).json({ error: msg });
  }
}
