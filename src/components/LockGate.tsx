import { useEffect, useState, type ReactNode } from "react";

type Props = {
  storageKey: string;
  passwordHash: string;
  lockLabel: string;
  lockTitle: string;
  lockSubtitle: string;
  lockDescription: string;
  hint: string;
  gradientFrom: string;
  gradientTo: string;
  children: ReactNode;
};

async function sha256(text: string): Promise<string> {
  const buf = new TextEncoder().encode(text);
  const hash = await crypto.subtle.digest("SHA-256", buf);
  return Array.from(new Uint8Array(hash))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}

export default function LockGate({
  storageKey,
  passwordHash,
  lockLabel,
  lockTitle,
  lockSubtitle,
  lockDescription,
  hint,
  gradientFrom,
  gradientTo,
  children,
}: Props) {
  const [unlocked, setUnlocked] = useState<null | boolean>(null);
  const [input, setInput] = useState("");
  const [error, setError] = useState("");
  const [checking, setChecking] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  useEffect(() => {
    setUnlocked(localStorage.getItem(storageKey) === "1");
  }, [storageKey]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!input.trim()) return;
    setChecking(true);
    setError("");
    try {
      const hash = await sha256(input.trim().toLowerCase());
      if (hash === passwordHash) {
        localStorage.setItem(storageKey, "1");
        setUnlocked(true);
      } else {
        setError("비밀번호가 맞지 않아요. 무료강의에서 알려드린 비번을 확인해주세요!");
      }
    } finally {
      setChecking(false);
    }
  }

  if (unlocked === null) {
    return (
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-20 text-center text-ink-soft">
        로딩 중...
      </div>
    );
  }

  if (unlocked) return <>{children}</>;

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-14">
      <div className="relative rounded-[28px] overflow-hidden shadow-[0_20px_60px_rgba(15,23,42,0.25)]">
        {/* 배경 그라디언트 */}
        <div
          className={`absolute inset-0 bg-gradient-to-br ${gradientFrom} ${gradientTo}`}
        />
        {/* 노이즈 그리드 */}
        <div
          className="absolute inset-0 opacity-[0.06]"
          style={{
            backgroundImage:
              "linear-gradient(to right, white 1px, transparent 1px), linear-gradient(to bottom, white 1px, transparent 1px)",
            backgroundSize: "28px 28px",
          }}
        />
        {/* 큰 자물쇠 워터마크 */}
        <div className="absolute -top-8 -right-10 text-[280px] leading-none opacity-[0.08] pointer-events-none select-none">
          🔒
        </div>

        <div className="relative p-5 sm:p-10 text-white">
          {/* 라벨 */}
          <div className="inline-flex items-center gap-2 px-2.5 sm:px-3 py-1 rounded-full bg-white/15 backdrop-blur border border-white/20 mb-4 sm:mb-5">
            <span className="w-1.5 h-1.5 rounded-full bg-amber-300 animate-pulse" />
            <span className="text-[9.5px] sm:text-[10px] font-black tracking-[0.22em] sm:tracking-[0.25em] uppercase">
              {lockLabel}
            </span>
          </div>

          {/* 타이틀 */}
          <div className="flex items-center gap-3 sm:gap-4 mb-3">
            <div className="text-5xl sm:text-6xl drop-shadow-lg">🔒</div>
            <div className="min-w-0">
              <div className="text-[10.5px] sm:text-[11px] font-bold tracking-[0.2em] text-white/60 uppercase mb-0.5">
                LOCKED
              </div>
              <h1 className="text-2xl sm:text-4xl font-black leading-tight">
                {lockTitle}
              </h1>
            </div>
          </div>

          {/* 부제 */}
          <p className="text-[13.5px] sm:text-[15px] text-white/85 leading-relaxed mb-1.5 font-semibold">
            {lockSubtitle}
          </p>
          <p className="text-[12.5px] sm:text-sm text-white/65 leading-relaxed mb-5 sm:mb-6 max-w-2xl">
            {lockDescription}
          </p>

          {/* "이렇게 받아가세요" 가이드 박스 */}
          <div className="rounded-2xl bg-white/10 backdrop-blur border border-white/15 p-4 sm:p-5 mb-5 sm:mb-6">
            <div className="flex items-center gap-2 mb-3">
              <span className="text-lg">🎓</span>
              <span className="text-[11.5px] sm:text-[12px] font-black tracking-wider text-white/90 uppercase">
                이렇게 받아가세요
              </span>
            </div>
            <ol className="space-y-2.5 sm:space-y-2 text-[13px] text-white/85 leading-relaxed">
              <li className="flex items-start gap-2.5">
                <span className="shrink-0 w-6 h-6 sm:w-5 sm:h-5 rounded-full bg-white/20 flex items-center justify-center text-[11px] sm:text-[10px] font-black">1</span>
                <span>박준휘쌤 <b className="text-white">무료강의</b>를 끝까지 시청하세요</span>
              </li>
              <li className="flex items-start gap-2.5">
                <span className="shrink-0 w-6 h-6 sm:w-5 sm:h-5 rounded-full bg-white/20 flex items-center justify-center text-[11px] sm:text-[10px] font-black">2</span>
                <span>강의 중 공개되는 <b className="text-white">비밀번호</b>를 메모</span>
              </li>
              <li className="flex items-start gap-2.5">
                <span className="shrink-0 w-6 h-6 sm:w-5 sm:h-5 rounded-full bg-white/20 flex items-center justify-center text-[11px] sm:text-[10px] font-black">3</span>
                <span>아래 입력창에 비번 입력 → <b className="text-white">잠금 해제!</b></span>
              </li>
            </ol>
          </div>

          {/* 비번 입력 */}
          <form onSubmit={handleSubmit} className="mb-4">
            <div className="text-[10.5px] sm:text-[11px] font-black tracking-[0.2em] text-white/60 uppercase mb-2">
              🔑 비밀번호 입력
            </div>
            <div className="flex flex-col sm:flex-row gap-2">
              <div className="relative flex-1">
                <input
                  type={showPassword ? "text" : "password"}
                  value={input}
                  onChange={(e) => {
                    setInput(e.target.value);
                    setError("");
                  }}
                  placeholder="강의에서 공개된 비밀번호"
                  className="w-full pl-4 pr-12 py-3.5 sm:py-3 rounded-xl bg-white/95 text-ink font-bold placeholder:text-ink-soft/60 focus:outline-none focus:ring-4 focus:ring-white/30 transition text-[14px]"
                  autoComplete="off"
                  inputMode="text"
                  autoCapitalize="off"
                  autoCorrect="off"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((v) => !v)}
                  aria-label={showPassword ? "비밀번호 숨기기" : "비밀번호 보기"}
                  className="absolute right-2 top-1/2 -translate-y-1/2 w-9 h-9 flex items-center justify-center rounded-lg hover:bg-ink/10 active:bg-ink/15 transition text-xl"
                >
                  {showPassword ? "🙈" : "👁"}
                </button>
              </div>
              <button
                type="submit"
                disabled={checking || !input.trim()}
                className="px-5 sm:px-6 py-3.5 sm:py-3 rounded-xl bg-gradient-to-r from-amber-400 via-yellow-500 to-amber-500 text-white font-extrabold text-[14px] sm:text-sm shadow-[0_6px_18px_rgba(251,191,36,0.4)] hover:shadow-[0_10px_28px_rgba(251,191,36,0.6)] transition disabled:opacity-50 whitespace-nowrap"
              >
                해제 →
              </button>
            </div>
            {error && (
              <div className="mt-2 text-[12.5px] text-rose-200 font-semibold">
                ⚠️ {error}
              </div>
            )}
          </form>

          {/* 힌트 */}
          <div className="flex items-start gap-2 text-[12px] text-white/70 leading-relaxed">
            <span className="shrink-0 mt-0.5">💡</span>
            <span>{hint}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
