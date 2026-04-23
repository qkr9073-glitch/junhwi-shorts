type PlatformCard = {
  href: string;
  icon: string;
  title: string;
  desc: string;
  tone: "red" | "blue";
};

const PLATFORMS: PlatformCard[] = [
  {
    href: "https://www.xiaohongshu.com",
    icon: "📕",
    title: "샤오홍슈 (小红书)",
    desc: "중국 Z세대가 열광하는 라이프스타일 플랫폼. 여행 · 뷰티 · 푸드 쇼츠 레퍼런스의 보고.",
    tone: "red",
  },
  {
    href: "https://www.douyin.com",
    icon: "🎵",
    title: "더우인 (抖音)",
    desc: "중국판 틱톡. 조회수 단위가 다른 중국 쇼츠 시장을 공부하려면 필수 체크.",
    tone: "blue",
  },
];

const GUIDE_URL =
  "https://cafe.naver.com/kangarooshorts?iframe_url_utf8=%2FArticleRead.nhn%253Fclubid%3D31561294%2526articleid%3D270%2526referrerAllArticles%3Dtrue";

const DOWNLOADER_URL = "https://xhs-downloader-sage.vercel.app/";

export default function Home() {
  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-10">
      {/* 헤더 */}
      <div className="mb-6">
        <div className="inline-block px-3 py-1 rounded-full bg-gold/10 text-gold-tip text-[11px] font-semibold mb-3 tracking-wide">
          💛 핸드인캥거루 무료 라이트 버전
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-ink leading-tight">
          🎯 실습 가이드
        </h1>
        <p className="text-[13px] sm:text-sm text-ink-muted mt-2 max-w-2xl leading-relaxed">
          무료강의 기준 라이트 실습을 도와드릴게요. 아래 <b className="text-ink">플랫폼 → 로그인 → 다운로더</b> 순서대로 따라가시면 됩니다. 왼쪽 메뉴에서 다른 도구도 바로 이용 가능해요.
        </p>
      </div>

      {/* 1. 플랫폼 */}
      <div className="mb-3 text-[11px] font-bold tracking-wider text-ink-soft uppercase">
        1. 플랫폼 바로가기
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-7">
        {PLATFORMS.map((p) => {
          const toneRing =
            p.tone === "red"
              ? "hover:border-red-400 hover:shadow-[0_8px_28px_rgba(239,68,68,0.15)]"
              : "hover:border-sky-400 hover:shadow-[0_8px_28px_rgba(14,165,233,0.15)]";
          return (
            <a
              key={p.href}
              href={p.href}
              target="_blank"
              rel="noreferrer"
              className={`group card p-5 flex flex-col transition-all ${toneRing}`}
            >
              <div className="flex items-start gap-3 mb-3">
                <div className="text-4xl">{p.icon}</div>
                <div className="flex-1 min-w-0">
                  <h2 className="text-base sm:text-lg font-bold text-ink group-hover:text-gold transition">
                    {p.title}
                  </h2>
                  <div className="text-[11px] text-ink-soft mt-0.5">바로가기 ↗</div>
                </div>
              </div>
              <p className="text-[13px] text-ink-muted leading-relaxed flex-1">
                {p.desc}
              </p>
            </a>
          );
        })}
      </div>

      {/* 2. 로그인 가이드 */}
      <div className="mb-3 text-[11px] font-bold tracking-wider text-ink-soft uppercase">
        2. 로그인 · 사용 가이드
      </div>
      <a
        href={GUIDE_URL}
        target="_blank"
        rel="noreferrer"
        className="group block card p-5 mb-7 hover:border-gold hover:shadow-[0_8px_28px_rgba(200,134,10,0.15)] transition-all"
      >
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-2xl bg-gradient-to-br from-gold/20 to-gold/5 flex items-center justify-center text-2xl shrink-0">
            📖
          </div>
          <div className="flex-1 min-w-0">
            <div className="text-[11px] text-ink-soft">네이버 카페 아티클</div>
            <div className="text-base sm:text-lg font-bold text-ink group-hover:text-gold transition">
              샤오홍슈 · 더우인 로그인 가이드
            </div>
            <p className="text-[12.5px] text-ink-muted mt-0.5">
              가입부터 실제 영상 탐색까지 단계별로 정리했어요.
            </p>
          </div>
          <div className="shrink-0 text-gold font-semibold text-xs sm:text-sm group-hover:translate-x-1 transition-transform">
            읽기 →
          </div>
        </div>
      </a>

      {/* 3. 다운로더 */}
      <div className="mb-3 text-[11px] font-bold tracking-wider text-ink-soft uppercase">
        3. 샤오홍슈 영상 다운로더
      </div>
      <a
        href={DOWNLOADER_URL}
        target="_blank"
        rel="noreferrer"
        className="group block mb-7 rounded-3xl overflow-hidden bg-gradient-to-br from-pink-500 via-red-500 to-rose-500 p-[2px] hover:shadow-[0_12px_36px_rgba(244,63,94,0.32)] transition-all"
      >
        <div className="rounded-[calc(1.5rem-2px)] bg-white p-5">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-2xl bg-gradient-to-br from-pink-500 to-red-500 flex items-center justify-center text-2xl text-white shrink-0 shadow-md">
              ⬇️
            </div>
            <div className="flex-1 min-w-0">
              <div className="text-[11px] font-bold tracking-wider text-pink-600">
                KANGAROO LITE TOOL
              </div>
              <div className="text-base sm:text-lg font-bold text-ink group-hover:text-pink-600 transition">
                URL 한 번에 다운로드
              </div>
              <p className="text-[12.5px] text-ink-muted mt-0.5">
                워터마크 없는 샤오홍슈 영상을 내려받아보세요.
              </p>
            </div>
            <div className="shrink-0 px-3 sm:px-4 py-2 rounded-xl bg-gradient-to-r from-pink-500 to-red-500 text-white text-xs sm:text-sm font-bold whitespace-nowrap group-hover:scale-105 transition shadow-md">
              바로 사용 →
            </div>
          </div>
        </div>
      </a>

      {/* 주의사항 */}
      <div className="rounded-3xl border-2 border-amber-300 bg-gradient-to-br from-amber-50 to-yellow-50 p-5 shadow-sm">
        <div className="flex items-start gap-3">
          <span className="text-2xl leading-none shrink-0">⚠️</span>
          <div className="flex-1">
            <div className="text-base font-bold text-amber-900 mb-2">
              꼭 먼저 읽어주세요
            </div>
            <ul className="space-y-2 text-[13px] text-amber-900 leading-relaxed">
              <li className="flex items-start gap-2">
                <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-amber-600 shrink-0" />
                <span>
                  <b>영상을 사용해도 되는 기준은 공부가 필요합니다.</b>{" "}
                  저작권 · 초상권 · 플랫폼 이용약관을 반드시 확인하세요.
                </span>
              </li>
              <li className="flex items-start gap-2">
                <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-amber-600 shrink-0" />
                <span>
                  <b>무료강의 기반 실습을 위해 자료와 가이드를 첨부합니다!</b>{" "}
                  개인 학습용으로만 사용해 주세요.
                </span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
