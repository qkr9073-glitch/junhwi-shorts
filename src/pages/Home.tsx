import { Link } from "react-router-dom";

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

type Tool = {
  to: string;
  emoji: string;
  title: string;
  desc: string;
  badge?: string;
  pcOnly?: boolean;
  cta: string;
};

const TOOLS: Tool[] = [
  {
    to: "/subtitle",
    emoji: "📝",
    title: "영상 대본 추출",
    desc: "Whisper AI로 영상에서 대사를 텍스트/자막 파일(.txt/.srt/.vtt)로 뽑아드려요.",
    badge: "AI",
    pcOnly: true,
    cta: "대본 추출 시작",
  },
  {
    to: "/game",
    emoji: "🦘",
    title: "캥거루 점프",
    desc: "쉬어가는 시간용 미니 게임. 준휘쌤 이미지를 모으고 최고 기록에 도전하세요.",
    badge: "모바일 OK",
    cta: "게임 시작",
  },
];

const GUIDE_URL =
  "https://cafe.naver.com/kangarooshorts?iframe_url_utf8=%2FArticleRead.nhn%253Fclubid%3D31561294%2526articleid%3D270%2526referrerAllArticles%3Dtrue";

const DOWNLOADER_URL = "https://xhs-downloader-sage.vercel.app/";

const KAKAO_URL = "https://open.kakao.com/o/gH4HL25h";

