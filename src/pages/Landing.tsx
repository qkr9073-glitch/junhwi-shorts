import { Link } from "react-router-dom";

const TOOLS = [
  { emoji: "🎯", label: "맞춤 로드맵", to: "/roadmap" },
  { emoji: "🎙️", label: "AI 성우", to: "/tts" },
  { emoji: "📝", label: "대본 추출", to: "/subtitle" },
  { emoji: "🗺️", label: "쇼츠 설계도", to: "/blueprints" },
  { emoji: "📚", label: "전자책 서재", to: "/ebooks" },
  { emoji: "🦘", label: "캥거루 점프", to: "/game" },
];

export default function Landing() {
  return (
    <div className="relative min-h-[100dvh] overflow-hidden bg-gradient-to-br from-[#04081a] via-[#0d1530] to-[#04081a] animate-gradient-shift flex flex-col items-center justify-center px-6 py-10 sm:py-14">
      {/* 떠다니는 블러 블롭 */}
      <div className="absolute -top-20 -right-16 w-72 h-72 bg-cyan-400/25 rounded-full blur-3xl pointer-events-none animate-blob-1" />
      <div className="absolute -bottom-24 -left-16 w-80 h-80 bg-amber-300/20 rounded-full blur-3xl pointer-events-none animate-blob-2" />
      <div
        className="absolute top-1/3 left-1/2 -translate-x-1/2 w-64 h-64 bg-pink-400/12 rounded-full blur-3xl pointer-events-none animate-blob-1"
        style={{ animationDelay: "5s" }}
      />

      {/* 콘텐츠 */}
      <div className="relative z-10 w-full max-w-2xl flex flex-col items-center text-center">
        {/* 로고 — mix-blend-mode: screen 으로 검정 배경 자동 제거 */}
        <img
          src="/logo-neonver2.png"
          alt="박준휘 쇼츠 도구"
          className="w-44 sm:w-56 h-auto animate-float-neon select-none"
          style={{ mixBlendMode: "screen" }}
          draggable={false}
        />

        {/* 작은 라벨 */}
        <div
          className="mt-7 inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-cyan-300/10 text-cyan-200 border border-cyan-300/30 text-[10px] sm:text-[11px] font-extrabold tracking-[0.25em] animate-fade-up"
          style={{ animationDelay: "0.1s" }}
        >
          BY 박준휘 강사
        </div>

        {/* 메인 타이틀 */}
        <h1
          className="mt-3 text-[36px] sm:text-[56px] font-black text-white leading-[1.08] tracking-tight animate-fade-up"
          style={{ animationDelay: "0.2s" }}
        >
          쇼츠를 만드는
          <br />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-300 via-amber-200 to-pink-300 animate-shimmer-text">
            모든 도구
          </span>
        </h1>

        {/* 설명 카피 */}
        <p
          className="mt-5 text-[13px] sm:text-[14.5px] text-white/70 leading-relaxed max-w-md animate-fade-up"
          style={{ animationDelay: "0.35s" }}
        >
          이 프로그램은 <b className="text-white">박준휘 강사의 수강생 전용</b>입니다.
          무료로 아래 기능을 <b className="text-amber-200">무제한 사용</b>할 수 있으며,
          상향 기능은 정규 수강생만 이용 가능하지만{" "}
          <b className="text-white">현재 탑재된 기능만으로 충분히 실습</b>이 가능합니다.
        </p>

        {/* 도구 6개 미니 그리드 */}
        <div
          className="mt-8 sm:mt-10 grid grid-cols-3 sm:grid-cols-6 gap-2 sm:gap-3 w-full animate-fade-up"
          style={{ animationDelay: "0.5s" }}
        >
          {TOOLS.map((t) => (
            <Link
              key={t.to}
              to={t.to}
              className="flex flex-col items-center justify-center gap-1.5 px-2 py-3.5 rounded-2xl bg-white/[0.03] border border-white/10 hover:border-cyan-300/50 hover:bg-white/[0.07] hover:-translate-y-1 transition-all backdrop-blur-sm"
            >
              <span className="text-2xl sm:text-[28px]">{t.emoji}</span>
              <span className="text-[10.5px] sm:text-[11.5px] font-bold text-white/85 leading-tight text-center">
                {t.label}
              </span>
            </Link>
          ))}
        </div>

        {/* CTA */}
        <div
          className="mt-9 sm:mt-12 animate-fade-up inline-block"
          style={{ animationDelay: "0.65s" }}
        >
          <Link
            to="/roadmap"
            className="inline-flex items-center gap-2 px-8 py-4 sm:px-10 sm:py-5 rounded-2xl bg-gradient-to-r from-amber-300 to-yellow-200 hover:from-yellow-200 hover:to-amber-300 text-[#0d1530] font-black text-[15px] sm:text-[17px] tracking-tight transition-all hover:scale-[1.04] active:scale-[0.96] animate-cta-breathe"
          >
            시작하기
            <span className="text-xl">→</span>
          </Link>
        </div>

        {/* 작은 푸터 */}
        <div
          className="mt-10 text-[10.5px] text-white/35 tracking-[0.15em] animate-fade-up"
          style={{ animationDelay: "0.8s" }}
        >
          © HANDINKANGAROO · 무단 복제 금지
        </div>
      </div>
    </div>
  );
}
