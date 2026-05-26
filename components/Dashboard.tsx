"use client";

import {
  Activity,
  ArrowRight,
  BadgeAlert,
  BarChart3,
  BrainCircuit,
  CandlestickChart,
  CheckCircle2,
  Gauge,
  Lock,
  Play,
  RefreshCw,
  ShieldCheck,
  Sparkles,
  TrendingUp,
  Waves
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { motion } from "framer-motion";
import { AISignalCard } from "@/components/AISignalCard";
import { DemoTradePanel } from "@/components/DemoTradePanel";
import { Header } from "@/components/Header";
import { IndicatorCard } from "@/components/IndicatorCard";
import { InsightsFeed } from "@/components/InsightsFeed";
import { MarketCard } from "@/components/MarketCard";
import { MarketTicker } from "@/components/MarketTicker";
import { RiskPanel } from "@/components/RiskPanel";
import { TradingChart } from "@/components/TradingChart";
import { useTradingIntelligence } from "@/src/hooks/useTradingIntelligence";
import type { MarketAsset } from "@/src/types/trading";

const indicatorIcons: LucideIcon[] = [Gauge, TrendingUp, Activity, BarChart3, CandlestickChart, Waves];

const formatCurrency = (value: number) =>
  value.toLocaleString(undefined, {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: value > 1000 ? 0 : 2
  });

const formatCompact = (value: number) =>
  Intl.NumberFormat(undefined, {
    notation: "compact",
    maximumFractionDigits: 1
  }).format(value);

function toMarketCard(asset: MarketAsset) {
  return {
    symbol: asset.baseAsset,
    name: asset.name,
    price: formatCurrency(asset.price),
    change: `${asset.priceChangePercent24h >= 0 ? "+" : ""}${asset.priceChangePercent24h.toFixed(2)}%`,
    changeType: asset.priceChangePercent24h >= 0 ? ("up" as const) : ("down" as const),
    volume: `$${formatCompact(asset.quoteVolume24h || asset.volume24h)}`,
    confidence: asset.marketScore,
    accent: asset.accent,
    data: asset.candles.slice(-28).map((candle) => ({
      time: new Date(candle.time * 1000).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      value: candle.close
    }))
  };
}

export function Dashboard() {
  const {
    snapshot,
    selectedAsset,
    selectedSymbol,
    setSelectedSymbol,
    signal,
    riskReport,
    insights,
    loading,
    error,
    refreshMarket
  } = useTradingIntelligence();

  const assets = snapshot?.assets ?? [];
  const providerLabel = snapshot?.providerLabel ?? "LOADING DATA";
  const providerDisplayLabel = snapshot?.source === "fallback" ? "DEMO DATA ACTIVE" : providerLabel;
  const providerBadgeClass =
    snapshot?.source === "fallback"
      ? "border-axo-amber/30 bg-axo-amber/10 text-axo-amber"
      : "border-axo-green/25 bg-axo-green/10 text-axo-green";
  const providerDotClass = snapshot?.source === "fallback" ? "bg-axo-amber" : "bg-axo-green";

  return (
    <main id="top" className="relative min-h-screen overflow-hidden">
      <div className="pointer-events-none absolute inset-0 bg-matrix-grid bg-[size:44px_44px] opacity-[0.16]" />
      <div className="pointer-events-none absolute left-1/2 top-0 h-px w-[86vw] -translate-x-1/2 bg-gradient-to-r from-transparent via-axo-green/70 to-transparent" />
      <Header />

      <section className="relative mx-auto max-w-7xl px-4 pb-16 pt-12 sm:px-6 sm:pt-20 lg:px-8 lg:pb-24">
        <div className="grid items-center gap-8 lg:grid-cols-[1.02fr_0.98fr] lg:gap-10">
          <motion.div className="min-w-0" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <div className="mb-6 flex flex-wrap gap-2">
              <div className="inline-flex items-center gap-2 rounded-full border border-axo-green/30 bg-axo-green/10 px-3 py-2 text-sm font-medium text-axo-mint shadow-[0_0_30px_rgba(57,255,136,0.14)]">
                <Sparkles className="size-4" />
                LIVE DEMO MODE
              </div>
              <div className={`inline-flex items-center gap-2 rounded-full border px-3 py-2 text-sm font-medium ${providerBadgeClass}`}>
                <span className={`size-2 rounded-full ${providerDotClass}`} />
                {providerDisplayLabel}
              </div>
            </div>
            <h1 className="max-w-4xl text-5xl font-black text-white drop-shadow-[0_0_28px_rgba(57,255,136,0.18)] sm:text-6xl lg:text-7xl">
              Axorynth AI Trading Agent
            </h1>
            <p className="mt-6 max-w-2xl text-lg leading-8 text-white/65">
              Binance market data, technical indicators, structured AI reasoning, risk filters, and paper trading in
              one futuristic demo terminal.
            </p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <a
                href="#simulator"
                className="inline-flex h-12 items-center justify-center gap-2 rounded-lg bg-axo-green px-5 text-sm font-bold text-black shadow-glow transition hover:-translate-y-0.5 hover:bg-axo-mint"
              >
                <Play className="size-4 fill-black" />
                Launch Demo
              </a>
              <a
                href="#markets"
                className="inline-flex h-12 items-center justify-center gap-2 rounded-lg border border-white/15 bg-white/[0.045] px-5 text-sm font-semibold text-white transition hover:-translate-y-0.5 hover:border-axo-green/40 hover:text-axo-green"
              >
                View Markets
                <ArrowRight className="size-4" />
              </a>
            </div>
            <div className="mt-8 grid max-w-2xl grid-cols-3 gap-3 sm:gap-4">
              <HeroStat label="AI Confidence" value={signal ? `${signal.confidence}%` : "..."} />
              <HeroStat label="Live Assets" value={assets.length ? String(assets.length) : "..."} />
              <HeroStat label="Latency" value={snapshot ? `${snapshot.latencyMs}ms` : "..."} />
            </div>
            {error ? (
              <div className="mt-5 flex items-start gap-3 rounded-lg border border-axo-amber/25 bg-axo-amber/10 p-4 text-sm text-axo-amber">
                <BadgeAlert className="mt-0.5 size-5 shrink-0" />
                <span>{error}</span>
              </div>
            ) : null}
          </motion.div>

          <div className="glass-card neon-border relative min-w-0 overflow-hidden rounded-lg p-5 lg:p-6">
            <div className="absolute inset-x-6 top-0 h-px bg-gradient-to-r from-transparent via-axo-green/80 to-transparent" />
            <div className="relative">
              <div className="mb-5 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <span className="flex size-11 animate-pulse-glow items-center justify-center rounded-lg border border-axo-green/30 bg-axo-green/10 text-axo-green">
                    <BrainCircuit className="size-5" />
                  </span>
                  <div>
                    <p className="text-sm text-white/45">Neural Signal Stack</p>
                    <p className="font-semibold text-white">
                      {selectedAsset ? `${selectedAsset.baseAsset} Market Cortex` : "Market Cortex"}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <div
                    className={`flex items-center gap-2 rounded-full border px-3 py-1.5 text-xs font-semibold shadow-[0_0_24px_rgba(57,255,136,0.12)] ${providerBadgeClass}`}
                  >
                    <span className={`size-2 rounded-full ${providerDotClass}`} />
                    {providerDisplayLabel}
                  </div>
                  <button
                    onClick={() => void refreshMarket(true)}
                    disabled={loading.market}
                    className="flex size-9 items-center justify-center rounded-lg border border-white/10 bg-white/[0.05] text-white/70 transition hover:border-axo-green/40 hover:text-axo-green disabled:cursor-not-allowed disabled:opacity-50"
                    aria-label="Refresh market data"
                    title="Retry live market data"
                  >
                    <RefreshCw className={`size-4 ${loading.market ? "animate-spin" : ""}`} />
                  </button>
                </div>
              </div>
              <div className="grid gap-3 sm:grid-cols-2">
                <HeroModule icon={ShieldCheck} title="Risk Sentinel" value={riskReport?.level ?? "Scanning"} />
                <HeroModule icon={Lock} title="Execution" value="Simulated only" />
                <HeroModule icon={CheckCircle2} title="Decision" value={signal?.decision ?? "Analyzing"} />
                <HeroModule icon={Sparkles} title="Market Score" value={selectedAsset ? `${selectedAsset.marketScore}%` : "..."} />
              </div>
              <div className="mt-5">
                {assets.length ? <MarketTicker markets={assets} /> : <div className="h-14 animate-pulse rounded-lg bg-white/10" />}
              </div>
            </div>
          </div>
        </div>
      </section>

      <section id="markets" className="relative mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8 lg:py-12">
        <SectionHeading
          eyebrow="Live Markets"
          title="Multi-asset intelligence"
          copy="Multi-provider prices, 24h change, volume, candle history, and AI-scored market conditions."
        />
        <div className="mt-7 grid gap-5 sm:grid-cols-2 xl:grid-cols-4">
          {assets.length
            ? assets.map((asset) => (
                <MarketCard
                  key={asset.symbol}
                  market={toMarketCard(asset)}
                  active={asset.symbol === selectedSymbol}
                  onSelect={() => setSelectedSymbol(asset.symbol)}
                />
              ))
            : Array.from({ length: 4 }).map((_, index) => <SkeletonCard key={index} />)}
        </div>
      </section>

      <section className="relative mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8 lg:py-12">
        <TradingChart asset={selectedAsset} />
      </section>

      <section className="relative mx-auto grid max-w-7xl items-stretch gap-6 px-4 py-10 sm:px-6 lg:grid-cols-[1.15fr_0.85fr] lg:px-8 lg:py-12">
        <AISignalCard signal={signal} loading={loading.ai || !signal} />
        <InsightsFeed insights={insights} />
      </section>

      <section id="indicators" className="relative mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8 lg:py-12">
        <SectionHeading
          eyebrow="Technical Indicators"
          title="Signal confirmation layer"
          copy="RSI, EMA, MACD, ATR, Bollinger Bands, and VWAP calculated from live candle data."
        />
        <div className="mt-7 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {selectedAsset
            ? selectedAsset.indicators.cards.map((indicator, index) => (
                <IndicatorCard
                  key={indicator.label}
                  indicator={indicator}
                  icon={indicatorIcons[index] ?? Activity}
                />
              ))
            : Array.from({ length: 6 }).map((_, index) => <SkeletonCard key={index} />)}
        </div>
      </section>

      <section className="relative mx-auto grid max-w-7xl items-stretch gap-6 px-4 py-10 pb-16 sm:px-6 lg:grid-cols-[1fr_0.92fr] lg:px-8 lg:py-12 lg:pb-24">
        <RiskPanel asset={selectedAsset} signal={signal} risk={riskReport} />
        <DemoTradePanel
          assets={assets}
          selectedSymbol={selectedSymbol}
          onSymbolChange={setSelectedSymbol}
          signal={signal}
          risk={riskReport}
        />
      </section>
    </main>
  );
}

