"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { calculateRiskReport } from "@/src/services/risk";
import { buildMarketInsights } from "@/src/services/insights";
import type {
  AiTradeSignal,
  MarketSnapshot,
  TradingSymbol
} from "@/src/types/trading";

type LoadState = {
  market: boolean;
  ai: boolean;
};

export function useTradingIntelligence() {
  const [snapshot, setSnapshot] = useState<MarketSnapshot | null>(null);
  const [selectedSymbol, setSelectedSymbol] = useState<TradingSymbol>("BTCUSDT");
  const [signal, setSignal] = useState<AiTradeSignal | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<LoadState>({ market: true, ai: true });
  const lastAiRequest = useRef(0);

  const selectedAsset = useMemo(() => {
    return snapshot?.assets.find((asset) => asset.symbol === selectedSymbol) ?? snapshot?.assets[0] ?? null;
  }, [selectedSymbol, snapshot]);

  const refreshMarket = useCallback(async (manual = false) => {
    try {
      setLoading((current) => ({ ...current, market: manual || !snapshot }));
      const response = await fetch("/api/market", { cache: "no-store" });
      if (!response.ok) throw new Error(`Market request failed: ${response.status}`);
      const data = (await response.json()) as MarketSnapshot;
      setSnapshot(data);
      if (data.source === "fallback") {
        setError("Live providers unavailable; resilient demo data is active.");
      } else if (data.source === "coingecko") {
        setError("Binance unavailable; CoinGecko live fallback is active.");
      } else {
        setError(null);
      }
    } catch (requestError) {
      setError(requestError instanceof Error ? requestError.message : "Unable to load market data.");
    } finally {
      setLoading((current) => ({ ...current, market: false }));
    }
  }, [snapshot]);

  const refreshAiSignal = useCallback(async () => {
    if (!selectedAsset) return;
    const now = Date.now();
    if (now - lastAiRequest.current < 12000 && signal?.generatedAt) return;
    lastAiRequest.current = now;

    try {
      setLoading((current) => ({ ...current, ai: true }));
      const response = await fetch("/api/ai-analysis", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          asset: selectedAsset,
          dataSource: snapshot?.source ?? "fallback",
          providerLabel: snapshot?.providerLabel ?? "DEMO DATA",
          leverage: 3
        })
      });
      if (!response.ok) throw new Error(`AI request failed: ${response.status}`);
      const data = (await response.json()) as AiTradeSignal;
      setSignal(data);
    } catch (requestError) {
      setError(requestError instanceof Error ? requestError.message : "Unable to load AI analysis.");
    } finally {
      setLoading((current) => ({ ...current, ai: false }));
    }
  }, [selectedAsset, signal?.generatedAt, snapshot?.providerLabel, snapshot?.source]);

  useEffect(() => {
    void refreshMarket();
    const interval = window.setInterval(() => void refreshMarket(false), 5000);
    return () => window.clearInterval(interval);
  }, [refreshMarket]);

  useEffect(() => {
    setSignal(null);
    lastAiRequest.current = 0;
  }, [selectedSymbol]);

  useEffect(() => {
    void refreshAiSignal();
  }, [refreshAiSignal, selectedAsset?.price]);

  const riskReport = useMemo(() => {
    if (!selectedAsset || !signal) return null;
    return calculateRiskReport(selectedAsset, signal, 3, snapshot?.source ?? signal.dataSource);
  }, [selectedAsset, signal, snapshot?.source]);

  const insights = useMemo(() => {
    if (!snapshot?.assets.length || !selectedAsset || !signal || !riskReport) return [];
    return buildMarketInsights(snapshot.assets, selectedAsset, signal, riskReport);
  }, [riskReport, selectedAsset, signal, snapshot?.assets]);

  return {
    snapshot,
    selectedAsset,
    selectedSymbol,
    setSelectedSymbol,
    signal,
    riskReport,
    insights,
    loading,
    error,
    refreshMarket,
    refreshAiSignal
  };
}
