import type { VercelRequest, VercelResponse } from "@vercel/node";
import { Communicate } from "edge-tts-universal";

// IP당 다단계 레이트리밋 — 분당 5 / 시간당 30 / 하루 100
// 서버리스 인스턴스별 메모리 (콜드 스타트 시 리셋되어 정확하진 않으나 남용 차단 효과)
const LIMITS = [
  { name: "분당", max: 5, windowMs: 60_000 },
  { name: "시간당", max: 30, windowMs: 60 * 60_000 },
  { name: "일별", max: 100, windowMs: 24 * 60 * 60_000 },
];

type Bucket = { count: number; resetAt: number };
const buckets: Map<string, Bucket>[] = LIMITS.map(() => new Map());

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

function checkRateLimit(ip: string): { ok: boolean; retryAfter: number; kind?: string } {
  const now = Date.now();
  for (let i = 0; i < LIMITS.length; i++) {
    const b = buckets[i].get(ip);
    if (b && now < b.resetAt && b.count >= LIMITS[i].max) {
      return {
        ok: false,
        retryAfter: Math.ceil((b.resetAt - now) / 1000),
        kind: LIMITS[i].name,
      };
    }
  }
  for (let i = 0; i < LIMITS.length; i++) {
    const b = buckets[i].get(ip);
    if (!b || now >= b.resetAt) {
      buckets[i].set(ip, { count: 1, resetAt: now + LIMITS[i].windowMs });
    } else {
      b.count += 1;
    }
  }
  return { ok: true, retryAfter: 0 };
}

function sweepBuckets() {
  const now = Date.now();
  for (const map of buckets) {
    for (const [k, v] of map) {
      if (now >= v.resetAt) map.delete(k);
    }
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
  // 영어 (US)
  "en-US-JennyNeural",
  "en-US-GuyNeural",
  "en-US-AriaNeural",
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
      .json({
        error: `${rl.kind} 사용 한도 초과. ${rl.retryAfter}초 후 다시 시도해주세요.`,
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

  try {
    const communicate = new Communicate(text, {
      voice,
      rate: clampRate(rate),
      pitch: clampPitch(pitch),
      connectionTimeout: 20_000,
    });

    const chunks: Buffer[] = [];
    for await (const chunk of communicate.stream()) {
      if (chunk.type === "audio" && chunk.data) {
        chunks.push(Buffer.from(chunk.data));
      }
    }

    const buf = Buffer.concat(chunks);
    if (buf.length === 0) {
      return res.status(502).json({
        error:
          "Edge TTS에서 빈 응답이 왔습니다. 잠시 후 다시 시도해주세요. (text 길이: " +
          text.length +
          ", voice: " +
          voice +
          ")",
      });
    }

    res.setHeader("Content-Type", "audio/mpeg");
    res.setHeader("Content-Length", String(buf.length));
    res.setHeader("Cache-Control", "no-store");
    return res.status(200).send(buf);
  } catch (err) {
    const msg = err instanceof Error ? err.message : "tts failed";
    return res.status(502).json({ error: `Edge TTS 실패: ${msg}` });
  }
}
