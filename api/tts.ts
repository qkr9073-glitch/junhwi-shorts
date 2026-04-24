import type { VercelRequest, VercelResponse } from "@vercel/node";
import { MsEdgeTTS, OUTPUT_FORMAT } from "msedge-tts";

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

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
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
    const { audioStream } = tts.toStream(text, {
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