export default function Home() {
  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-10 sm:py-14">
      <div className="text-center mb-8 sm:mb-12">
        <div className="inline-block px-3 py-1 rounded-full bg-gold/10 text-gold-tip text-[11px] font-semibold mb-4 tracking-wide">
          💛 핸드인캥거루 무료 라이트 버전
        </div>
        <h1 className="text-3xl sm:text-5xl font-bold text-ink leading-tight">
          쇼츠 제작 도우미
        </h1>
        <p className="mt-4 text-[15px] sm:text-base text-ink-muted max-w-lg mx-auto leading-relaxed">
          샤오홍슈 · 더우인 바로가기부터 영상 다운로더, 대본 추출까지.
          <br />
          로그인 없이 브라우저에서 바로 사용하세요.
        </p>
      </div>

      {/* 1. 플랫폼 바로가기 */}
      <div className="mb-4 text-[11px] font-bold tracking-wider text-ink-soft uppercase">
        1. 플랫폼 바로가기
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-5 mb-6">
        {PLATFORMS.map((p) => {
          const toneRing =
            p.tone === "red"
              ? "hover:border-red-400 hover:shadow-[0_8px_32px_rgba(239,68,68,0.15)]"
              : "hover:border-sky-400 hover:shadow-[0_8px_32px_rgba(14,165,233,0.15)]";
          return (
            <a
              key={p.href}
              href={p.href}
              target="_blank"
              rel="noreferrer"
              className={`group card flex flex-col transition-all ${toneRing}`}
            >
              <div className="flex items-start gap-3 mb-3">
                <div className="text-4xl">{p.icon}</div>
                <div className="flex-1">
                  <h2 className="text-lg sm:text-xl font-bold text-ink group-hover:text-gold transition">
                    {p.title}
                  </h2>
                  <div className="text-[11px] text-ink-soft mt-0.5">바로가기 ↗</div>
                </div>
              </div>
              <p className="text-[13.5px] text-ink-muted leading-relaxed flex-1">
                {p.desc}
              </p>
            </a>
          );
        })}
      </div>

      {/* 주의사항 (플랫폼 아래에 위치) */}
      <div className="mb-10 rounded-3xl border-2 border-amber-300 bg-gradient-to-br from-amber-50 to-yellow-50 p-5 sm:p-6 shadow-sm">
        <div className="flex items-start gap-3">
          <span className="text-2xl leading-none shrink-0">⚠️</span>
          <div className="flex-1">
            <div className="text-base sm:text-lg font-bold text-amber-900 mb-2">
              꼭 먼저 읽어주세요
            </div>
            <ul className="space-y-2 text-[13.5px] sm:text-sm text-amber-900 leading-relaxed">
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

      {/* 2. 로그인 가이드 */}
      <div className="mb-4 text-[11px] font-bold tracking-wider text-ink-soft uppercase">
        2. 로그인 · 사용 가이드
      </div>
      <a
        href={GUIDE_URL}
        target="_blank"
        rel="noreferrer"
        className="group block card mb-10 hover:border-gold hover:shadow-[0_8px_32px_rgba(200,134,10,0.15)] transition-all"
      >
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-gold/20 to-gold/5 flex items-center justify-center text-2xl shrink-0">
            📖
          </div>
          <div className="flex-1 min-w-0">
            <div className="text-[11px] text-ink-soft">네이버 카페 아티클</div>
            <div className="text-base sm:text-lg font-bold text-ink group-hover:text-gold transition">
              샤오홍슈 · 더우인 로그인 가이드
            </div>
            <p className="text-[13px] text-ink-muted mt-1">
              가입부터 실제 영상 탐색까지 단계별로 정리했어요.
            </p>
          </div>
          <div className="shrink-0 text-gold font-semibold text-sm group-hover:translate-x-1 transition-transform">
            읽으러 가기 →
          </div>
        </div>
      </a>

      {/* 3. 영상 다운로더 */}
      <div className="mb-4 text-[11px] font-bold tracking-wider text-ink-soft uppercase">
        3. 샤오홍슈 영상 다운로더
      </div>
      <a
        href={DOWNLOADER_URL}
        target="_blank"
        rel="noreferrer"
        className="group block mb-10 rounded-3xl overflow-hidden bg-gradient-to-br from-pink-500 via-red-500 to-rose-500 p-[2px] hover:shadow-[0_12px_40px_rgba(244,63,94,0.35)] transition-all"
      >
        <div className="rounded-[calc(1.5rem-2px)] bg-white p-5 sm:p-6">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-pink-500 to-red-500 flex items-center justify-center text-2xl text-white shrink-0 shadow-md">
              ⬇️
            </div>
            <div className="flex-1 min-w-0">
              <div className="text-[11px] font-bold tracking-wider text-pink-600">
                KANGAROO LITE TOOL
              </div>
              <div className="text-base sm:text-lg font-bold text-ink group-hover:text-pink-600 transition">
                URL 한 번에 다운로드
              </div>
              <p className="text-[13px] text-ink-muted mt-1">
                워터마크 없는 샤오홍슈 영상을 내려받아보세요.
              </p>
            </div>
            <div className="shrink-0 px-3 sm:px-4 py-2 rounded-xl bg-gradient-to-r from-pink-500 to-red-500 text-white text-xs sm:text-sm font-bold whitespace-nowrap group-hover:scale-105 transition shadow-md">
              바로 사용 →
            </div>
          </div>
        </div>
      </a>

      {/* 4. 브라우저 도구 */}
      <div className="mb-4 text-[11px] font-bold tracking-wider text-ink-soft uppercase">
        4. 브라우저 도구
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-5 mb-10">
        {TOOLS.map((t) => (
          <Link
            key={t.to}
            to={t.to}
            className="group card hover:border-gold hover:shadow-[0_8px_32px_rgba(200,134,10,0.15)] transition-all flex flex-col"
          >
            <div className="flex items-start justify-between mb-3">
              <div className="text-4xl">{t.emoji}</div>
              <div className="flex flex-col items-end gap-1">
                {t.badge && (
                  <span className="px-2.5 py-1 rounded-full bg-gold/10 text-gold-tip text-[10px] font-bold tracking-wide">
                    {t.badge}
                  </span>
                )}
                {t.pcOnly && (
                  <span className="px-2.5 py-1 rounded-full bg-amber-100 text-amber-800 text-[10px] font-bold tracking-wide border border-amber-300">
                    💻 PC 권장
                  </span>
                )}
              </div>
            </div>
            <h2 className="text-xl font-bold text-ink mb-2 group-hover:text-gold transition">
              {t.title}
            </h2>
            <p className="text-[13.5px] text-ink-muted leading-relaxed flex-1 mb-4">
              {t.desc}
            </p>
            <div className="inline-flex items-center gap-1.5 text-gold font-semibold text-sm group-hover:gap-2.5 transition-all">
              {t.cta}
              <span aria-hidden>→</span>
            </div>
          </Link>
        ))}
      </div>

      {/* 5. 오픈채팅 배너 (HOT) */}
      <a
        href={KAKAO_URL}
        target="_blank"
        rel="noreferrer"
        className="relative block group rounded-3xl overflow-hidden"
      >
        <div className="absolute -inset-1 rounded-3xl bg-gradient-to-r from-yellow-300 via-amber-400 to-yellow-300 blur-lg opacity-60 group-hover:opacity-90 animate-pulse" />
        <div className="relative rounded-3xl bg-gradient-to-br from-[#FEE500] via-[#FFD900] to-[#FEE500] p-5 sm:p-6 shadow-[0_12px_40px_rgba(254,229,0,0.5)] ring-2 ring-yellow-400 group-hover:scale-[1.01] transition-transform">
          <div className="absolute top-3 right-3 px-2.5 py-1 rounded-full bg-red-500 text-white text-[10px] font-bold tracking-wider animate-bounce shadow-md">
            🔥 HOT
          </div>
          <div className="flex items-center gap-4 sm:gap-5">
            <div className="shrink-0 w-14 h-14 sm:w-16 sm:h-16 rounded-2xl bg-[#3C1E1E] flex items-center justify-center text-3xl sm:text-4xl shadow-inner">
              💬
            </div>
            <div className="flex-1 min-w-0 text-left">
              <div className="text-[11px] sm:text-xs font-bold text-[#3C1E1E]/70 mb-0.5 tracking-wide">
                👋 쇼츠 크리에이터라면 필수!
              </div>
              <div className="text-base sm:text-xl font-extrabold text-[#3C1E1E] leading-tight">
                박준휘 쇼츠 커뮤니티 오픈채팅
              </div>
              <div className="text-[12px] sm:text-[13px] text-[#3C1E1E]/80 mt-1 leading-snug">
                실시간 꿀팁 · 트렌드 공유 · 질문 답변 · 함께 성장하는 동료들
              </div>
            </div>
            <div className="shrink-0 flex flex-col items-center gap-1">
              <div className="px-3 sm:px-4 py-2 sm:py-2.5 rounded-xl bg-[#3C1E1E] text-[#FEE500] text-xs sm:text-sm font-bold whitespace-nowrap group-hover:bg-black transition shadow-md">
                무료 입장 →
              </div>
            </div>
          </div>
        </div>
      </a>
    </div>
  );
}
