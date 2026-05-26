import type { MarketAsset, RiskReport } from "@/src/types/trading";
import type { RiskEngineInput, RiskLevel } from "@/src/types/signal";

const clamp = (value: number, min: number, max: number) => Math.min(Math.max(value, min), max);

function sourcePenalty(dataSource: RiskEngineInput["dataSource"]) {
  if (dataSource === "binance") return 0;
  if (dataSource === "coingecko") return 8;
  return 22;
}

function levelFromScore(score: number): RiskLevel {
  if (score >= 70) return "HIGH";
  if (score >= 42) return "MEDIUM";
  return "LOW";
}

export function calculateRiskReport(
  asset: MarketAsset,
  input: RiskEngineInput
): RiskReport {
  const atrPercent = asset.indicators.atr.percent ?? 1.8;
  const rsi = asset.indicators.rsi.value ?? 50;
  const rsiExtremePenalty = rsi >= 74 || rsi <= 26 ? 24 : rsi >= 68 || rsi <= 32 ? 12 : 2;
  const volatilityPenalty = atrPercent >= 5 ? 36 : atrPercent >= 3.2 ? 24 : atrPercent >= 2 ? 12 : 5;
  const confidencePenalty = input.confidence < 58 ? 26 : input.confidence < 68 ? 15 : input.confidence < 76 ? 7 : 0;
  const leveragePenalty = input.leverage >= 10 ? 30 : input.leverage >= 5 ? 16 : input.leverage >= 3 ? 8 : 2;
  const dataPenalty = sourcePenalty(input.dataSource);
  const score = Math.round(
    clamp(volatilityPenalty + rsiExtremePenalty + confidencePenalty + leveragePenalty + dataPenalty, 5, 100)
  );
  const level = levelFromScore(score);
  const currentDrawdown = atrPercent >= 3.5 ? 2.6 : atrPercent >= 2 ? 1.4 : 0.7;
  const maxSuggestedLeverage =
    level === "HIGH" ? 1 : atrPercent > 3.2 || input.dataSource === "fallback" ? 2 : input.confidence >= 78 ? 5 : 3;

  const warnings = [
    atrPercent > 3.2 ? "High volatility warning: ATR is elevated for a fresh simulated entry." : null,
    rsi >= 70 ? "RSI overbought warning: upside continuation may be crowded." : null,
    rsi <= 30 ? "RSI oversold warning: downside continuation may be crowded." : null,
    input.dataSource === "fallback" ? "Demo data source warning: reduce confidence in live-market assumptions." : null,
    input.confidence < 68 ? "Confidence filter warning: signal confidence is below the premium threshold." : null,
    input.leverage > maxSuggestedLeverage
      ? "Unsafe leverage warning: selected leverage exceeds the current risk engine suggestion."
      : null
  ].filter((warning): warning is string => Boolean(warning));

  return {
    score,
    level,
    dailyLossLimit: 1250,
    currentDrawdown,
    maxSuggestedLeverage,
    warnings,
    filters: [
      {
        label: "Volatility warning",
        passed: atrPercent <= 3.2,
        detail: `${atrPercent.toFixed(2)}% ATR`
      },
      {
        label: "RSI Extremes",
        passed: rsi < 70 && rsi > 30,
        detail: `RSI ${rsi.toFixed(1)}`
      },
      {
        label: "Data source quality",
        passed: input.dataSource !== "fallback",
        detail: input.dataSource === "binance" ? "Primary live source" : input.dataSource === "coingecko" ? "Live fallback source" : "Demo fallback source"
      },
      {
        label: "Confidence threshold",
        passed: input.confidence >= 68,
        detail: `${input.confidence}% confidence`
      },
      {
        label: "Leverage warning",
        passed: input.leverage <= maxSuggestedLeverage,
        detail: `${input.leverage}x selected, ${maxSuggestedLeverage}x suggested`
      }
    ]
  };
}
