import LockGate from "../components/LockGate";

type Ebook = {
  emoji: string;
  title: string;
  bullets: string[];
  href: string;
  gradient: string;
  coverImg?: string;
};

// sha256("easyshort")
const EBOOKS_PASSWORD_HASH =
  "09a50eb32d657e70cbd4f225a0da226bfacb0202c0592cb816ef349674e071ed";

// 세로형 표지 (5권) — 상단 큰 그리드
const PORTRAIT_BOOKS: Ebook[] = [
  {
    emoji: "🌷",
    title: "엄마에게 알려준 쇼츠 비법",
    bullets: [
      "디지털 비전문가도 따라할 수 있는 쇼츠 기초",
      "가장 쉽게 설명한 입문자용 가이드",
    ],
    href: "https://drive.google.com/file/d/1F9gn-AZPC0sRMHoaKerK_y6soe_hl9ad/view?usp=sharing",
    gradient: "from-rose-400 to-pink-500",
    coverImg: "/ebooks/1-mom.png",
  },
  {
    emoji: "⏱️",
    title: "초보를 위한 10분 쇼츠 수익화",
    bullets: [
      "쇼츠 한 편을 10분 안에 만드는 템플릿",
      "최단 경로로 가는 수익화 루트",
    ],
    href: "https://drive.google.com/file/d/1NrCo2Ovg6mdcsX3-eDCJIgtOUL2Or09T/view?usp=sharing",
    gradient: "from-red-500 to-rose-600",
    coverImg: "/ebooks/2-10min.png",
  },
  {
    emoji: "🎣",
    title: "후킹멘트 전자책",
    bullets: [
      "첫 3초 이탈률 잡는 훅 문구 템플릿",
      "상황별 · 톤별 바로 적용 예시 모음",
    ],
    href: "https://drive.google.com/file/d/1RX1k2cjQWTKpFPg9_ywSTXfbQ2L_Uy47/view?usp=sharing",
    gradient: "from-amber-500 to-yellow-500",
    coverImg: "/ebooks/3-hook.png",
  },
  {
    emoji: "📊",
    title: "쇼츠 운영 전략",
    bullets: [
      "업로드 주기 · 채널 포지셔닝 · 성장 루틴",
      "장기적으로 꾸준히 크는 운영법",
    ],
    href: "https://drive.google.com/file/d/1_NMk6BUBRrRSZAIDbokGgOHGLjpcnd_W/view?usp=sharing",
    gradient: "from-emerald-500 to-teal-600",
    coverImg: "/ebooks/6-strategy.png",
  },
  {
    emoji: "🛍️",
    title: "쇼핑 전자책",
    bullets: [
      "상품 · 쇼핑 소재 쇼츠로 수익 만드는 법",
      "광고 · 제휴 연결 구조와 실전 사례",
    ],
    href: "https://drive.google.com/file/d/1n1DAKcRoMlofu9wSYKBX6Trx06vL0r9Q/view?usp=sharing",
    gradient: "from-orange-500 to-amber-600",
    coverImg: "/ebooks/7-shopping.png",
  },
];

// 가로형 표지 (2권) — 하단 와이드 카드
const LANDSCAPE_BOOKS: Ebook[] = [
  {
    emoji: "📂",
    title: "고수들의 쇼츠 소재 리스트",
    bullets: [
      "상위 크리에이터들이 쓰는 소재 · 주제 모음",
      "장르별 바로 써먹는 아이디어 리스트",
    ],
    href: "https://drive.google.com/file/d/13uKHoiicv-vdBkvZtVQP717YJGHA0XXZ/view?usp=sharing",
    gradient: "from-slate-700 to-slate-900",
    coverImg: "/ebooks/4-community.png",
  },
  {
    emoji: "🎯",
    title: "구독전환 전자책",
    bullets: [
      "시청자를 구독자로 전환시키는 공식",
      "쇼츠 속 CTA · 엔딩 설계 전략",
    ],
    href: "https://drive.google.com/file/d/1jZi7S9xGxoL3fgHxjMF5-pySbyMjDQUF/view?usp=sharing",
    gradient: "from-fuchsia-500 to-purple-600",
    coverImg: "/ebooks/5-conversion.png",
  },
];

