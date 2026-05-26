import { Activity } from "lucide-react";
import type { MarketAsset } from "@/src/types/trading";

const formatCurrency = (value: number) =>
  value.toLocaleString(undefined, {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: value > 1000 ? 0 : 2
  });

export function MarketTicker({ markets }: { markets: MarketAsset[] }) {
  const tickerMarkets = [...markets, ...markets, ...markets];

  return (
    <div className="ticker-shell">
      <div className="ticker-track">
        {tickerMarkets.map((market, index) => (
          <span
            key={`${market.symbol}-${index}`}
            className="flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.045] px-3 py-1.5 text-sm text-white/65 shadow-[0_0_22px_rgba(57,255,136,0.08)]"
          >
            <Activity className="size-3.5 text-axo-green" />
            <span className="font-semibold text-white">{market.baseAsset}</span>
            <span>{formatCurrency(market.price)}</span>
            <span className={market.priceChangePercent24h >= 0 ? "text-axo-green" : "text-axo-red"}>
              {market.priceChangePercent24h >= 0 ? "+" : ""}
              {market.priceChangePercent24h.toFixed(2)}%
            </span>
          </span>
        ))}
      </div>
    </div>
  );
}