function SectionHeading({
  eyebrow,
  title,
  copy
}: {
  eyebrow: string;
  title: string;
  copy: string;
}) {
  return (
    <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
      <div>
        <p className="text-sm font-semibold uppercase text-axo-green">{eyebrow}</p>
        <h2 className="mt-2 text-3xl font-semibold text-white sm:text-4xl">{title}</h2>
      </div>
      <p className="max-w-xl text-sm leading-6 text-white/55">{copy}</p>
    </div>
  );
}

function HeroStat({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-lg border border-white/10 bg-white/[0.055] p-4 shadow-[inset_0_1px_0_rgba(255,255,255,0.08)] backdrop-blur-xl">
      <p className="text-2xl font-semibold text-white">{value}</p>
      <p className="mt-1 text-xs text-white/45">{label}</p>
    </div>
  );
}

function HeroModule({
  icon: Icon,
  title,
  value
}: {
  icon: LucideIcon;
  title: string;
  value: string;
}) {
  return (
    <div className="rounded-lg border border-white/10 bg-white/[0.055] p-4 shadow-[inset_0_1px_0_rgba(255,255,255,0.08)] transition hover:border-axo-green/30 hover:bg-axo-green/10">
      <Icon className="mb-4 size-5 text-axo-green" />
      <p className="text-sm text-white/45">{title}</p>
      <p className="mt-1 font-semibold text-white">{value}</p>
    </div>
  );
}

function SkeletonCard() {
  return <div className="glass-card h-64 animate-pulse rounded-lg" />;
}
