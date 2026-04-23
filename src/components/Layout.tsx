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
    to: "/",
    emoji: "🎯",
    label: "실습 가이드",
    desc: "플랫폼 · 로그인 · 다운로드",
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
    to: "/ebooks",
    emoji: "📚",
    label: "전자책 서재",
    desc: "무료 전자책 5권",
    badge: "FREE",
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
      <header className="lg:hidden sticky top-0 z-30 bg-white/90 backdrop-blur border-b border-borderc-base">
        <div className="px-4 py-3 flex items-center gap-2">
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
          className="flex gap-2 overflow-x-auto px-4 pb-3"
          style={{ scrollbarWidth: "none" }}
        >
          {NAV.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.to === "/"}
              className={({ isActive }) =>
                [
                  "shrink-0 flex items-center gap-2 px-3.5 py-2 rounded-xl border-2 transition-all whitespace-nowrap",
                  isActive
                    ? "bg-gradient-to-br from-gold/15 to-amber-50 border-gold"
                    : "bg-white border-borderc-base",
                ].join(" ")
              }
            >
              <span className="text-lg">{item.emoji}</span>
              <span className="text-[12.5px] font-bold text-ink">{item.label}</span>
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
          <Outlet />
        </div>

        {/* 모바일 전용 플로팅 카카오 버튼 */}
        <a
          href={KAKAO_URL}
          target="_blank"
          rel="noreferrer"
          aria-label="박준휘 쇼츠 커뮤니티 오픈채팅 입장"
          className="lg:hidden group fixed bottom-5 right-5 z-40 flex items-center gap-2 pl-3 pr-4 py-3 rounded-full bg-[#FEE500] hover:bg-[#FFD900] text-[#3C1E1E] font-bold text-sm shadow-[0_10px_30px_rgba(254,229,0,0.6)] ring-2 ring-yellow-400/70 hover:-translate-y-0.5 transition"
        >
          <span className="relative flex items-center justify-center w-8 h-8 rounded-full bg-[#3C1E1E] text-[#FEE500] text-base">
            💬
            <span className="absolute -top-0.5 -right-0.5 w-3 h-3 rounded-full bg-red-500 ring-2 ring-[#FEE500] animate-pulse" />
          </span>
          <span className="leading-tight">
            <span className="block text-[10px] font-bold opacity-80">오픈채팅</span>
            <span className="block">입장 →</span>
          </span>
        </a>

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
