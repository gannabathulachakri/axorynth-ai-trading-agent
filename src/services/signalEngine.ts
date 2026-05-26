import { calculateRiskReport } from "@/src/services/riskEngine";
import type { MarketAsset } from "@/src/types/trading";
import type { AiTradeSignal, SignalEngineInput, SignalReason, TradeDecision } from "@/src/types/signal";

const clamp = (value: number, min: number, max: number) => Math.min(Math.max(value, min), max);

function fmt(value: number, digits = 2) {
  return value.toLocaleString(undefined, { maximumFractionDigits: digits });
}

function sourceConfidenceAdjustment(source: SignalEngineInput["dataSource"]) {
  if (source === "binance") return 6;
  if (source === "coingecko") return 0;
  return -12;
}

function buildConfidence(asset: MarketAsset, confluence: number, input: SignalEngineInput) {
  const base = asset.marketScore * 0.48 + 33;
  const changeBoost = Math.min(Math.abs(asset.priceChangePercent24h) * 1.8, 8);
  const sourceBoost = sourceConfidenceAdjustment(input.dataSource);
  return Math.round(clamp(base + confluence * 4.5 + changeBoost + sourceBoost, 28, 94));
}

function setupPrices(asset: MarketAsset, decision: TradeDecision) {
  const atr = asset.indicators.atr.value ?? asset.price * 0.018;
  const stopDistance = Math.max(atr * 1.25, asset.price * 0.012);
  const targetDistance = stopDistance * 2.05;

  if (decision === "SELL") {
    return {
      entryPrice: asset.price,
      stopLoss: asset.price + stopDistance,
      takeProfit: asset.price - targetDistance,
      riskReward: targetDistance / stopDistance
    };
  }

  return {
    entryPrice: asset.price,
    stopLoss: asset.price - stopDistance,
    takeProfit: asset.price + targetDistance,
    riskReward: targetDistance / stopDistance
  };
}

function localReasoning(asset: MarketAsset, decision: TradeDecision, why: SignalReason[], riskLevel: string) {
  const passed = why.filter((item) => item.passed).map((item) => item.label.toLowerCase());
  const failed = why.filter((item) => !item.passed).map((item) => item.label.toLowerCase());

  if (decision === "BUY") {
    return `Bullish trend alignment, controlled RSI at ${fmt(asset.indicators.rsi.value ?? 0, 1)}, and positive MACD momentum support a simulated long setup. Risk is ${riskLevel.toLowerCase()}, so sizing remains guarded.`;
  }

  if (decision === "SELL") {
    return `Bearish trend alignment, RSI above oversold territory, and negative MACD momentum support a simulated short setup. Risk is ${riskLevel.toLowerCase()}, so stops remain tight.`;
  }

  return `Axorynth is waiting because ${failed.length ? failed.join(", ") : "signal confluence"} is not strong enough. Passed checks include ${passed.length ? passed.join(", ") : "risk guardrails"}, but mixed conditions favor patience.`;
}

export function generateLocalSignal(asset: MarketAsset, input: SignalEngineInput): AiTradeSignal {
  const leverage = input.leverage ?? 3;
  const rsi = asset.indicators.rsi.value ?? 50;
  const macdHistogram = asset.indicators.macd.histogram ?? 0;
  const trendBullish = asset.indicators.ema.status === "Bullish" && asset.indicators.vwap.status !== "Bearish";
  const trendBearish = asset.indicators.ema.status === "Bearish" && asset.indicators.vwap.status !== "Bullish";
  const macdPositive = macdHistogram > 0;
  const macdNegative = macdHistogram < 0;

  const preliminaryReasons = [
    trendBullish || trendBearish ? 1 : 0,
    macdPositive || macdNegative ? 1 : 0,
    rsi < 70 && rsi > 30 ? 1 : 0,
    asset.indicators.atr.percent && asset.indicators.atr.percent < 3.2 ? 1 : 0
  ].reduce((sum, value) => sum + value, 0);
  const confidence = buildConfidence(asset, preliminaryReasons, input);
  const risk = calculateRiskReport(asset, {
    dataSource: input.dataSource,
    confidence,
    leverage
  });
  const highConfidence = confidence >= 68;

  let decision: TradeDecision = "WAIT";
  if (risk.level !== "HIGH" && trendBullish && rsi < 70 && macdPositive && highConfidence) {
    decision = "BUY";
  } else if (risk.level !== "HIGH" && trendBearish && rsi > 30 && macdNegative && highConfidence) {
    decision = "SELL";
  }

  const why: SignalReason[] = [
    {
      label: "Trend",
      passed: decision === "BUY" ? trendBullish : decision === "SELL" ? trendBearish : trendBullish || trendBearish,
      detail: `${asset.indicators.ema.status} EMA/VWAP structure`
    },
    {
      label: "RSI",
      passed: decision === "BUY" ? rsi < 70 : decision === "SELL" ? rsi > 30 : rsi < 70 && rsi > 30,
      detail: `RSI ${fmt(rsi, 1)}`
    },
    {
      label: "MACD",
      passed: decision === "BUY" ? macdPositive : decision === "SELL" ? macdNegative : macdPositive || macdNegative,
      detail: `Histogram ${fmt(macdHistogram, 4)}`
    },
    {
      label: "Confidence",
      passed: highConfidence,
      detail: `${confidence}% confidence`
    },
    {
      label: "Risk",
      passed: risk.level !== "HIGH",
      detail: `${risk.level} risk, score ${risk.score}/100`
    }
  ];

  const prices = setupPrices(asset, decision);
  const marketSentiment =
    trendBullish && macdPositive
      ? "Bullish momentum"
      : trendBearish && macdNegative
        ? "Bearish momentum"
        : "Mixed consolidation";

  return {
    decision,
    confidence,
    ...prices,
    marketSentiment,
    riskLevel: risk.level,
    riskScore: risk.score,
    reasoning: localReasoning(asset, decision, why, risk.level),
    why,
    dataSource: input.dataSource,
    dataSourceLabel: input.providerLabel,
    generatedAt: new Date().toISOString(),
    model: "local-signal-engine",
    fallback: input.dataSource === "fallback"
  };
}
