import type { MarketProviderLabel, MarketDataSource } from "@/src/types/market";

export type TradeDecision = "BUY" | "SELL" | "WAIT";
export type RiskLevel = "LOW" | "MEDIUM" | "HIGH";

export type SignalDataSource = MarketDataSource;

export type SignalEngineInput = {
  dataSource: SignalDataSource;
  providerLabel: MarketProviderLabel;
  leverage?: number;
};

export type RiskEngineInput = {
  dataSource: SignalDataSource;
  confidence: number;
  leverage: number;
};

export type SignalReason = {
  label: string;
  passed: boolean;
  detail: string;
};

export type AiTradeSignal = {
  decision: TradeDecision;
  confidence: number;
  entryPrice: number;
  stopLoss: number;
  takeProfit: number;
  marketSentiment: string;
  riskLevel: RiskLevel;
  riskScore: number;
  riskReward: number;
  reasoning: string;
  why: SignalReason[];
  dataSource: SignalDataSource;
  dataSourceLabel: MarketProviderLabel;
  generatedAt: string;
  model: string;
  fallback?: boolean;
};