// 카드 하단 정보 + CTA (프리미엄 느낌)
function BookInfo({ book }: { book: Ebook }) {
  return (
    <div className="mt-3 sm:mt-5 px-0.5 sm:px-1">
      {/* 제목 */}
      <h3 className="text-[13px] sm:text-base font-extrabold text-ink leading-tight mb-1 group-hover:text-gold transition-colors break-keep line-clamp-2 min-h-[36px] sm:min-h-0">
        {book.title}
      </h3>
      {/* 금선 구분 */}
      <div className="h-[2px] w-8 sm:w-10 bg-gradient-to-r from-amber-400 to-yellow-500 rounded-full mb-2 sm:mb-3" />
      {/* 요약 */}
      <ul className="hidden sm:block space-y-1.5 text-[12.5px] text-ink-muted leading-relaxed mb-4 min-h-[52px]">
        {book.bullets.map((line, j) => (
          <li key={j} className="flex gap-1.5">
            <span className="text-amber-500 shrink-0 font-bold">✓</span>
            <span className="line-clamp-2">{line}</span>
          </li>
        ))}
      </ul>
      {/* 모바일: 요약 한 줄 요약 */}
      <p className="sm:hidden text-[11px] text-ink-muted leading-snug mb-2.5 line-clamp-2 min-h-[30px]">
        {book.bullets[0]}
      </p>
      {/* 프리미엄 CTA */}
      <div className="relative w-full overflow-hidden rounded-xl shadow-[0_6px_18px_rgba(251,191,36,0.35)] group-hover:shadow-[0_10px_28px_rgba(251,191,36,0.55)] transition-shadow">
        <div className="absolute inset-0 bg-gradient-to-r from-amber-400 via-yellow-500 to-amber-500" />
        <div className="absolute inset-0 -translate-x-full group-hover:translate-x-full bg-gradient-to-r from-transparent via-white/60 to-transparent transition-transform duration-1000" />
        <div className="relative flex items-center justify-center gap-1.5 sm:gap-2 py-2.5 sm:py-3 px-2 sm:px-3 text-white font-extrabold">
          <span className="text-sm sm:text-base">📥</span>
          <span className="text-[12px] sm:text-[13px] tracking-wide">무료로 받기</span>
          <span className="group-hover:translate-x-1 transition-transform">→</span>
        </div>
      </div>
    </div>
  );
}

export default function Ebooks() {
  return (
    <LockGate
      storageKey="unlock_ebooks"
      passwordHash={EBOOKS_PASSWORD_HASH}
      lockLabel="1차 공개 · EBOOKS"
      lockTitle="무료 전자책 서재"
      lockSubtitle="박준휘쌤이 직접 정리한 무료 전자책 7권"
      lockDescription="쇼츠 입문부터 수익화까지 — 본 섹션은 무료강의를 끝까지 시청한 수강자에게만 공개됩니다."
      hint="강의 중간에 공개되는 1차 비밀번호를 입력하세요."
      gradientFrom="from-rose-500"
      gradientTo="to-fuchsia-700"
    >
      <EbooksContent />
    </LockGate>
  );
}

