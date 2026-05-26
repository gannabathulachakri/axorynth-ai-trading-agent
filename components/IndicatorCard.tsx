import type { LucideIcon } from "lucide-react";
import type { IndicatorReading } from "@/src/types/trading";

type IndicatorCardProps = {
  indicator: IndicatorReading;
  icon: LucideIcon;
};

const signalStyles = {
  Bullish: "border-axo-green/20 bg-axo-green/10 text-axo-green",
  Bearish: "border-axo-red/20 bg-axo-red/10 text-axo-red",
  Neutral: "border-axo-amber/20 bg-axo-amber/10 text-axo-amber"
};

export function IndicatorCard({ indicator, icon: Icon }: IndicatorCardProps) {
  return (
    <article className="glass-card group h-full min-w-0 overflow-hidden rounded-lg p-5 transition duration-500 hover:-translate-y-1 hover:border-axo-green/35">
      <div className="mb-5 h-px w-full bg-gradient-to-r from-transparent via-axo-green/40 to-transparent opacity-70" />
      <div className="mb-5 flex items-center justify-between gap-4">
        <span className="flex size-10 items-center justify-center rounded-lg border border-white/10 bg-black/25 text-axo-green transition group-hover:border-axo-green/35 group-hover:bg-axo-green/10">
          <Icon className="size-5" />
        </span>
        <span
          className={`rounded-full border px-2.5 py-1 text-xs font-medium ${signalStyles[indicator.status]}`}
        >
          {indicator.status}
        </span>
      </div>
      <div className="flex items-end justify-between gap-3">
        <div>
          <p className="text-sm text-white/48">{indicator.label}</p>
          <p className="mt-1 text-2xl font-semibold text-white">{indicator.displayValue}</p>
        </div>
        <p className="text-sm font-medium text-white/55">{indicator.strength}%</p>
      </div>
      <div className="mt-4 h-2 overflow-hidden rounded-full bg-white/10 shadow-inner">
        <div
          className="h-full rounded-full bg-gradient-to-r from-axo-green to-axo-mint shadow-glow"
          style={{ width: `${indicator.strength}%` }}
        />
      </div>
      <p className="mt-4 text-xs leading-5 text-white/50">{indicator.interpretation}</p>
    </article>
  );
}
