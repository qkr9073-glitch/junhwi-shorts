// 각 보이스가 실제로 MS Edge TTS에서 음성을 돌려주는지 테스트
import { Communicate } from "edge-tts-universal";

const VOICES = [
  { lang: "한국어", id: "ko-KR-SunHiNeural", sample: "안녕하세요. 테스트입니다." },
  { lang: "한국어", id: "ko-KR-InJoonNeural", sample: "안녕하세요. 테스트입니다." },
  { lang: "한국어", id: "ko-KR-HyunsuMultilingualNeural", sample: "안녕하세요. 테스트입니다." },
  { lang: "일본어", id: "ja-JP-NanamiNeural", sample: "こんにちは。テストです。" },
  { lang: "일본어", id: "ja-JP-KeitaNeural", sample: "こんにちは。テストです。" },
  { lang: "일본어", id: "ja-JP-AoiNeural", sample: "こんにちは。テストです。" },
  { lang: "일본어", id: "ja-JP-DaichiNeural", sample: "こんにちは。テストです。" },
  { lang: "영어", id: "en-US-JennyNeural", sample: "Hello, this is a test." },
  { lang: "영어", id: "en-US-GuyNeural", sample: "Hello, this is a test." },
  { lang: "영어", id: "en-US-AriaNeural", sample: "Hello, this is a test." },
  { lang: "영어", id: "en-US-DavisNeural", sample: "Hello, this is a test." },
  { lang: "중국어", id: "zh-CN-XiaoxiaoNeural", sample: "你好，这是一个测试。" },
  { lang: "중국어", id: "zh-CN-YunxiNeural", sample: "你好，这是一个测试。" },
  { lang: "중국어", id: "zh-CN-YunyangNeural", sample: "你好，这是一个测试。" },
  { lang: "중국어", id: "zh-CN-XiaoyiNeural", sample: "你好，这是一个测试。" },
];

async function testVoice(v) {
  try {
    const c = new Communicate(v.sample, {
      voice: v.id,
      connectionTimeout: 15_000,
    });
    const chunks = [];
    for await (const chunk of c.stream()) {
      if (chunk.type === "audio" && chunk.data) {
        chunks.push(chunk.data);
      }
    }
    const total = chunks.reduce((n, b) => n + b.length, 0);
    return { ok: total > 0, bytes: total };
  } catch (e) {
    return { ok: false, error: e.message };
  }
}

console.log("전체 15개 보이스 테스트 시작...\n");
const results = [];
for (const v of VOICES) {
  process.stdout.write(`[${v.lang}] ${v.id} ... `);
  const r = await testVoice(v);
  results.push({ ...v, ...r });
  if (r.ok) {
    console.log(`✅ OK (${r.bytes.toLocaleString()} bytes)`);
  } else {
    console.log(`❌ FAIL — ${r.error ?? "empty"}`);
  }
  await new Promise((r) => setTimeout(r, 300));
}

console.log("\n========= 요약 =========");
const good = results.filter((r) => r.ok);
const bad = results.filter((r) => !r.ok);
console.log(`✅ 정상: ${good.length}개`);
console.log(`❌ 실패: ${bad.length}개`);
if (bad.length > 0) {
  console.log("\n실패 목록:");
  for (const b of bad) console.log(`  - ${b.id}`);
}
