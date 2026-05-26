import { Bot, Menu, Sparkles } from "lucide-react";

const navItems = ["Markets", "Signal", "Risk", "Simulator"];

export function Header() {
  return (
    <header className="sticky top-0 z-50 border-b border-axo-green/15 bg-black/55 shadow-[0_18px_60px_rgba(0,0,0,0.28)] backdrop-blur-2xl">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
        <a href="#top" className="group flex items-center gap-3">
          <span className="flex size-10 items-center justify-center rounded-lg border border-axo-green/40 bg-axo-green/10 shadow-glow transition group-hover:scale-105">
            <Bot className="size-5 text-axo-green" />
          </span>
          <span className="min-w-0">
            <span className="block text-sm font-semibold uppercase text-axo-green">
              Axorynth
            </span>
            <span className="block text-xs text-white/60">AI Trading Agent</span>
          </span>
        </a>

        <nav className="hidden items-center gap-1 rounded-full border border-white/10 bg-white/[0.05] p-1 shadow-[inset_0_1px_0_rgba(255,255,255,0.08)] md:flex">
          {navItems.map((item) => (
            <a
              key={item}
              href={`#${item.toLowerCase()}`}
              className="rounded-full px-4 py-2 text-sm text-white/65 transition hover:bg-white/10 hover:text-white"
            >
              {item}
            </a>
          ))}
        </nav>

        <div className="flex items-center gap-3">
          <div className="hidden items-center gap-2 rounded-full border border-axo-green/20 bg-axo-green/10 px-3 py-2 text-xs font-medium text-axo-mint sm:flex">
            <Sparkles className="size-3.5" />
            LIVE DEMO MODE
          </div>
          <button
            className="flex size-10 items-center justify-center rounded-lg border border-white/10 bg-white/[0.04] text-white/75 transition hover:border-axo-green/40 hover:text-axo-green md:hidden"
            aria-label="Open navigation"
          >
            <Menu className="size-5" />
          </button>
        </div>
      </div>
    </header>
  );
}
