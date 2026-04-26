import { NavLink, Outlet } from "react-router-dom";

const CAFE_URL = "https://cafe.naver.com/kangarooshorts";
const YT_URL = "https://www.youtube.com/@준휘야쇼츠하자";
const KAKAO_URL = "https://open.kakao.com/o/gH4HL25h";

type NavItem = {
  to: string;
  emoji: string;
  label: string;
  desc: string;
  badge?: string;
};

const NAV: NavItem[] = [
  {
    to: "/roadmap",
    emoji: "🎯",
    label: "새로부업 로드맵",
    desc: "5가지 질문으로 내 맞춤 전략 찾기",
    badge: "START",
  },
  {
    to: "/tts",
    emoji: "🎙️",
    label: "AI 성우 (TTS)",
    desc: "한·일·영·중 4개국 내레이션",
    badge: "AI",
  },
  {
    to: "/subtitle",
    emoji: "📝",
    label: "영상 대본 추출",
    desc: "AI 자막·대본 뽑기",
    badge: "AI",
  },
  {
    to: "/game",
    emoji: "🦘",
    label: "캥거루 점프",
    desc: "쉬어가는 미니 게임",
  },
  {
    to: "/blueprints",
    emoji: "🗺️",
    label: "쇼츠 설계도",
    desc: "국가별 GPT (수강자 전용)",
    badge: "🔒 2차",
  },
  {
    to: "/ebooks",
    emoji: "📚",
    label: "전자책 서재",
    desc: "전자책 7권 (수강자 전용)",
    badge: "🔒 1차",
  },
];

function navItemClass(active: boolean) {
  return [
    "group flex items-center gap-3 px-4 py-3 rounded-2xl border-2 transition-all text-left",
    active
      ? "bg-gradient-to-br from-gold/15 to-amber-50 border-gold shadow-[0_4px_16px_rgba(200,134,10,0.18)]"
      : "bg-white border-borderc-base hover:border-gold/40 hover:bg-bg-tip/40",
  ].join(" ");
}

