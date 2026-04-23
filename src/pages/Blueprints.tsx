type Blueprint = {
  href: string;
  flag: string;
  country: string;
  title: string;
  desc: string;
  gradient: string;
  accent: string;
};

const BLUEPRINTS: Blueprint[] = [
  {
    href: "https://chatgpt.com/g/g-6873caaad278819187211d5e9c2dbf00-migug-syoceu-seolgyedo",
    flag: "🇺🇸",
    country: "미국",
    title: "미국 쇼츠 설계도",
    desc: "미국 쇼츠 트렌드와 문화 코드에 맞춘 아이디어·대본 설계 GPT",
    gradient: "from-red-500 via-white to-blue-600",
    accent: "text-red-600",
  },
  {
    href: "https://chatgpt.com/g/g-6808e84393c08191aad85a172d094449-ilbon-syoceu-seolgyedo",
    flag: "🇯🇵",
    country: "일본",
    title: "일본 쇼츠 설계도",
    desc: "일본 시청자가 좋아하는 톤·포맷에 맞춰 쇼츠를 설계해주는 GPT",
    gradient: "from-white via-pink-50 to-red-500",
    accent: "text-red-600",
  },
  {
    href: "https://chatgpt.com/g/g-6873cd20aa408191a0cd033496c62fa8-seupein-syoceu-seolgyedo",
    flag: "🇪🇸",
    country: "스페인",
    title: "스페인 쇼츠 설계도",
    desc: "스페인어권 쇼츠 감성과 리듬에 맞춘 대본·아이디어 설계 GPT",
    gradient: "from-yellow-400 via-orange-400 to-red-500",
    accent: "text-orange-600",
  },
  {
    href: "https://chatgpt.com/g/g-6873ce1826fc819188b583294defac2e-peurangseu-syoceu-seolgyedo",
    flag: "🇫🇷",
    country: "프랑스",
    title: "프랑스 쇼츠 설계도",
    desc: "프랑스 시청자 맞춤 위트·스타일로 쇼츠를 설계해주는 GPT",
    gradient: "from-blue-600 via-white to-red-500",
    accent: "text-blue-700",
  },
];

export default function Blueprints() {
  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-10">
      {/* 헤더 */}
      <div className="mb-6">
        <div className="inline-block px-3 py-1 rounded-full bg-indigo-100 text-indigo-700 text-[11px] font-semibold mb-3 tracking-wide">
          🧭 국가별 GPT 도구 모음
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-ink leading-tight">
          🗺️ 쇼츠 설계도
        </h1>
        <p className="text-[13px] sm:text-sm text-ink-muted mt-2 max-w-2xl leading-relaxed">
          각 국가의 쇼츠 트렌드 · 문화에 맞춘 <b className="text-ink">아이디어·대본 설계 GPT</b>. 원하는 나라를 골라 바로 ChatGPT에서 사용하세요.
        </p>
      </div>

      {/* GPT 카드 4개 */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-5 mb-6">
        {BLUEPRINTS.map((b) => (
          <a
            key={b.href}
            href={b.href}
            target="_blank"
            rel="noreferrer"
            className="group relative block rounded-3xl p-[2px] bg-gradient-to-br shadow-[0_8px_24px_rgba(0,0,0,0.08)] hover:shadow-[0_16px_40px_rgba(0,0,0,0.18)] transition-all overflow-hidden"
            style={{ backgroundImage: "linear-gradient(135deg, rgba(0,0,0,0.08), rgba(0,0,0,0.02))" }}
          >
            <div className="relative rounded-[calc(1.5rem-2px)] bg-white overflow-hidden h-full">
              {/* 상단 국기 그라디언트 배너 */}
              <div className={`relative h-20 sm:h-24 bg-gradient-to-br ${b.gradient} flex items-center justify-center overflow-hidden`}>
                <div className="absolute inset-0 bg-black/5" />
                <div className="relative text-5xl sm:text-6xl drop-shadow-md group-hover:scale-110 transition-transform duration-500">
                  {b.flag}
                </div>
                <div className="absolute top-2.5 right-2.5 px-2 py-0.5 rounded-full bg-black/50 backdrop-blur text-white text-[9px] font-extrabold tracking-wider">
                  GPT
                </div>
              </div>

              {/* 본문 */}
              <div className="p-4 sm:p-5">
                <div className={`text-[10.5px] font-bold tracking-[0.18em] uppercase mb-1 ${b.accent}`}>
                  {b.country} · SHORTS BLUEPRINT
                </div>
                <h3 className="text-base sm:text-lg font-extrabold text-ink group-hover:text-gold transition leading-tight mb-1.5">
                  {b.title}
                </h3>
                <p className="text-[12.5px] text-ink-muted leading-relaxed mb-3">
                  {b.desc}
                </p>
                <div className="inline-flex items-center gap-1.5 text-[12.5px] font-bold text-ink group-hover:text-gold group-hover:gap-2.5 transition-all">
                  <span className="w-5 h-5 rounded-md bg-black text-white flex items-center justify-center text-[9px] font-black">
                    AI
                  </span>
                  ChatGPT에서 열기
                  <span>→</span>
                </div>
              </div>
            </div>
          </a>
        ))}
      </div>

      {/* 유료 공개 안내 */}
      <div className="relative rounded-3xl overflow-hidden border-2 border-amber-300 bg-gradient-to-br from-amber-50 via-yellow-50 to-orange-50 p-5 shadow-sm">
        <div className="flex items-start gap-3">
          <div className="shrink-0 w-11 h-11 rounded-2xl bg-gradient-to-br from-amber-400 to-orange-500 text-white flex items-center justify-center text-xl shadow-md">
            🔒
          </div>
          <div className="flex-1 min-w-0">
            <div className="inline-flex items-center gap-2 mb-1.5">
              <span className="text-[10px] font-extrabold tracking-[0.18em] text-orange-700 uppercase">
                Premium Only
              </span>
              <span className="px-2 py-0.5 rounded-full bg-gradient-to-r from-amber-500 to-orange-500 text-white text-[9px] font-extrabold tracking-wider shadow-sm">
                유료 전용
              </span>
            </div>
            <div className="text-[14px] sm:text-[15px] font-extrabold text-ink mb-1.5 leading-snug">
              국가별 기능 + 숏핑 작성 기능이 모두 통합된 <span className="text-orange-600">쇼츠 설계도 최종 버전</span>은 유료 수강생 전용입니다
            </div>
            <p className="text-[12.5px] text-ink-muted leading-relaxed">
              위 라이트 버전은 국가별 개별 GPT로 공개해드려요. 최종 통합 버전은 유료 수강생에게만 제공되는 점 양해 부탁드립니다 🙏
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
