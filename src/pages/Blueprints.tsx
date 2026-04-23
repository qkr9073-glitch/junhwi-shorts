import LockGate from "../components/LockGate";

// sha256("junwhigood")
const BLUEPRINTS_PASSWORD_HASH =
  "a9912d7be9902bcf47e52f2ea54c16072f3f16ed3cec23170b6aa216aa2f9df1";

// 자동 공개: 2026-04-30 00:00 KST
const UNLOCK_DATE = new Date("2026-04-30T00:00:00+09:00");

type Blueprint = {
  href: string;
  flag: string;
  country: string;
  countryEn: string;
  title: string;
  desc: string;
  accent: string;
  accentText: string;
  accentBg: string;
};

const BLUEPRINTS: Blueprint[] = [
  {
    href: "https://chatgpt.com/g/g-6873caaad278819187211d5e9c2dbf00-migug-syoceu-seolgyedo",
    flag: "🇺🇸",
    country: "미국",
    countryEn: "USA",
    title: "미국 쇼츠 설계도",
    desc: "미국 쇼츠 트렌드와 문화 코드에 맞춘 아이디어 · 대본 설계 GPT",
    accent: "from-red-500 via-white/80 to-blue-600",
    accentText: "text-red-400",
    accentBg: "from-red-500 to-blue-600",
  },
  {
    href: "https://chatgpt.com/g/g-6808e84393c08191aad85a172d094449-ilbon-syoceu-seolgyedo",
    flag: "🇯🇵",
    country: "일본",
    countryEn: "JAPAN",
    title: "일본 쇼츠 설계도",
    desc: "일본 시청자가 좋아하는 톤 · 포맷에 맞춰 쇼츠를 설계해주는 GPT",
    accent: "from-rose-400 via-pink-300 to-red-500",
    accentText: "text-rose-400",
    accentBg: "from-rose-500 to-red-600",
  },
  {
    href: "https://chatgpt.com/g/g-6873cd20aa408191a0cd033496c62fa8-seupein-syoceu-seolgyedo",
    flag: "🇪🇸",
    country: "스페인",
    countryEn: "SPAIN",
    title: "스페인 쇼츠 설계도",
    desc: "스페인어권 쇼츠 감성과 리듬에 맞춘 대본 · 아이디어 설계 GPT",
    accent: "from-yellow-400 via-orange-400 to-red-500",
    accentText: "text-amber-400",
    accentBg: "from-yellow-500 to-red-600",
  },
  {
    href: "https://chatgpt.com/g/g-6873ce1826fc819188b583294defac2e-peurangseu-syoceu-seolgyedo",
    flag: "🇫🇷",
    country: "프랑스",
    countryEn: "FRANCE",
    title: "프랑스 쇼츠 설계도",
    desc: "프랑스 시청자 맞춤 위트 · 스타일로 쇼츠를 설계해주는 GPT",
    accent: "from-blue-600 via-white/80 to-red-500",
    accentText: "text-blue-400",
    accentBg: "from-blue-600 to-red-500",
  },
];

export default function Blueprints() {
  return (
    <LockGate
      storageKey="unlock_blueprints"
      passwordHash={BLUEPRINTS_PASSWORD_HASH}
      unlockDate={UNLOCK_DATE}
      lockLabel="2차 공개 · BLUEPRINTS"
      lockTitle="쇼츠 설계도"
      lockSubtitle="국가별 쇼츠 설계 GPT 4종 (미국 · 일본 · 스페인 · 프랑스)"
      lockDescription="각 국가의 쇼츠 트렌드에 맞춘 아이디어·대본 설계 GPT. 본 섹션은 무료강의 후반부에 공개되는 2차 비밀번호로 열 수 있으며, 2026년 4월 30일부터 모두에게 자동 오픈됩니다."
      hint="강의 후반부에 공개되는 2차 비밀번호를 입력하세요. 강의를 놓치셨다면 카카오 오픈채팅에서도 안내드려요."
      gradientFrom="from-indigo-600"
      gradientTo="to-purple-800"
    >
      <BlueprintsContent />
    </LockGate>
  );
}

