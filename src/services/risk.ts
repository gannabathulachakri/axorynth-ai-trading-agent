import { calculateRiskReport as calculateRiskReportFromEngine } from "@/src/services/riskEngine";
import type { AiTradeSignal, MarketAsset, RiskReport } from "@/src/types/trading";
import type { SignalDataSource } from "@/src/types/signal";

export function calculateRiskReport(
  asset: MarketAsset,
  signal: AiTradeSignal,
  leverage = 3,
  dataSource: SignalDataSource = signal.dataSource ?? "fallback"
): RiskReport {
  return calculateRiskReportFromEngine(asset, {
    dataSource,
    confidence: signal.confidence,
    leverage
  });
}