function EbooksContent() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-10">
      {/* 헤더 — 더 임팩트있게 */}
      <div className="mb-8 sm:mb-10">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-gradient-to-r from-amber-500 via-yellow-500 to-amber-500 text-white text-[11px] font-extrabold tracking-wider shadow-[0_4px_16px_rgba(251,191,36,0.4)] mb-4">
          🎁 박준휘쌤이 드리는 선물 · PREMIUM FREE
        </div>
        <h1 className="text-3xl sm:text-5xl font-black text-ink leading-[1.1]">
          무료 전자책{" "}
          <span className="bg-gradient-to-r from-amber-500 via-yellow-500 to-amber-600 bg-clip-text text-transparent">
            서재
          </span>
        </h1>
        <p className="text-[13.5px] sm:text-[15px] text-ink-muted mt-3 max-w-2xl leading-relaxed">
          쇼츠 입문부터 수익화까지 — 혼자 해도 막히지 않게 박준휘쌤이 직접 정리한 자료.
          <b className="text-ink"> 표지를 클릭해 원하는 책을 지금 받아가세요.</b>
        </p>
      </div>

      {/* 세로형 5권 — 상단 그리드 */}
      <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-5 gap-3 sm:gap-6 lg:gap-8 mb-10 sm:mb-12">
        {PORTRAIT_BOOKS.map((b, i) => (
          <a
            key={b.href}
            href={b.href}
            target="_blank"
            rel="noreferrer"
            className="group block"
          >
            {/* 세로 표지 (2:3) — 크게 + 프리미엄 링 */}
            <div className="relative rounded-r-xl rounded-l-[4px] p-[2px] bg-gradient-to-br from-amber-400/70 via-yellow-300/40 to-amber-600/60 shadow-[0_14px_36px_rgba(0,0,0,0.18)] group-hover:shadow-[0_28px_60px_rgba(251,191,36,0.35)] transition-all duration-500 group-hover:-translate-y-3 group-hover:-rotate-[1.5deg] transform-gpu">
              <div className="relative aspect-[2/3] rounded-r-[calc(0.75rem-2px)] rounded-l-[3px] overflow-hidden">
                {b.coverImg ? (
                  <>
                    <div className={`absolute inset-0 bg-gradient-to-br ${b.gradient}`} />
                    <img
                      src={b.coverImg}
                      alt={b.title}
                      loading="lazy"
                      className="absolute inset-0 w-full h-full object-cover"
                    />
                  </>
                ) : (
                  <div className={`absolute inset-0 bg-gradient-to-br ${b.gradient}`} />
                )}
                {/* 책등 */}
                <div className="absolute left-0 top-0 bottom-0 w-3 bg-gradient-to-r from-black/50 via-black/15 to-transparent" />
                {/* 호버 광택 */}
                <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                {/* FREE 뱃지 */}
                <div className="absolute top-3 right-3 text-[9px] font-black tracking-wider bg-gradient-to-r from-amber-400 to-yellow-500 text-white px-2.5 py-1 rounded-full shadow-md">
                  FREE
                </div>
                {/* 이미지 없을 때만 오버레이 */}
                {!b.coverImg && (
                  <>
                    <div className="absolute top-5 left-6 right-4 h-px bg-white/35" />
                    <div className="absolute bottom-5 left-6 right-4 h-px bg-white/35" />
                    <div className="relative h-full flex flex-col justify-between p-4 pl-5 text-white">
                      <div className="text-[9px] font-bold tracking-[0.2em] opacity-80">
                        VOL. 0{i + 1}
                      </div>
                      <div className="text-center">
                        <div className="text-[56px] leading-none drop-shadow-lg group-hover:scale-110 transition-transform duration-500">
                          {b.emoji}
                        </div>
                      </div>
                      <div>
                        <h3 className="text-[14px] font-extrabold leading-tight drop-shadow-md mb-2 break-keep">
                          {b.title}
                        </h3>
                        <div className="text-[8.5px] font-bold tracking-[0.18em] opacity-75 border-t border-white/35 pt-1.5">
                          박준휘 · SHORTS SERIES
                        </div>
                      </div>
                    </div>
                  </>
                )}
              </div>
            </div>
            <BookInfo book={b} />
          </a>
        ))}
      </div>

      {/* 가로형 2권 — 하단 와이드 카드 */}
      <div className="mb-10">
        <div className="flex items-center gap-3 mb-5">
          <div className="h-[2px] flex-1 bg-gradient-to-r from-transparent via-amber-300 to-amber-400" />
          <div className="text-[11px] font-black tracking-[0.2em] text-amber-600 uppercase">
            ⭐ Special Edition
          </div>
          <div className="h-[2px] flex-1 bg-gradient-to-l from-transparent via-amber-300 to-amber-400" />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8">
          {LANDSCAPE_BOOKS.map((b) => (
            <a
              key={b.href}
              href={b.href}
              target="_blank"
              rel="noreferrer"
              className="group block"
            >
              {/* 가로 표지 (16:9) — 와이드 + 프리미엄 링 */}
              <div className="relative rounded-2xl p-[2px] bg-gradient-to-br from-amber-400/70 via-yellow-300/40 to-amber-600/60 shadow-[0_14px_36px_rgba(0,0,0,0.18)] group-hover:shadow-[0_28px_60px_rgba(251,191,36,0.35)] transition-all duration-500 group-hover:-translate-y-2 transform-gpu">
                <div className="relative aspect-[16/9] rounded-[calc(1rem-2px)] overflow-hidden">
                  {b.coverImg ? (
                    <>
                      <div className={`absolute inset-0 bg-gradient-to-br ${b.gradient}`} />
                      <img
                        src={b.coverImg}
                        alt={b.title}
                        loading="lazy"
                        className="absolute inset-0 w-full h-full object-cover"
                      />
                    </>
                  ) : (
                    <div className={`absolute inset-0 bg-gradient-to-br ${b.gradient}`} />
                  )}
                  {/* 호버 광택 */}
                  <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/25 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                  {/* FREE 뱃지 */}
                  <div className="absolute top-3 right-3 text-[9px] font-black tracking-wider bg-gradient-to-r from-amber-400 to-yellow-500 text-white px-2.5 py-1 rounded-full shadow-md">
                    FREE
                  </div>
                </div>
              </div>
              <BookInfo book={b} />
            </a>
          ))}
        </div>
      </div>

      {/* 하단 안내 */}
      <div className="relative rounded-2xl overflow-hidden border-2 border-amber-200 bg-gradient-to-br from-amber-50 via-yellow-50 to-amber-50 p-5">
        <div className="flex items-start gap-3">
          <div className="shrink-0 w-10 h-10 rounded-xl bg-gradient-to-br from-amber-400 to-yellow-500 text-white flex items-center justify-center text-lg shadow-md">
            📌
          </div>
          <div className="flex-1">
            <div className="text-[13px] sm:text-sm font-extrabold text-amber-900 mb-1">
              이용 안내
            </div>
            <p className="text-[12.5px] text-amber-900 leading-relaxed">
              전자책은 <b>박준휘쌤 수강생 전용 무료 자료</b>입니다. 재배포 · 복제 · 상업적 이용을 엄격히 금지하며, 개인 학습용으로만 사용해 주세요.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
