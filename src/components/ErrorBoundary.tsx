import { Component, type ErrorInfo, type ReactNode } from "react";

type Props = { children: ReactNode };
type State = { error: Error | null };

export default class ErrorBoundary extends Component<Props, State> {
  state: State = { error: null };

  static getDerivedStateFromError(error: Error): State {
    return { error };
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    console.error("App crashed:", error, info);
  }

  reload = () => {
    try { window.location.reload(); } catch {}
  };

  hardReload = () => {
    try {
      sessionStorage.clear();
      const url = new URL(window.location.href);
      url.searchParams.set("_ts", String(Date.now()));
      window.location.replace(url.toString());
    } catch { this.reload(); }
  };

  render() {
    if (!this.state.error) return this.props.children;

    return (
      <div className="min-h-[100dvh] flex items-center justify-center p-6 bg-gradient-to-br from-[#04081a] via-[#0d1530] to-[#04081a]">
        <div className="w-full max-w-md bg-white/95 backdrop-blur rounded-3xl p-7 shadow-2xl text-center">
          <img src="/logo.png" alt="" className="w-14 h-14 mx-auto mb-3 rounded-2xl shadow" />
          <div className="text-2xl mb-1">⚠️</div>
          <h1 className="text-lg font-bold text-ink mb-1.5">페이지를 불러오지 못했어요</h1>
          <p className="text-[12.5px] text-ink-muted leading-relaxed mb-5">
            일시적인 오류일 수 있어요. 아래 버튼으로 새로고침해주세요.
          </p>
          <div className="flex flex-col gap-2">
            <button onClick={this.reload}
                    className="w-full py-3 rounded-2xl bg-gold hover:bg-gold-bright text-white font-bold text-sm transition">
              🔄 새로고침
            </button>
            <button onClick={this.hardReload}
                    className="w-full py-2.5 rounded-2xl bg-white border-2 border-rose-300 hover:border-rose-500 text-rose-700 font-semibold text-[12.5px] transition">
              🔄 강력 새로고침 (캐시 무시)
            </button>
          </div>
          {this.state.error.message && (
            <details className="mt-4 text-left">
              <summary className="text-[11px] text-ink-soft cursor-pointer">오류 내용 보기</summary>
              <pre className="mt-2 p-2 bg-bg-base rounded-lg text-[10.5px] text-ink-muted whitespace-pre-wrap break-all">
                {this.state.error.message}
              </pre>
            </details>
          )}
        </div>
      </div>
    );
  }
}
