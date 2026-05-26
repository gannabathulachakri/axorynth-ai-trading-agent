import { AlertTriangle, CheckCircle2, LockKeyhole, Scale, ShieldAlert, Zap } from "lucide-react";
import { MiniChart } from "./MiniChart";
import type { AiTradeSignal, MarketAsset, RiskReport } from "@/src/types/trading";

type RiskPanelProps = {
  asset: MarketAsset | null;
  signal: AiTradeSignal | null;
  risk: RiskReport | null;
};

export function RiskPanel({ asset, signal, risk }: RiskPanelProps) {
  const equityCurve =
    asset?.candles.slice(-7).map((candle, index) => ({
      time: `T-${6 - index}`,
      value: 10000 + (candle.close - asset.candles[asset.candles.length - 7].close) * 0.4
    })) ?? [];

  const stats = [
    {
      label: "Risk Score",
      value: risk ? `${risk.score}/100` : "Loading",
      detail: risk ? `${risk.level} risk regime` : "Awaiting AI filters",
      icon: ShieldAlert
    },
    {
      label: "Daily Loss Protection",
      value: risk ? `$${risk.dailyLossLimit.toLocaleString()}` : "$1,250",
      detail: risk ? `${risk.currentDrawdown.toFixed(1)}% current drawdown` : "Demo guardrail",
      icon: Scale
    },
    {
      label: "Max Leverage",
      value: risk ? `${risk.maxSuggestedLeverage}x` : "3x",
      detail: "Suggested by volatility engine",
      icon: Zap
    }
  ];

  return (
    <section id="risk" className="glass-card neon-border h-full min-w-0 overflow-hidden rounded-lg p-6">
      <div className="mb-6 h-px w-full bg-gradient-to-r from-transparent via-axo-green/50 to-transparent" />
      <div className="mb-6 flex items-start justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-sm font-semibold uppercase text-axo-green">
            <Scale className="size-4" />
            Risk Management
          </div>
          <h2 className="mt-2 text-2xl font-semibold text-white">
            Capital guardrails
          </h2>
        </div>
        <div className="rounded-full border border-axo-green/30 bg-axo-green/10 px-3 py-1.5 text-xs font-semibold text-axo-green">
          Online
        </div>
      </div>

      <div className="grid gap-3 sm:grid-cols-3">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <div key={stat.label} className="rounded-lg border border-white/10 bg-black/25 p-4 shadow-[inset_0_1px_0_rgba(255,255,255,0.06)]">
              <div className="mb-4 flex items-center justify-between">
                <Icon className="size-5 text-axo-green" />
                <LockKeyhole className="size-4 text-white/30" />
              </div>
              <p className="text-sm text-white/48">{stat.label}</p>
              <p className="mt-1 text-xl font-semibold text-white">{stat.value}</p>
              <p className="mt-1 text-xs text-white/40">{stat.detail}</p>
            </div>
          );
        })}
      </div>

      <div className="mt-5 grid gap-4 lg:grid-cols-[1.15fr_0.85fr]">
        <div className="rounded-lg border border-white/10 bg-black/25 p-4 shadow-[inset_0_1px_0_rgba(255,255,255,0.06)]">
          <div className="mb-4 flex items-center justify-between">
            <p className="text-sm font-medium text-white/70">Simulated Equity</p>
            <p className="text-sm font-semibold text-axo-green">
              {signal ? `${signal.decision} bias` : "Calculating"}
            </p>
          </div>
          {equityCurve.length ? (
            <MiniChart data={equityCurve} height={160} showAxis />
          ) : (
            <div className="h-40 animate-pulse rounded-lg bg-white/10" />
          )}
        </div>
        <div className="rounded-lg border border-axo-amber/20 bg-axo-amber/10 p-4">
          <div className="flex items-center gap-2 text-sm font-medium text-axo-amber">
            <AlertTriangle className="size-4" />
            Guardrail Status
          </div>
          <div className="mt-5 space-y-3">
            {risk?.filters.map((filter) => (
              <div key={filter.label} className="rounded-lg border border-white/10 bg-black/20 p-3">
                <div className="flex items-center justify-between gap-3">
                  <div>
                    <p className="text-sm font-medium text-white">{filter.label}</p>
                    <p className="mt-1 text-xs text-white/48">{filter.detail}</p>
                  </div>
                  {filter.passed ? (
                    <CheckCircle2 className="size-5 text-axo-green" />
                  ) : (
                    <AlertTriangle className="size-5 text-axo-amber" />
                  )}
                </div>
              </div>
            ))}
            {risk?.warnings.length ? (
              <div className="space-y-2">
                {risk.warnings.map((warning) => (
                  <div key={warning} className="rounded-lg border border-axo-red/25 bg-axo-red/10 p-3 text-xs leading-5 text-axo-red">
                    {warning}
                  </div>
                ))}
              </div>
            ) : (
              <div className="rounded-lg border border-axo-green/20 bg-axo-green/10 p-3 text-xs leading-5 text-axo-green">
                Daily loss protection, confidence threshold, volatility warning, and leverage warning checks are clear.
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