export default function Layout() {
  return (
    <div className="min-h-[100dvh] flex flex-col lg:flex-row bg-bg-base">
      {/* ===== 모바일 상단 바 ===== */}
      <header className="lg:hidden sticky top-0 z-30 bg-white/95 backdrop-blur border-b border-borderc-base">
        <div className="px-4 pt-2.5 pb-2 flex items-center gap-2">
          <NavLink to="/" className="flex items-center gap-2 shrink-0">
            <img src="/logo.png" alt="" className="w-8 h-8 rounded-lg" />
            <div className="min-w-0">
              <div className="text-[14px] font-bold text-ink leading-tight truncate">
                쇼츠 제작 도우미
              </div>
              <div className="text-[9.5px] text-ink-soft -mt-0.5 truncate">
                by 핸드인캥거루
              </div>
            </div>
          </NavLink>
        </div>
        {/* 모바일 가로 스크롤 네비 */}
        <div
          className="flex gap-2 overflow-x-auto px-4 pb-2.5"
          style={{ scrollbarWidth: "none" }}
        >
          {NAV.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.to === "/"}
              className={({ isActive }) =>
                [
                  "shrink-0 flex items-center gap-1.5 px-3 py-2.5 min-h-[44px] rounded-xl border-2 transition-all whitespace-nowrap",
                  isActive
                    ? "bg-gradient-to-br from-gold/15 to-amber-50 border-gold shadow-sm"
                    : "bg-white border-borderc-base",
                ].join(" ")
              }
            >
              <span className="text-base">{item.emoji}</span>
              <span className="text-[12.5px] font-extrabold text-ink">{item.label}</span>
              {item.badge && (
                <span className="px-1.5 py-0.5 rounded-full bg-gold/15 text-gold-tip text-[9px] font-extrabold tracking-wider">
                  {item.badge}
                </span>
              )}
            </NavLink>
          ))}
        </div>
      </header>

      {/* ===== 데스크탑 좌측 사이드바 ===== */}
      <aside className="hidden lg:flex lg:flex-col lg:w-[260px] lg:h-[100dvh] lg:sticky lg:top-0 lg:shrink-0 bg-white border-r border-borderc-base overflow-y-auto">
        {/* 브랜드 */}
        <NavLink
          to="/"
          className="flex items-center gap-3 px-5 py-5 border-b border-borderc-base group"
        >
          <img
            src="/logo.png"
            alt=""
            className="w-11 h-11 rounded-xl shadow-sm group-hover:scale-105 transition"
          />
          <div className="min-w-0">
            <div className="text-[15px] font-extrabold text-ink group-hover:text-gold transition leading-tight">
              쇼츠 제작 도우미
            </div>
            <div className="text-[10.5px] text-ink-soft mt-0.5 leading-tight">
              by 핸드인캥거루
              <br />
              무료 라이트 버전
            </div>
          </div>
        </NavLink>

        {/* 메인 네비 */}
        <nav className="flex-1 p-3 space-y-1.5">
          <div className="px-2 pt-2 pb-1.5 text-[10px] font-bold tracking-[0.18em] text-ink-soft uppercase">
            메뉴
          </div>
          {NAV.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.to === "/"}
              className={({ isActive }) => navItemClass(isActive)}
            >
              {({ isActive }) => (
                <>
                  <span className="text-2xl shrink-0 w-7 text-center">{item.emoji}</span>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-1.5">
                      <span
                        className={`text-[13.5px] font-extrabold ${
                          isActive ? "text-ink" : "text-ink"
                        }`}
                      >
                        {item.label}
                      </span>
                      {item.badge && (
                        <span className="px-1.5 py-0.5 rounded-full bg-gold/15 text-gold-tip text-[9px] font-extrabold tracking-wider">
                          {item.badge}
                        </span>
                      )}
                    </div>
                    <div className="text-[10.5px] text-ink-soft mt-0.5 truncate">
                      {item.desc}
                    </div>
                  </div>
                  {isActive && <span className="text-gold text-base shrink-0">→</span>}
                </>
              )}
            </NavLink>
          ))}
        </nav>

        {/* 하단 외부 링크 */}
        <div className="p-3 border-t border-borderc-base space-y-1.5 bg-bg-base/50">
          <div className="px-2 pt-1 pb-1.5 text-[10px] font-bold tracking-[0.18em] text-ink-soft uppercase">
            커뮤니티 · 바로가기
          </div>
          <a
            href={KAKAO_URL}
            target="_blank"
            rel="noreferrer"
            className="flex items-center gap-3 px-3 py-2.5 rounded-xl bg-[#FEE500] hover:bg-[#FFD900] transition group shadow-sm"
          >
            <span className="w-8 h-8 rounded-lg bg-[#3C1E1E] text-[#FEE500] flex items-center justify-center text-base">
              💬
            </span>
            <div className="flex-1 min-w-0">
              <div className="text-[12px] font-extrabold text-[#3C1E1E] leading-tight">
                오픈채팅 입장
              </div>
              <div className="text-[9.5px] text-[#3C1E1E]/70 mt-0.5">
                박준휘 쇼츠 커뮤니티
              </div>
            </div>
          </a>
          <a
            href={CAFE_URL}
            target="_blank"
            rel="noreferrer"
            className="flex items-center gap-2.5 px-3 py-2 rounded-xl bg-white hover:bg-green-50 border border-borderc-base hover:border-green-400 transition"
          >
            <span className="w-7 h-7 rounded-md bg-[#03C75A] text-white flex items-center justify-center text-sm">
              📗
            </span>
            <span className="text-[11.5px] font-semibold text-ink leading-tight flex-1">
              꾸준휘 쇼츠 수익화 카페
            </span>
          </a>
          <a
            href={YT_URL}
            target="_blank"
            rel="noreferrer"
            className="flex items-center gap-2.5 px-3 py-2 rounded-xl bg-white hover:bg-red-50 border border-borderc-base hover:border-red-400 transition"
          >
            <span className="w-7 h-7 rounded-md bg-[#FF0000] text-white flex items-center justify-center text-sm">
              ▶️
            </span>
            <span className="text-[11.5px] font-semibold text-ink leading-tight flex-1">
              준휘야 쇼츠 하자
            </span>
          </a>
        </div>
      </aside>

      {/* ===== 메인 콘텐츠 ===== */}
      <main className="flex-1 relative min-w-0">
        <img
          src="/logo.png"
          alt=""
          aria-hidden="true"
          className="pointer-events-none select-none fixed bottom-0 right-0 w-[40vw] max-w-[360px] opacity-[0.04] z-0"
        />
        <div className="relative z-10">
          {/* 모든 페이지 공통 상단 HOT 배너 */}
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pt-4 sm:pt-8">
            <a
              href={KAKAO_URL}
              target="_blank"
              rel="noreferrer"
              className="relative block group rounded-2xl sm:rounded-3xl overflow-hidden"
            >
              <div className="absolute -inset-1 rounded-2xl sm:rounded-3xl bg-gradient-to-r from-yellow-300 via-amber-400 to-yellow-300 blur-lg opacity-50 sm:opacity-60 group-hover:opacity-90 animate-pulse" />
              <div className="relative rounded-2xl sm:rounded-3xl bg-gradient-to-br from-[#FEE500] via-[#FFD900] to-[#FEE500] p-3 sm:p-5 shadow-[0_8px_24px_rgba(254,229,0,0.4)] sm:shadow-[0_12px_40px_rgba(254,229,0,0.5)] ring-2 ring-yellow-400 group-hover:scale-[1.005] transition-transform">
                <div className="absolute top-2 right-2 sm:top-3 sm:right-3 px-2 py-0.5 sm:px-2.5 sm:py-1 rounded-full bg-red-500 text-white text-[9px] sm:text-[10px] font-bold tracking-wider animate-bounce shadow-md">
                  🔥 HOT
                </div>
                <div className="flex items-center gap-2.5 sm:gap-4">
                  <div className="shrink-0 w-10 h-10 sm:w-14 sm:h-14 rounded-xl sm:rounded-2xl bg-[#3C1E1E] flex items-center justify-center text-xl sm:text-3xl shadow-inner">
                    💬
                  </div>
                  <div className="flex-1 min-w-0 text-left">
                    <div className="hidden sm:block text-[11.5px] font-bold text-[#3C1E1E]/70 mb-0.5 tracking-wide">
                      👋 쇼츠 크리에이터라면 필수!
                    </div>
                    <div className="text-[13px] sm:text-lg font-extrabold text-[#3C1E1E] leading-tight pr-14 sm:pr-0 line-clamp-1 sm:line-clamp-none">
                      박준휘 쇼츠 커뮤니티 오픈채팅
                    </div>
                    <div className="text-[11px] sm:text-[12.5px] text-[#3C1E1E]/75 mt-0.5 sm:mt-1 leading-snug line-clamp-1 sm:line-clamp-none">
                      실시간 꿀팁 · 트렌드 공유 · 질문 답변
                    </div>
                  </div>
                  <div className="shrink-0">
                    <div className="px-2.5 sm:px-4 py-1.5 sm:py-2.5 rounded-lg sm:rounded-xl bg-[#3C1E1E] text-[#FEE500] text-[11px] sm:text-sm font-extrabold whitespace-nowrap group-hover:bg-black transition shadow-md">
                      입장 →
                    </div>
                  </div>
                </div>
              </div>
            </a>
          </div>

          <Outlet />
        </div>

        {/* 푸터 (모바일/PC 공통, 사이드바 밖 컨텐츠 영역 하단) */}
        <footer className="relative z-10 mt-12 border-t border-borderc-base bg-white/60">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
            <div className="p-4 rounded-2xl bg-bg-base border border-borderc-base text-[11.5px] text-ink-muted leading-relaxed">
              <div className="font-semibold text-ink mb-1">⚠️ 저작권 및 이용 안내</div>
              <p className="mb-1">
                © 주식회사 핸드인캥거루. 본 사이트 및 모든 콘텐츠의 저작권은
                주식회사 핸드인캥거루에 있습니다.
              </p>
              <p>
                <b className="text-ink">무단 복제 · 변환 · 배포 · 상업적 이용을 금지</b>
                하며, 위반 시 관련 법령에 따라 법적 책임이 따를 수 있습니다.
                업로드한 영상/음성 파일은 서버에 저장되지 않고 본인의 브라우저에서만 처리됩니다.
              </p>
            </div>
          </div>
        </footer>
      </main>
    </div>
  );
}
