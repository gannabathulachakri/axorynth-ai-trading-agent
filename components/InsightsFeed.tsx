import {
  Activity,
  AlertTriangle,
  BrainCircuit,
  Clock3,
  Radio,
  RadioTower,
  TrendingUp,
  Waves
} from "lucide-react";
import type { MarketInsight } from "@/src/types/trading";

const toneStyles = {
  buy: "bg-axo-green/15 text-axo-green border-axo-green/25",
  sell: "bg-axo-red/15 text-axo-red border-axo-red/25",
  wait: "bg-axo-amber/15 text-axo-amber border-axo-amber/25",
  risk: "bg-axo-red/15 text-axo-red border-axo-red/25"
};

const iconMap = {
  whale: RadioTower,
  momentum: TrendingUp,
  volume: Activity,
  fear: BrainCircuit,
  volatility: AlertTriangle,
  ai: Waves
};

export function InsightsFeed({ insights }: { insights: MarketInsight[] }) {
  const feed = insights.length ? insights : [];

  return (
    <section className="glass-card neon-border h-full min-w-0 overflow-hidden rounded-lg p-6">
      <div className="mb-6 h-px w-full bg-gradient-to-r from-transparent via-axo-green/50 to-transparent" />
      <div className="mb-6 flex items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-sm font-semibold uppercase text-axo-green">
            <Radio className="size-4" />
            AI Insights
          </div>
          <h2 className="mt-2 text-2xl font-semibold text-white">
            Live strategy feed
          </h2>
        </div>
        <span className="relative flex size-3">
          <span className="absolute inline-flex size-full animate-ping rounded-full bg-axo-green opacity-45" />
          <span className="relative inline-flex size-3 rounded-full bg-axo-green" />
        </span>
      </div>

      <div className="max-h-[520px] space-y-3 overflow-y-auto pr-1">
        {!feed.length ? (
          <>
            <div className="h-24 animate-pulse rounded-lg bg-white/10" />
            <div className="h-24 animate-pulse rounded-lg bg-white/10" />
            <div className="h-24 animate-pulse rounded-lg bg-white/10" />
          </>
        ) : null}
        {feed.map((insight) => {
          const Icon = iconMap[insight.kind];
          return (
            <article
              key={insight.title}
              className="rounded-lg border border-white/10 bg-black/25 p-4 shadow-[inset_0_1px_0_rgba(255,255,255,0.05)] transition hover:border-axo-green/30 hover:bg-white/[0.055]"
            >
              <div className="mb-3 flex items-start justify-between gap-4">
                <div className="flex items-center gap-3">
                  <span
                    className={`flex size-9 items-center justify-center rounded-lg border ${toneStyles[insight.tone]}`}
                  >
                    <Icon className="size-4" />
                  </span>
                  <h3 className="font-semibold text-white">{insight.title}</h3>
                </div>
                <div className="flex shrink-0 items-center gap-1 text-xs text-white/40">
                  <Clock3 className="size-3.5" />
                  {insight.time}
                </div>
              </div>
              <p className="text-sm leading-6 text-white/60">{insight.body}</p>
            </article>
          );
        })}
      </div>
    </section>
  );
}
