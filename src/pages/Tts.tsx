import { useMemo, useRef, useState } from "react";

type Lang = "ko" | "ja" | "en" | "zh";

type Voice = {
  id: string;
  name: string;
  gender: "여" | "남";
  tag: string;
};

const VOICES: Record<Lang, Voice[]> = {
  ko: [
    { id: "ko-KR-SunHiNeural", name: "선희", gender: "여", tag: "밝고 명료 · 광고·내레이션" },
    { id: "ko-KR-InJoonNeural", name: "인준", gender: "남", tag: "차분·신뢰감 · 다큐" },
    { id: "ko-KR-HyunsuMultilingualNeural", name: "현수", gender: "남", tag: "젊고 캐주얼 · 브이로그" },
  ],
  ja: [
    { id: "ja-JP-NanamiNeural", name: "Nanami (ナナミ)", gender: "여", tag: "표준·부드러움" },
    { id: "ja-JP-AoiNeural", name: "Aoi (アオイ)", gender: "여", tag: "밝고 어린 톤" },
    { id: "ja-JP-KeitaNeural", name: "Keita (ケイタ)", gender: "남", tag: "차분·신뢰감" },
    { id: "ja-JP-DaichiNeural", name: "Daichi (ダイチ)", gender: "남", tag: "젊고 자연스러움" },
  ],
  en: [
    { id: "en-US-JennyNeural", name: "Jenny", gender: "여", tag: "친근·대화체 · 브이로그" },
    { id: "en-US-AriaNeural", name: "Aria", gender: "여", tag: "명료·광고·내레이션" },
    { id: "en-US-GuyNeural", name: "Guy", gender: "남", tag: "스탠다드·뉴스" },
    { id: "en-US-DavisNeural", name: "Davis", gender: "남", tag: "젊고 캐주얼" },
  ],
  zh: [
    { id: "zh-CN-XiaoxiaoNeural", name: "晓晓 (Xiaoxiao)", gender: "여", tag: "표준·만능" },
    { id: "zh-CN-XiaoyiNeural", name: "晓伊 (Xiaoyi)", gender: "여", tag: "밝고 어린 톤" },
    { id: "zh-CN-YunxiNeural", name: "云希 (Yunxi)", gender: "남", tag: "젊고 자연스러움" },
    { id: "zh-CN-YunyangNeural", name: "云扬 (Yunyang)", gender: "남", tag: "뉴스·내레이션" },
  ],
};

const LANG_META: Record<Lang, { emoji: string; label: string; sample: string }> = {
  ko: {
    emoji: "🇰🇷",
    label: "한국어",
    sample: "안녕하세요. 준휘쌤 쇼츠 허브입니다. 오늘도 즐거운 쇼츠 만드세요!",
  },
  ja: {
    emoji: "🇯🇵",
    label: "일본어",
    sample: "こんにちは。ショートの世界へようこそ。素敵な一日をお過ごしください。",
  },
  en: {
    emoji: "🇺🇸",
    label: "영어",
    sample: "Hey there! Welcome to Shorts Hub. Let's make something amazing today.",
  },
  zh: {
    emoji: "🇨🇳",
    label: "중국어",
    sample: "大家好，欢迎来到短视频工作室。今天也要加油哦！",
  },
};

const MAX_CHARS = 2000;