function BlueprintsContent() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-10">
      {/* 헤더 */}
      <div className="mb-8 sm:mb-10">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-gradient-to-r from-indigo-500 via-purple-500 to-fuchsia-500 text-white text-[11px] font-extrabold tracking-wider shadow-[0_4px_16px_rgba(139,92,246,0.4)] mb-4">
          🧭 GLOBAL GPT COLLECTION
        </div>
        <h1 className="text-3xl sm:text-5xl font-black text-ink leading-[1.1]">
          쇼츠{" "}
          <span className="bg-gradient-to-r from-indigo-500 via-purple-500 to-fuchsia-500 bg-clip-text text-transparent">
            설계도
          </span>
        </h1>
        <p className="text-[13.5px] sm:text-[15px] text-ink-muted mt-3 max-w-2xl leading-relaxed">
          각 국가의 쇼츠 트렌드 · 문화에 맞춘 <b className="text-ink">아이디어 · 대본 설계 GPT</b>. 원하는 나라를 골라 ChatGPT에서 바로 사용하세요.
        </p>
      </div>

      {/* GPT 카드 4개 — 다크 프리미엄 */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5 sm:gap-6 mb-8">
        {BLUEPRINTS.map((b, i) => (
          <a
            key={b.href}
            href={b.href}
            target="_blank"
            rel="noreferrer"
            className="group relative block overflow-hidden rounded-3xl bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 shadow-[0_14px_40px_rgba(15,23,42,0.25)] hover:shadow-[0_28px_60px_rgba(15,23,42,0.4)] hover:-translate-y-1.5 transition-all duration-500"
          >
            {/* 상단 국기 컬러 아크 */}
            <div className={`absolute top-0 inset-x-0 h-1 bg-gradient-to-r ${b.accent}`} />
            <div className={`absolute -top-32 -right-32 w-72 h-72 bg-gradient-to-br ${b.accentBg} opacity-30 blur-3xl rounded-full group-hover:opacity-50 transition-opacity duration-700`} />

            {/* 배경 국기 워터마크 */}
            <div className="absolute -bottom-10 -right-6 text-[180px] leading-none opacity-[0.08] group-hover:opacity-[0.15] group-hover:scale-110 transition-all duration-700 rotate-[8deg] pointer-events-none select-none">
              {b.flag}
            </div>

            {/* 미세 그리드 패턴 */}
            <div
              className="absolute inset-0 opacity-[0.04]"
              style={{
                backgroundImage:
                  "linear-gradient(to right, white 1px, transparent 1px), linear-gradient(to bottom, white 1px, transparent 1px)",
                backgroundSize: "24px 24px",
              }}
            />

            {/* 호버 광택 */}
            <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

            <div className="relative p-6 sm:p-7">
              {/* 넘버 + GPT 뱃지 */}
              <div className="flex items-center justify-between mb-4">
                <div className="text-[10px] font-black tracking-[0.3em] text-white/40">
                  0{i + 1} — BLUEPRINT
                </div>
                <div className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-white/10 backdrop-blur border border-white/15">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                  <span className="text-[9px] font-extrabold tracking-wider text-white">CUSTOM GPT</span>
                </div>
              </div>

              {/* 국가 이름 + 국기 */}
              <div className="flex items-center gap-4 mb-4">
                <div className="text-5xl sm:text-6xl drop-shadow-lg group-hover:scale-110 group-hover:rotate-[-5deg] transition-transform duration-500">
                  {b.flag}
                </div>
                <div className="min-w-0">
                  <div className={`text-[10.5px] font-black tracking-[0.3em] uppercase ${b.accentText} mb-0.5`}>
                    {b.countryEn}
                  </div>
                  <h3 className="text-3xl sm:text-4xl font-black text-white leading-none tracking-tight">
                    {b.country}
                  </h3>
                </div>
              </div>

              {/* 부제 */}
              <div className="text-[13px] sm:text-[14px] text-white/70 font-semibold mb-4">
                {b.title}
              </div>

              {/* 구분선 */}
              <div className={`h-[2px] w-14 bg-gradient-to-r ${b.accentBg} rounded-full mb-4`} />

              {/* 설명 */}
              <p className="text-[12.5px] sm:text-[13px] text-white/60 leading-relaxed mb-5 min-h-[40px]">
                {b.desc}
              </p>

              {/* CTA 버튼 */}
              <div className="inline-flex items-center gap-2 pl-2 pr-4 py-2 rounded-xl bg-white text-ink text-[13px] font-extrabold shadow-[0_6px_20px_rgba(0,0,0,0.3)] group-hover:shadow-[0_10px_28px_rgba(0,0,0,0.5)] group-hover:gap-3 transition-all">
                <span className="w-6 h-6 rounded-md bg-black text-white flex items-center justify-center text-[9px] font-black">
                  AI
                </span>
                ChatGPT에서 열기
                <span className="group-hover:translate-x-1 transition-transform">→</span>
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
