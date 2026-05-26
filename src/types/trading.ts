import type { AiTradeSignal, RiskLevel, TradeDecision } from "@/src/types/signal";

export const TRADING_SYMBOLS = ["BTCUSDT", "ETHUSDT", "SOLUSDT", "AVAXUSDT"] as const;

export type TradingSymbol = (typeof TRADING_SYMBOLS)[number];
export type IndicatorStatus = "Bullish" | "Bearish" | "Neutral";
export type { AiTradeSignal, RiskLevel, TradeDecision };

export const SYMBOL_META: Record<
  TradingSymbol,
  { baseAsset: string; quoteAsset: string; name: string; accent: string }
> = {
  BTCUSDT: { baseAsset: "BTC", quoteAsset: "USDT", name: "Bitcoin", accent: "#39ff88" },
  ETHUSDT: { baseAsset: "ETH", quoteAsset: "USDT", name: "Ethereum", accent: "#8fffd0" },
  SOLUSDT: { baseAsset: "SOL", quoteAsset: "USDT", name: "Solana", accent: "#f8d267" },
  AVAXUSDT: { baseAsset: "AVAX", quoteAsset: "USDT", name: "Avalanche", accent: "#39ff88" }
};

export type Candle = {
  time: number;
  open: number;
  high: number;
  low: number;
  close: number;
  volume: number;
};

export type IndicatorReading = {
  label: string;
  value: number | null;
  displayValue: string;
  status: IndicatorStatus;
  interpretation: string;
  strength: number;
};

export type IndicatorSet = {
  rsi: IndicatorReading;
  ema: IndicatorReading & { fast: number | null; slow: number | null };
  macd: IndicatorReading & { macd: number | null; signal: number | null; histogram: number | null };
  atr: IndicatorReading & { percent: number | null };
  bollinger: IndicatorReading & {
    upper: number | null;
    middle: number | null;
    lower: number | null;
  };
  vwap: IndicatorReading;
  cards: IndicatorReading[];
};

export type MarketAsset = {
  symbol: TradingSymbol;
  baseAsset: string;
  quoteAsset: string;
  name: string;
  accent: string;
  price: number;
  priceChangePercent24h: number;
  volume24h: number;
  quoteVolume24h: number;
  high24h: number;
  low24h: number;
  candles: Candle[];
  indicators: IndicatorSet;
  marketScore: number;
};

export type MarketSnapshot = {
  source: "binance" | "coingecko" | "fallback";
  providerLabel: "LIVE: Binance" | "LIVE: CoinGecko" | "DEMO DATA";
  updatedAt: string;
  latencyMs: number;
  stale?: boolean;
  error?: string;
  attempts?: Array<{
    provider: "binance" | "coingecko" | "demo";
    ok: boolean;
    latencyMs: number;
    message?: string;
  }>;
  assets: MarketAsset[];
};

export type RiskReport = {
  score: number;
  level: RiskLevel;
  dailyLossLimit: number;
  currentDrawdown: number;
  maxSuggestedLeverage: number;
  warnings: string[];
  filters: Array<{ label: string; passed: boolean; detail: string }>;
};

export type InsightTone = "buy" | "sell" | "wait" | "risk";

export type MarketInsight = {
  title: string;
  body: string;
  time: string;
  tone: InsightTone;
  kind: "whale" | "momentum" | "volume" | "fear" | "volatility" | "ai";
};

export type TradePosition = {
  id: string;
  symbol: TradingSymbol;
  side: "Buy" | "Sell";
  size: number;
  leverage: number;
  entryPrice: number;
  openedAt: string;
};

export type TradeRecord = TradePosition & {
  notional: number;
  status: "OPEN";
};
