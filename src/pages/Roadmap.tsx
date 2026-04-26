import { useState } from "react";

const GPT_URL =
  "https://chatgpt.com/g/g-69eb8a5ea1fc8191a21d749742f1806a-serobueob-rodeumaeb";

const GREETING =
  "안녕하세요! 제 상황에 맞는 쇼츠 부업 전략 로드맵을 짜주세요.";

const QUESTIONS = [
  "다른 부업을 해보신 경험이 있으신가요?",
  "쇼츠 부업은 처음이신가요?",
  "컴퓨터 활용은 어느 정도 가능하신가요?",
  "나이대는 어느 정도이신가요?",
  "하루에 투자 가능하신 시간은 어느 정도이신가요?",
];

export default function Roadmap() {
  const [copied, setCopied] = useState(false);

  async function handleCopy() {
    try {
      await navigator.clipboard.writeText(GREETING);
      setCopied(true);
      setTimeout(() => setCopied(false), 1800);
    } catch {
      // ignore
    }
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-10">
      {/* 히어로 */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-[#070b22] via-[#1a2350] to-[#070b22] animate-gradient-shift p-6 sm:p-10 shadow-[0_20px_56px_rgba(10,15,40,0.45)] mb-6">
        <div className="absolute -top-16 -right-12 w-52 h-52 bg-cyan-400/30 rounded-full blur-3xl pointer-events-none animate-blob-1" />
        <div className="absolute -bottom-20 -left-12 w-60 h-60 bg-amber-300/25 rounded-full blur-3xl pointer-events-none animate-blob-2" />
        <div
          className="absolute top-1/3 left-1/2 -translate-x-1/2 w-44 h-44 bg-pink-300/15 rounded-full blur-3xl pointer-events-none animate-blob-1"
          style={{ animationDelay: "5s" }}
        />
        <div className="relative flex flex-col items-center text-center">
          <img
            src="/logo-neon.png"
            alt="핸드인캥거루"
            className="w-36 sm:w-48 h-auto animate-float-neon select-none"
            draggable={false}
          />
          <div
            className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-300/15 text-cyan-200 border border-cyan-300/40 text-[11px] sm:text-[12px] font-extrabold tracking-wider mt-5 mb-4 animate-fade-up"
            style={{ animationDelay: "0.1s" }}
          >
            🎯 START HERE · 1단계
          </div>
          <h1
            className="text-[26px] sm:text-4xl font-extrabold text-white leading-[1.2] animate-fade-up"
            style={{ animationDelay: "0.2s" }}
          >
            나에게 딱 맞는
            <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-300 via-amber-200 to-pink-300 animate-shimmer-text">
              쇼츠 부업 로드맵
            </span>
          </h1>
          <p
            className="text-[13.5px] sm:text-[15.5px] text-white/80 mt-3 leading-relaxed max-w-xl animate-fade-up"
            style={{ animationDelay: "0.35s" }}
          >
            AI 전략 상담 봇이{" "}
            <b className="text-amber-200">딱 5가지 질문</b>으로 당신에게 가장
            어울리는 쇼츠 부업 방향을 알려줍니다. 무료, 회원가입 X, 1분 안에
            결과.
          </p>
          <div
            className="animate-fade-up inline-block mt-5 sm:mt-6"
            style={{ animationDelay: "0.5s" }}
          >
            <a
              href={GPT_URL}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-2 px-5 sm:px-7 py-3 sm:py-4 rounded-2xl bg-gradient-to-r from-amber-300 to-yellow-200 hover:from-yellow-200 hover:to-amber-300 text-[#1f2540] font-extrabold text-[14px] sm:text-[16px] transition-all hover:scale-[1.04] active:scale-[0.96] animate-cta-breathe"
            >
              🚀 지금 바로 상담 시작하기
              <span className="text-lg">→</span>
            </a>
          </div>
          <div
            className="text-[11px] sm:text-[12px] text-white/60 mt-2 animate-fade-up"
            style={{ animationDelay: "0.65s" }}
          >
            ✨ 챗GPT 무료 계정으로 바로 사용 가능
          </div>
        </div>
      </div>

      {/* 왜 1단계? */}
      <div className="card mb-5 bg-gradient-to-br from-amber-50 via-white to-amber-50 border-2 border-gold/30">
        <div className="flex items-start gap-3">
          <div className="shrink-0 w-10 h-10 sm:w-12 sm:h-12 rounded-2xl bg-gradient-to-br from-gold to-amber-600 text-white flex items-center justify-center text-xl sm:text-2xl shadow-md">
            💡
          </div>
          <div className="flex-1 min-w-0">
            <div className="text-[11px] font-bold tracking-[0.18em] text-gold-tip uppercase mb-1.5">
              왜 이 봇부터 해야 하나요?
            </div>
            <p className="text-[13.5px] sm:text-[14.5px] text-ink leading-relaxed font-semibold">
              쇼츠 부업은{" "}
              <b className="text-gold-tip">사람마다 맞는 방법이 다릅니다.</b>
            </p>
            <p className="text-[12.5px] sm:text-[13px] text-ink-muted mt-1.5 leading-relaxed">
              이 봇은 당신의 경험 · 나이 · 가용 시간을 바탕으로 가장 빨리 결과
              낼 수 있는 방향을 골라줍니다. <b>대부분 1분이면 끝나요.</b>{" "}
              다른 도구(대본 추출 · TTS 성우 등)를 쓰기 전에 먼저 돌려보세요.
            </p>
          </div>
        </div>
      </div>

      {/* 사용법 */}
      <div className="card mb-5">
        <div className="text-[11px] font-bold tracking-[0.18em] text-ink-soft uppercase mb-4">
          📝 사용법 2단계
        </div>

        {/* STEP 1 */}
        <div className="mb-5">
          <div className="flex items-center gap-2 mb-2">
            <span className="w-7 h-7 rounded-full bg-gold text-white flex items-center justify-center text-[12px] font-extrabold shrink-0">
              1
            </span>
            <div className="text-[14px] font-extrabold text-ink">
              아래 인사말을 복사해서 봇에게 보내세요
            </div>
          </div>
          <div className="ml-9">
            <div className="relative p-4 rounded-2xl bg-bg-tip border-2 border-dashed border-gold/40">
              <p className="text-[13.5px] sm:text-[14.5px] font-semibold text-ink leading-relaxed pr-16">
                "{GREETING}"
              </p>
              <button
                type="button"
                onClick={handleCopy}
                className="absolute top-3 right-3 px-3 py-1.5 rounded-xl bg-white border border-borderc-base hover:border-gold hover:text-gold text-[11.5px] font-bold transition"
              >
                {copied ? "✓ 복사됨" : "📋 복사"}
              </button>
            </div>
            <div className="text-[11.5px] text-ink-soft mt-1.5 leading-relaxed">
              💬 물론 본인 말투로 자유롭게 물어봐도 됩니다.
              <br />
              봇이 알아서 5가지 질문을 순서대로 해줘요.
            </div>
          </div>
        </div>

        {/* STEP 2 */}
        <div>
          <div className="flex items-center gap-2 mb-2">
            <span className="w-7 h-7 rounded-full bg-gold text-white flex items-center justify-center text-[12px] font-extrabold shrink-0">
              2
            </span>
            <div className="text-[14px] font-extrabold text-ink">
              봇이 묻는 5가지 질문에 솔직하게 답하기
            </div>
          </div>
          <div className="ml-9 space-y-1.5">
            {QUESTIONS.map((q, i) => (
              <div
                key={i}
                className="flex items-start gap-2.5 p-2.5 rounded-xl bg-white border border-borderc-base"
              >
                <span className="shrink-0 w-6 h-6 rounded-lg bg-gold/15 text-gold-tip flex items-center justify-center text-[11px] font-extrabold">
                  {i + 1}
                </span>
                <span className="text-[12.5px] sm:text-[13px] text-ink font-medium leading-snug">
                  {q}
                </span>
              </div>
            ))}
            <div className="text-[11.5px] text-ink-soft mt-2 leading-relaxed">
              ✅ 답변 후 봇이{" "}
              <b className="text-gold-tip">당신에게 맞는 쇼츠 전략</b>을
              알려줍니다.
            </div>
          </div>
        </div>
      </div>

      {/* 최종 CTA */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-[#FEE500] via-[#FFD900] to-[#FEE500] p-5 sm:p-6 shadow-[0_12px_32px_rgba(254,229,0,0.4)]">
        <div className="absolute -top-8 -right-8 w-32 h-32 bg-white/30 rounded-full blur-2xl pointer-events-none" />
        <div className="relative flex flex-col sm:flex-row sm:items-center gap-4">
          <div className="flex-1">
            <div className="text-[13px] sm:text-[14px] font-extrabold text-[#3C1E1E]/80 mb-1">
              🎯 준비 끝! 이제 상담을 시작해볼까요?
            </div>
            <div className="text-[16px] sm:text-[18px] font-extrabold text-[#3C1E1E] leading-tight">
              딱 1분, 5개 질문에 답하면
              <br className="sm:hidden" /> 당신만의 로드맵이 나옵니다.
            </div>
          </div>
          <a
            href={GPT_URL}
            target="_blank"
            rel="noreferrer"
            className="shrink-0 inline-flex items-center justify-center gap-2 px-5 sm:px-6 py-3 sm:py-3.5 rounded-2xl bg-[#3C1E1E] hover:bg-black text-[#FEE500] font-extrabold text-[14px] sm:text-[15px] shadow-md transition"
          >
            새로부업 로드맵 열기
            <span className="text-lg">→</span>
          </a>
        </div>
      </div>

      {/* 안내 */}
      <div className="mt-5 p-4 rounded-2xl bg-bg-base border border-borderc-base text-[11.5px] text-ink-muted leading-relaxed">
        <div className="font-bold text-ink mb-1">ℹ️ 참고사항</div>
        <ul className="list-disc pl-5 space-y-0.5">
          <li>이 봇은 OpenAI 챗GPT의 GPTs 기능으로 만들어졌습니다.</li>
          <li>
            상담은 완전 무료이며, 챗GPT 무료 계정이 있으면 바로 사용 가능해요.
          </li>
          <li>
            추천받은 전략을 본격적으로 파려면{" "}
            <b>유료 수강 과정(대본 작성 봇 · TTS 가이드)</b>이 준비되어 있어요.
          </li>
        </ul>
      </div>
    </div>
  );
}
