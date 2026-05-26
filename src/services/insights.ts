import type { AiTradeSignal, MarketAsset, MarketInsight, RiskReport } from "@/src/types/trading";

export function buildMarketInsights(
  assets: MarketAsset[],
  selected: MarketAsset,
  signal: AiTradeSignal,
  risk: RiskReport
): MarketInsight[] {
  const volumeLeader = [...assets].sort((a, b) => b.quoteVolume24h - a.quoteVolume24h)[0] ?? selected;
  const mover = [...assets].sort(
    (a, b) => Math.abs(b.priceChangePercent24h) - Math.abs(a.priceChangePercent24h)
  )[0] ?? selected;
  const atrPercent = selected.indicators.atr.percent ?? 0;
  const timeStamp = (minutesAgo: number) =>
    new Date(Date.now() - minutesAgo * 60_000).toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit"
    });
  const largeFlow = Math.max(2.4, volumeLeader.quoteVolume24h / 1_000_000_000);
  const volumeDelta = Math.min(42, Math.max(9, Math.abs(volumeLeader.priceChangePercent24h) * 6 + 8));

  return [
    {
      title: "Whale activity",
      body: `${volumeLeader.baseAsset} shows an estimated $${largeFlow.toFixed(1)}B liquidity footprint, suggesting institutional-size attention in the watchlist.`,
      time: timeStamp(1),
      tone: "buy",
      kind: "whale"
    },
    {
      title: "Volume spike",
      body: `${volumeLeader.baseAsset} volume is running about ${volumeDelta.toFixed(0)}% above the local baseline, improving simulated fill quality.`,
      time: timeStamp(3),
      tone: "buy",
      kind: "volume"
    },
    {
      title: "Momentum shift",
      body: `${mover.baseAsset} is moving ${mover.priceChangePercent24h.toFixed(2)}% over 24h, raising reversal and continuation probabilities.`,
      time: timeStamp(5),
      tone: mover.priceChangePercent24h >= 0 ? "buy" : "sell",
      kind: "momentum"
    },
    {
      title: "Volatility alert",
      body:
        atrPercent > 3.5
          ? `${selected.baseAsset} ATR is elevated at ${atrPercent.toFixed(2)}%, so Axorynth recommends smaller simulated size.`
          : `${selected.baseAsset} volatility is controlled at ${atrPercent.toFixed(2)}% ATR.`,
      time: timeStamp(7),
      tone: atrPercent > 3.5 ? "risk" : "wait",
      kind: "volatility"
    },
    {
      title: "Risk warning",
      body:
        risk.level === "HIGH"
          ? "Risk engine blocks aggressive leverage until confidence or volatility improves."
          : `${signal.decision} setup remains gated by ${signal.confidence}% confidence and ${risk.level.toLowerCase()} risk controls.`,
      time: timeStamp(9),
      tone: risk.level === "HIGH" ? "risk" : "buy",
      kind: "ai"
    }
  ];
}
