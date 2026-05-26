import { ArrowDownRight, ArrowUpRight, Cpu, WalletCards } from "lucide-react";
import { MiniChart } from "./MiniChart";

type MarketCardProps = {
  market: {
    symbol: string;
    name: string;
    price: string;
    change: string;
    changeType: "up" | "down";
    volume: string;
    confidence: number;
    accent: string;
    data: Array<{ time: string; value: number }>;
  };
  active?: boolean;
  onSelect?: () => void;
};

export function MarketCard({ market, active = false, onSelect }: MarketCardProps) {
  const isUp = market.changeType === "up";
  const ChangeIcon = isUp ? ArrowUpRight : ArrowDownRight;

  return (
    <article
      onClick={onSelect}
      onKeyDown={(event) => {
        if (!onSelect) return;
        if (event.key === "Enter" || event.key === " ") {
          event.preventDefault();
          onSelect();
        }
      }}
      role={onSelect ? "button" : undefined}
      tabIndex={onSelect ? 0 : undefined}
      className={`glass-card neon-border group relative h-full min-w-0 overflow-hidden rounded-lg p-5 transition duration-500 hover:-translate-y-1 hover:border-axo-green/40 hover:shadow-glow sm:p-6 ${
        onSelect ? "cursor-pointer" : ""
      } ${active ? "border-axo-green/50 shadow-glow" : ""}`}
    >
      <div
        className="absolute inset-x-5 top-0 h-px opacity-80"
        style={{
          background: `linear-gradient(90deg, transparent, ${market.accent}, transparent)`
        }}
      />
      <div className="mb-5 flex items-start justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xl font-semibold text-white">{market.symbol}</span>
            <span className="rounded-full border border-white/10 bg-white/[0.06] px-2 py-0.5 text-xs text-white/50">
              {market.name}
            </span>
          </div>
          <p className="mt-2 text-2xl font-semibold text-white sm:text-3xl">
            {market.price}
          </p>
        </div>
        <div
          className={`flex items-center gap-1 rounded-full px-2.5 py-1 text-sm font-medium ${
            isUp
              ? "bg-axo-green/15 text-axo-green"
              : "bg-axo-red/15 text-axo-red"
          }`}
        >
          <ChangeIcon className="size-4" />
          {market.change}
        </div>
      </div>

      <MiniChart data={market.data} color={market.accent} />

      <div className="mt-5 grid grid-cols-2 gap-3">
        <div className="rounded-lg border border-white/10 bg-black/25 p-3 shadow-[inset_0_1px_0_rgba(255,255,255,0.06)]">
          <div className="flex items-center gap-2 text-xs text-white/45">
            <WalletCards className="size-3.5" />
            Volume
          </div>
          <p className="mt-1 text-sm font-semibold text-white">{market.volume}</p>
        </div>
        <div className="rounded-lg border border-white/10 bg-black/25 p-3 shadow-[inset_0_1px_0_rgba(255,255,255,0.06)]">
          <div className="flex items-center gap-2 text-xs text-white/45">
            <Cpu className="size-3.5" />
            AI Score
          </div>
          <p className="mt-1 text-sm font-semibold text-white">{market.confidence}%</p>
        </div>
      </div>
    </article>
  );
}
