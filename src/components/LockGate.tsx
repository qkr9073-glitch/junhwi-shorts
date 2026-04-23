import { useEffect, useState, type ReactNode } from "react";

type Props = {
  storageKey: string;
  passwordHash: string;
  unlockDate: Date;
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

function useCountdown(target: Date) {
  const [now, setNow] = useState(() => Date.now());
  useEffect(() => {
    const id = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(id);
  }, []);
  const diff = Math.max(0, target.getTime() - now);
  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
  const minutes = Math.floor((diff / (1000 * 60)) % 60);
  const seconds = Math.floor((diff / 1000) % 60);
  return { days, hours, minutes, seconds, expired: diff <= 0 };
}

export default function LockGate({
  storageKey,
  passwordHash,
  unlockDate,
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
  const countdown = useCountdown(unlockDate);

  useEffect(() => {
    if (localStorage.getItem(storageKey) === "1") {
      setUnlocked(true);
      return;
    }
    if (new Date() >= unlockDate) {
      setUnlocked(true);
      return;
    }
    setUnlocked(false);
  }, [storageKey, unlockDate]);

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

        <div className="relative p-6 sm:p-10 text-white">
          {/* 라벨 */}
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/15 backdrop-blur border border-white/20 mb-5">
            <span className="w-1.5 h-1.5 rounded-full bg-amber-300 animate-pulse" />
            <span className="text-[10px] font-black tracking-[0.25em] uppercase">
              {lockLabel}
            </span>
          </div>

          {/* 타이틀 */}
          <div className="flex items-center gap-4 mb-3">
            <div className="text-5xl sm:text-6xl drop-shadow-lg">🔒</div>
            <div>
              <div className="text-[11px] font-bold tracking-[0.2em] text-white/60 uppercase mb-0.5">
                LOCKED
              </div>
              <h1 className="text-2xl sm:text-4xl font-black leading-tight">
                {lockTitle}
              </h1>
            </div>
          </div>

          {/* 부제 */}
          <p className="text-[14px] sm:text-[15px] text-white/80 leading-relaxed mb-1.5 font-semibold">
            {lockSubtitle}
          </p>
          <p className="text-[12.5px] sm:text-sm text-white/60 leading-relaxed mb-6 max-w-2xl">
            {lockDescription}
          </p>

          {/* 카운트다운 박스 */}
          <div className="rounded-2xl bg-white/10 backdrop-blur border border-white/15 p-4 sm:p-5 mb-6">
            <div className="flex items-center gap-2 mb-3">
              <span className="text-lg">📅</span>
              <span className="text-[12px] font-bold tracking-wider text-white/90">
                자동 공개 · 2026년 4월 30일 00:00
              </span>
            </div>
            {countdown.expired ? (
              <div className="text-[13px] font-bold text-emerald-300">
                ✨ 오픈 되었습니다! 새로고침 해주세요.
              </div>
            ) : (
              <div className="flex items-center gap-2 sm:gap-3">
                <TimeBox label="DAYS" value={countdown.days} />
                <div className="text-2xl sm:text-3xl font-black text-white/40">:</div>
                <TimeBox label="HOURS" value={countdown.hours} />
                <div className="text-2xl sm:text-3xl font-black text-white/40">:</div>
                <TimeBox label="MIN" value={countdown.minutes} />
                <div className="text-2xl sm:text-3xl font-black text-white/40">:</div>
                <TimeBox label="SEC" value={countdown.seconds} />
              </div>
            )}
          </div>

          {/* 비번 입력 */}
          <form onSubmit={handleSubmit} className="mb-4">
            <div className="text-[11px] font-black tracking-[0.2em] text-white/60 uppercase mb-2">
              🔑 무료강의 수강자용 비밀번호
            </div>
            <div className="flex gap-2">
              <input
                type="text"
                value={input}
                onChange={(e) => {
                  setInput(e.target.value);
                  setError("");
                }}
                placeholder="비밀번호 입력"
                className="flex-1 px-4 py-3 rounded-xl bg-white/95 text-ink font-bold placeholder:text-ink-soft/60 focus:outline-none focus:ring-4 focus:ring-white/30 transition"
                autoComplete="off"
              />
              <button
                type="submit"
                disabled={checking || !input.trim()}
                className="px-5 sm:px-6 py-3 rounded-xl bg-gradient-to-r from-amber-400 via-yellow-500 to-amber-500 text-white font-extrabold text-sm shadow-[0_6px_18px_rgba(251,191,36,0.4)] hover:shadow-[0_10px_28px_rgba(251,191,36,0.6)] transition disabled:opacity-50 whitespace-nowrap"
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

function TimeBox({ label, value }: { label: string; value: number }) {
  return (
    <div className="flex-1 text-center">
      <div className="text-2xl sm:text-4xl font-black leading-none tabular-nums">
        {String(value).padStart(2, "0")}
      </div>
      <div className="text-[8.5px] sm:text-[9px] font-bold tracking-[0.2em] text-white/50 mt-1">
        {label}
      </div>
    </div>
  );
}
