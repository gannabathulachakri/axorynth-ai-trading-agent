export type MarketDataProvider = "binance" | "coingecko" | "demo";

export type MarketDataSource = "binance" | "coingecko" | "fallback";

export type MarketProviderLabel = "LIVE: Binance" | "LIVE: CoinGecko" | "DEMO DATA";

export type MarketProviderAttempt = {
  provider: MarketDataProvider;
  ok: boolean;
  latencyMs: number;
  message?: string;
};

export type CoinGeckoCoinId = "bitcoin" | "ethereum" | "solana" | "avalanche-2";

export {
  SYMBOL_META,
  TRADING_SYMBOLS,
  type Candle,
  type MarketAsset,
  type MarketSnapshot,
  type TradingSymbol
} from "@/src/types/trading";
