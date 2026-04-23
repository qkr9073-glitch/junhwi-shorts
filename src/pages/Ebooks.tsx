type Ebook = {
  emoji: string;
  title: string;
  bullets: string[];
  href: string;
  gradient: string;
};

// TODO: href에 실제 PDF 링크(Google Drive 공개 링크 등) 넣기
const EBOOKS: Ebook[] = [
  {
    emoji: "🚀",
    title: "초보도 1주일 안에 쇼츠 시작하는 법",
    bullets: [
      "주제 선정부터 첫 업로드까지 7일 로드맵",
      "채널 방향성 잡는 3가지 질문",
    ],
    href: "#",
    gradient: "from-rose-500 to-pink-500",
  },
  {
    emoji: "🔥",
    title: "알고리즘을 부르는 후킹 문구 TOP 50",
    bullets: [
      "실제 100만 뷰 쇼츠에서 뽑은 카피 모음",
      "상황별 · 톤별 템플릿으로 바로 적용",
    ],
    href: "#",
    gradient: "from-orange-500 to-red-500",
  },
  {
    emoji: "🌏",
    title: "해외 쇼츠 레퍼런스 완벽 탐색법",
    bullets: [
      "샤오홍슈 · 더우인 · 틱톡 서핑 루틴",
      "번역 없이도 인사이트 뽑는 법",
    ],
    href: "#",
    gradient: "from-amber-500 to-yellow-500",
  },
  {
    emoji: "🛡️",
    title: "저작권 안전지대 완전 정복",
    bullets: [
      "사용 가능 vs 불가 영상 판단 기준",
      "분쟁 예방 체크리스트 & 대처법",
    ],
    href: "#",
    gradient: "from-emerald-500 to-teal-500",
  },
  {
    emoji: "💰",
    title: "쇼츠로 수익 만드는 5가지 루트",
    bullets: [
      "애드센스 외 숨겨진 수익 모델 공개",
      "월 100만원 시작 구간별 전략",
    ],
    href: "#",
    gradient: "from-fuchsia-500 to-purple-600",
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
                  <div className={`absolute inset-0 bg-gradient-to-br ${b.gradient}`} />
                  <div className="absolute left-0 top-0 bottom-0 w-3 bg-gradient-to-r from-black/45 via-black/10 to-transparent" />
                  <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/25 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                  <div className="absolute top-5 left-6 right-4 h-px bg-white/35" />
                  <div className="absolute bottom-5 left-6 right-4 h-px bg-white/35" />
                  <div className="relative h-full flex flex-col justify-between p-4 pl-5 text-white">
                    <div className="flex items-start justify-between gap-2">
                      <div className="text-[9px] font-bold tracking-[0.2em] opacity-80">
                        VOL. 0{i + 1}
                      </div>
                      <div className="text-[8px] font-extrabold tracking-wider bg-white/25 backdrop-blur px-2 py-0.5 rounded-full">
                        FREE
                      </div>
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