export default function Tts() {
  const [lang, setLang] = useState<Lang>("ko");
  const [voiceId, setVoiceId] = useState<string>(VOICES.ko[0].id);
  const [text, setText] = useState<string>(LANG_META.ko.sample);
  const [rate, setRate] = useState<number>(0);
  const [pitch, setPitch] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>("");
  const [audioUrl, setAudioUrl] = useState<string>("");
  const [srt, setSrt] = useState<string>("");
  const [segmentCount, setSegmentCount] = useState<number>(0);
  const audioRef = useRef<HTMLAudioElement>(null);
  const lastUrlRef = useRef<string>("");

  const voices = VOICES[lang];

  function changeLang(next: Lang) {
    setLang(next);
    setVoiceId(VOICES[next][0].id);
    if (!text.trim() || text === LANG_META[lang].sample) {
      setText(LANG_META[next].sample);
    }
  }

  async function handleGenerate() {
    setError("");
    const trimmed = text.trim();
    if (!trimmed) {
      setError("읽을 텍스트를 입력해주세요.");
      return;
    }
    if (trimmed.length > MAX_CHARS) {
      setError(`텍스트가 너무 깁니다. 최대 ${MAX_CHARS}자까지 가능해요.`);
      return;
    }
    setLoading(true);
    try {
      const res = await fetch("/api/tts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text: trimmed, voice: voiceId, rate, pitch }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        throw new Error(data.error ?? `요청 실패 (${res.status})`);
      }
      if (typeof data.audio !== "string") {
        throw new Error("응답 형식 오류");
      }
      // base64 → Blob
      const binStr = atob(data.audio);
      const bytes = new Uint8Array(binStr.length);
      for (let i = 0; i < binStr.length; i++) bytes[i] = binStr.charCodeAt(i);
      const blob = new Blob([bytes], { type: data.mime ?? "audio/mpeg" });
      const url = URL.createObjectURL(blob);
      if (lastUrlRef.current) URL.revokeObjectURL(lastUrlRef.current);
      lastUrlRef.current = url;
      setAudioUrl(url);
      setSrt(typeof data.srt === "string" ? data.srt : "");
      setSegmentCount(
        typeof data.segmentCount === "number" ? data.segmentCount : 0
      );
      setTimeout(() => {
        audioRef.current?.play().catch(() => {});
      }, 50);
    } catch (e) {
      const msg = e instanceof Error ? e.message : "생성 실패";
      setError(msg);
    } finally {
      setLoading(false);
    }
  }

  function handleDownloadSrt() {
    if (!srt) return;
    const blob = new Blob([srt], { type: "text/plain;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    const langLabel = LANG_META[lang].label;
    const v = voices.find((x) => x.id === voiceId)?.name ?? voiceId;
    a.download = `tts_${langLabel}_${v}_${Date.now()}.srt`.replace(/\s+/g, "");
    document.body.appendChild(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(url);
  }

  function handleDownload() {
    if (!audioUrl) return;
    const a = document.createElement("a");
    a.href = audioUrl;
    const langLabel = LANG_META[lang].label;
    const v = voices.find((x) => x.id === voiceId)?.name ?? voiceId;
    a.download = `tts_${langLabel}_${v}_${Date.now()}.mp3`.replace(/\s+/g, "");
    document.body.appendChild(a);
    a.click();
    a.remove();
  }

  const charCount = useMemo(() => text.length, [text]);
  const overLimit = charCount > MAX_CHARS;

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-10">
      {/* 헤더 */}
      <div className="mb-6 sm:mb-8">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-gold/10 text-gold-tip text-[11px] font-extrabold tracking-wider mb-3">
          🎙️ AI 음성 · 무료 · 로그인 없음
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-ink leading-tight">
          AI 성우 (TTS)
        </h1>
        <p className="text-[13.5px] sm:text-[14.5px] text-ink-muted mt-2 leading-relaxed">
          한국어 · 일본어 · 영어 · 중국어 쇼츠 내레이션을 무료로 생성하세요.
          대본을 넣고 성우를 고르면 mp3로 바로 받을 수 있어요.
        </p>
      </div>

      {/* 실습 안내 배너 */}
      <div className="relative mb-5 rounded-3xl overflow-hidden border-2 border-gold/40 bg-gradient-to-br from-amber-50 via-white to-amber-50 shadow-[0_8px_24px_rgba(200,134,10,0.12)]">
        <div className="absolute top-0 right-0 w-32 h-32 bg-gold/10 rounded-full blur-3xl pointer-events-none" />
        <div className="relative p-4 sm:p-5">
          <div className="flex items-start gap-3">
            <div className="shrink-0 w-10 h-10 sm:w-12 sm:h-12 rounded-2xl bg-gradient-to-br from-gold to-amber-600 text-white flex items-center justify-center text-xl sm:text-2xl shadow-md">
              🎓
            </div>
            <div className="flex-1 min-w-0">
              <div className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-gold text-white text-[10px] sm:text-[11px] font-extrabold tracking-wider mb-1.5">
                ✨ 평생 무료 실습
              </div>
              <p className="text-[13px] sm:text-[14px] text-ink leading-relaxed font-semibold">
                <b className="text-gold-tip">전자책</b>과{" "}
                <b className="text-gold-tip">쇼츠 설계도</b>를 바탕으로,
                여러분들이 AI 성우 대본 작성을{" "}
                <b className="text-gold-tip">"평생 무료"</b>로 실습해 볼 수 있습니다.
              </p>
              <p className="text-[11.5px] sm:text-[12px] text-ink-muted mt-1.5 leading-relaxed">
                🔒 업그레이드 버전 <b>대본 작성 봇</b>과 <b>TTS 작성 가이드</b>는{" "}
                유료 수강생 전용입니다.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* 언어 선택 */}
      <div className="card mb-4">
        <div className="text-[11px] font-bold tracking-[0.18em] text-ink-soft uppercase mb-3">
          1. 언어 선택
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 sm:gap-3">
          {(Object.keys(LANG_META) as Lang[]).map((k) => {
            const m = LANG_META[k];
            const active = lang === k;
            return (
              <button
                key={k}
                type="button"
                onClick={() => changeLang(k)}
                className={[
                  "flex items-center gap-2 px-3 py-3 min-h-[48px] rounded-2xl border-2 transition-all",
                  active
                    ? "bg-gradient-to-br from-gold/15 to-amber-50 border-gold shadow-[0_4px_16px_rgba(200,134,10,0.18)]"
                    : "bg-white border-borderc-base hover:border-gold/40",
                ].join(" ")}
              >
                <span className="text-xl sm:text-2xl">{m.emoji}</span>
                <span className="text-[13px] sm:text-[14px] font-extrabold text-ink">
                  {m.label}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* 성우 선택 */}
      <div className="card mb-4">
        <div className="text-[11px] font-bold tracking-[0.18em] text-ink-soft uppercase mb-3">
          2. 성우 선택
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
          {voices.map((v) => {
            const active = voiceId === v.id;
            return (
              <button
                key={v.id}
                type="button"
                onClick={() => setVoiceId(v.id)}
                className={[
                  "flex items-center gap-3 px-3.5 py-3 rounded-2xl border-2 text-left transition-all",
                  active
                    ? "bg-gradient-to-br from-gold/15 to-amber-50 border-gold shadow-[0_4px_16px_rgba(200,134,10,0.18)]"
                    : "bg-white border-borderc-base hover:border-gold/40",
                ].join(" ")}
              >
                <span
                  className={[
                    "w-9 h-9 rounded-xl flex items-center justify-center text-[13px] font-extrabold shrink-0",
                    v.gender === "여"
                      ? "bg-pink-100 text-pink-600"
                      : "bg-sky-100 text-sky-600",
                  ].join(" ")}
                >
                  {v.gender}
                </span>
                <div className="flex-1 min-w-0">
                  <div className="text-[13.5px] font-extrabold text-ink leading-tight truncate">
                    {v.name}
                  </div>
                  <div className="text-[11px] text-ink-soft mt-0.5 truncate">
                    {v.tag}
                  </div>
                </div>
                {active && <span className="text-gold text-base">✓</span>}
              </button>
            );
          })}
        </div>
      </div>

      {/* 텍스트 입력 */}
      <div className="card mb-4">
        <div className="flex items-center justify-between mb-3">
          <div className="text-[11px] font-bold tracking-[0.18em] text-ink-soft uppercase">
            3. 대본 입력
          </div>
          <div
            className={[
              "text-[11.5px] font-semibold",
              overLimit ? "text-red-500" : "text-ink-soft",
            ].join(" ")}
          >
            {charCount.toLocaleString()} / {MAX_CHARS.toLocaleString()}자
          </div>
        </div>
        <textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          rows={6}
          placeholder="읽을 대본을 붙여넣으세요."
          className="input resize-y min-h-[140px] leading-relaxed"
        />
        <div className="mt-2 px-3 py-2 rounded-xl bg-bg-tip border border-gold/30 text-[11.5px] text-ink-muted leading-relaxed">
          💡 <b className="text-gold-tip">쇼츠 자막 자동 생성</b> — 줄바꿈·마침표·쉼표 기준으로
          대본을 잘게 나눠서 <b>SRT 자막 파일</b>을 같이 뽑아드려요. 호흡 더 세밀히 나누고 싶으면
          문장 중간에 <code className="px-1 rounded bg-white border border-borderc-base">/</code>를
          넣으세요.
        </div>
        <div className="flex flex-wrap items-center gap-2 mt-3">
          <button
            type="button"
            className="btn-sm"
            onClick={() => setText(LANG_META[lang].sample)}
          >
            ✨ 예시 문장
          </button>
          <button
            type="button"
            className="btn-sm"
            onClick={() => setText("")}
          >
            🗑️ 비우기
          </button>
        </div>
      </div>

      {/* 고급 옵션 */}
      <div className="card mb-5">
        <div className="text-[11px] font-bold tracking-[0.18em] text-ink-soft uppercase mb-3">
          4. 속도 · 톤 (선택)
        </div>
        <div className="grid sm:grid-cols-2 gap-4">
          <label className="block">
            <div className="flex items-center justify-between mb-1.5">
              <span className="text-[12.5px] font-bold text-ink">속도</span>
              <span className="text-[12px] font-semibold text-gold-tip tabular-nums">
                {rate >= 0 ? "+" : ""}
                {rate}%
              </span>
            </div>
            <input
              type="range"
              min={-50}
              max={50}
              step={5}
              value={rate}
              onChange={(e) => setRate(parseInt(e.target.value, 10))}
              className="w-full accent-[#c8860a]"
            />
            <div className="flex justify-between text-[10px] text-ink-soft mt-0.5">
              <span>느리게</span>
              <span>기본</span>
              <span>빠르게</span>
            </div>
          </label>
          <label className="block">
            <div className="flex items-center justify-between mb-1.5">
              <span className="text-[12.5px] font-bold text-ink">톤 (높낮이)</span>
              <span className="text-[12px] font-semibold text-gold-tip tabular-nums">
                {pitch >= 0 ? "+" : ""}
                {pitch}Hz
              </span>
            </div>
            <input
              type="range"
              min={-50}
              max={50}
              step={5}
              value={pitch}
              onChange={(e) => setPitch(parseInt(e.target.value, 10))}
              className="w-full accent-[#c8860a]"
            />
            <div className="flex justify-between text-[10px] text-ink-soft mt-0.5">
              <span>낮게</span>
              <span>기본</span>
              <span>높게</span>
            </div>
          </label>
        </div>
      </div>

      {/* 생성 버튼 */}
      <div className="flex flex-col sm:flex-row gap-2 mb-4">
        <button
          type="button"
          onClick={handleGenerate}
          disabled={loading || overLimit || !text.trim()}
          className="btn-primary flex-1 flex items-center justify-center gap-2"
        >
          {loading ? (
            <>
              <span className="inline-block w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />
              생성 중...
            </>
          ) : (
            <>🎙️ 음성 생성하기</>
          )}
        </button>
        {audioUrl && (
          <button
            type="button"
            onClick={handleDownload}
            className="btn-sm sm:w-40 flex items-center justify-center gap-2"
          >
            ⬇️ mp3 저장
          </button>
        )}
        {audioUrl && srt && (
          <button
            type="button"
            onClick={handleDownloadSrt}
            className="btn-sm sm:w-40 flex items-center justify-center gap-2"
          >
            📄 SRT 저장
          </button>
        )}
      </div>

      {error && (
        <div className="mb-4 px-4 py-3 rounded-2xl bg-red-50 border border-red-200 text-[13px] text-red-700">
          ⚠️ {error}
        </div>
      )}

      {audioUrl && (
        <div className="card">
          <div className="flex items-center justify-between mb-3">
            <div className="text-[11px] font-bold tracking-[0.18em] text-ink-soft uppercase">
              🔊 재생
            </div>
            {segmentCount > 0 && (
              <div className="text-[11px] font-bold text-gold-tip">
                📄 자막 {segmentCount}줄 생성됨
              </div>
            )}
          </div>
          <audio ref={audioRef} src={audioUrl} controls className="w-full" />
          {srt && (
            <div className="mt-3 p-3 rounded-xl bg-bg-tip border border-gold/30 text-[11.5px] text-ink-muted leading-relaxed">
              <div className="font-bold text-gold-tip mb-1">🎬 CapCut에 자막 넣는 법</div>
              <ol className="list-decimal pl-5 space-y-0.5">
                <li><b>mp3 저장</b> · <b>SRT 저장</b> 둘 다 다운로드</li>
                <li>CapCut 타임라인에 mp3 드롭</li>
                <li>상단 메뉴 <b>자막 → 자막 파일 가져오기</b>로 <b>.srt</b> 열기</li>
                <li>호흡 단위로 잘게 나뉜 자막이 자동으로 붙음 ✨</li>
              </ol>
            </div>
          )}
        </div>
      )}

      {/* 안내 */}
      <div className="mt-6 p-4 rounded-2xl bg-bg-tip border border-gold/30 text-[12.5px] text-ink-muted leading-relaxed">
        <div className="font-bold text-gold-tip mb-1">💡 사용 팁</div>
        <ul className="list-disc pl-5 space-y-0.5">
          <li><b className="text-gold-tip">쇼츠 설계도</b>에서 만든 대본을 여기서 공짜로 만들어 볼 수 있습니다! 🎉</li>
          <li>마이크로소프트 Edge 뉴럴 보이스 기반, 완전 무료이며 회원가입·API키 필요 없습니다.</li>
          <li>한 번에 최대 {MAX_CHARS.toLocaleString()}자까지 변환 가능. 긴 대본은 나눠서 생성하세요.</li>
          <li>쇼츠에 쓸 때는 <b>속도 +10~+20%</b> 정도가 자연스러워요.</li>
          <li>생성된 mp3는 편집 툴(프리미어·캡컷·비타)에 바로 넣을 수 있습니다.</li>
        </ul>
      </div>
    </div>
  );
}
