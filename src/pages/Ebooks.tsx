type Ebook = {
  emoji: string;
  title: string;
  bullets: string[];
  href: string;
  gradient: string;
  coverImg?: string;
};

const EBOOKS: Ebook[] = [
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

export default function Ebooks() {
  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-10">
      {/* 헤더 */}
      <div className="mb-8">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-gradient-to-r from-rose-500 via-pink-500 to-fuchsia-500 text-white text-[11px] font-bold tracking-wider shadow-md mb-3">
          🎁 박준휘쌤이 드리는 선물
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-ink">
          무료 전자책{" "}
          <span className="bg-gradient-to-r from-rose-500 to-fuchsia-500 bg-clip-text text-transparent">
            서재
          </span>
        </h1>
        <p className="text-[13px] sm:text-sm text-ink-muted mt-2 max-w-2xl leading-relaxed">
          쇼츠 입문부터 수익화까지 — 혼자 해도 막히지 않게 박준휘쌤이 직접 정리한 자료.
          표지를 클릭해서 원하는 책을 받아가세요.
        </p>
      </div>

      {/* 책장 */}
      <div className="relative">
        <div
          className="-mx-4 sm:mx-0 overflow-x-auto sm:overflow-visible pb-6 sm:pb-0"
          style={{ scrollbarWidth: "none" }}
        >
          <div className="flex sm:grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-5 sm:gap-6 px-4 sm:px-0 min-w-max sm:min-w-0 snap-x snap-mandatory">
            {EBOOKS.map((b, i) => (
              <a
                key={i}
                href={b.href}
                target="_blank"
                rel="noreferrer"
                className="group block w-[165px] sm:w-auto shrink-0 sm:shrink snap-start"
              >
                {/* 책 표지 (2:3) */}
                <div className="relative aspect-[2/3] rounded-r-lg rounded-l-[3px] overflow-hidden shadow-[0_10px_28px_rgba(0,0,0,0.18)] transform-gpu transition-all duration-500 group-hover:-translate-y-2 group-hover:-rotate-[1.5deg] group-hover:shadow-[0_24px_50px_rgba(0,0,0,0.32)]">
                  {/* 배경: 표지 이미지 있으면 이미지, 없으면 그라디언트 */}
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

                  {/* 책등(좌측) 그림자 — 항상 표시 */}
                  <div className="absolute left-0 top-0 bottom-0 w-3 bg-gradient-to-r from-black/45 via-black/10 to-transparent" />

                  {/* 호버 시 광택 — 항상 표시 */}
                  <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/25 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

                  {/* FREE 뱃지 — 항상 표시 */}
                  <div className="absolute top-2.5 right-2.5 text-[8px] font-extrabold tracking-wider bg-white/95 text-ink backdrop-blur px-2 py-0.5 rounded-full shadow-sm">
                    FREE
                  </div>

                  {/* 표지 이미지 없을 때만: 그라디언트 위 장식 + 이모지 + 제목 오버레이 */}
                  {!b.coverImg && (
                    <>
                      <div className="absolute top-5 left-6 right-4 h-px bg-white/35" />
                      <div className="absolute bottom-5 left-6 right-4 h-px bg-white/35" />
                      <div className="relative h-full flex flex-col justify-between p-4 pl-5 text-white">
                        <div className="text-[9px] font-bold tracking-[0.2em] opacity-80">
                          VOL. 0{i + 1}
                        </div>
                        <div className="text-center">
                          <div className="text-[48px] leading-none drop-shadow-lg group-hover:scale-110 transition-transform duration-500">
                            {b.emoji}
                          </div>
                        </div>
                        <div>
                          <h3 className="text-[13px] font-extrabold leading-tight drop-shadow-md mb-2 break-keep">
                            {b.title}
                          </h3>
                          <div className="text-[8px] font-bold tracking-[0.18em] opacity-75 border-t border-white/35 pt-1.5">
                            박준휘 · SHORTS SERIES
                          </div>
                        </div>
                      </div>
                    </>
                  )}
                </div>

                {/* 표지 아래 */}
                <div className="mt-3 px-1">
                  <ul className="space-y-1 text-[11px] text-ink-muted leading-relaxed mb-2 min-h-[36px]">
                    {b.bullets.map((line, j) => (
                      <li key={j} className="flex gap-1.5">
                        <span className="text-gold shrink-0">✓</span>
                        <span className="line-clamp-2">{line}</span>
                      </li>
                    ))}
                  </ul>
                  <div className="inline-flex items-center gap-1 text-[11.5px] font-bold text-gold-tip group-hover:text-gold group-hover:gap-2 transition-all">
                    📥 무료 다운로드
                    <span>→</span>
                  </div>
                </div>
              </a>
            ))}
          </div>
        </div>

        <div className="sm:hidden text-center text-[11px] text-ink-soft mt-1">
          ← 좌우로 밀어서 책장 구경하기 →
        </div>
      </div>

      <div className="mt-8 p-4 rounded-2xl bg-bg-tip/60 border border-amber-200 text-[12.5px] text-amber-900 leading-relaxed">
        <b>📌 안내</b> — 전자책은 개인 학습용 무료 자료입니다. 재배포 · 상업적 이용을 금지합니다.
      </div>
    </div>
  );
}
