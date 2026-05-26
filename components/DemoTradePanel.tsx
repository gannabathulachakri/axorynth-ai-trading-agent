"use client";

import { useMemo, useState } from "react";
import { motion } from "framer-motion";
import { AlertTriangle, CheckCircle2, Coins, Send, SlidersHorizontal, X } from "lucide-react";
import type {
  AiTradeSignal,
  MarketAsset,
  RiskReport,
  TradePosition,
  TradeRecord,
  TradingSymbol
} from "@/src/types/trading";

type DemoTradePanelProps = {
  assets: MarketAsset[];
  selectedSymbol: TradingSymbol;
  onSymbolChange: (symbol: TradingSymbol) => void;
  signal: AiTradeSignal | null;
  risk: RiskReport | null;
};

type Side = "Buy" | "Sell";

const formatCurrency = (value: number) =>
  value.toLocaleString(undefined, {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: value > 1000 ? 0 : 2
  });

export function DemoTradePanel({
  assets,
  selectedSymbol,
  onSymbolChange,
  signal,
  risk
}: DemoTradePanelProps) {
  const [side, setSide] = useState<Side>("Buy");
  const [size, setSize] = useState(0.05);
  const [leverage, setLeverage] = useState(3);
  const [accountBalance] = useState(100000);
  const [positions, setPositions] = useState<TradePosition[]>([]);
  const [history, setHistory] = useState<TradeRecord[]>([]);
  const [showConfirm, setShowConfirm] = useState(false);

  const asset = assets.find((item) => item.symbol === selectedSymbol) ?? assets[0];
  const currentPrice = asset?.price ?? 0;
  const notional = currentPrice * size * leverage;
  const margin = currentPrice * size;

  const totalPnl = useMemo(() => {
    return positions.reduce((sum, position) => {
      const liveAsset = assets.find((item) => item.symbol === position.symbol);
      const livePrice = liveAsset?.price ?? position.entryPrice;
      const direction = position.side === "Buy" ? 1 : -1;
      return sum + (livePrice - position.entryPrice) * position.size * position.leverage * direction;
    }, 0);
  }, [assets, positions]);

  const unsafeLeverage = risk ? leverage > risk.maxSuggestedLeverage : leverage > 5;

  const confirmTrade = () => {
    if (!asset) return;
    const position: TradePosition = {
      id: crypto.randomUUID(),
      symbol: asset.symbol,
      side,
      size,
      leverage,
      entryPrice: asset.price,
      openedAt: new Date().toISOString()
    };
    setPositions((current) => [position, ...current].slice(0, 5));
    setHistory((current) => [{ ...position, notional, status: "OPEN" as const }, ...current].slice(0, 6));
    setShowConfirm(false);
  };

  return (
    <section id="simulator" className="glass-card neon-border h-full min-w-0 overflow-hidden rounded-lg p-6">
      <div className="mb-6 h-px w-full bg-gradient-to-r from-transparent via-axo-green/50 to-transparent" />
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <div className="flex items-center gap-2 text-sm font-semibold uppercase text-axo-green">
            <SlidersHorizontal className="size-4" />
            Demo Simulator
          </div>
          <h2 className="mt-2 text-2xl font-semibold text-white">Paper trade console</h2>
          <p className="mt-3 inline-flex rounded-full border border-axo-amber/25 bg-axo-amber/10 px-3 py-1.5 text-xs font-semibold text-axo-amber">
            Simulation only — no real-money execution.
          </p>
        </div>
        <div className="rounded-lg border border-white/10 bg-black/30 px-4 py-3 shadow-[inset_0_1px_0_rgba(255,255,255,0.06)]">
          <p className="text-xs text-white/45">Simulated PnL</p>
          <p className={`mt-1 text-2xl font-semibold ${totalPnl >= 0 ? "text-axo-green" : "text-axo-red"}`}>
            {totalPnl >= 0 ? "+" : "-"}
            {formatCurrency(Math.abs(totalPnl))}
          </p>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <label className="block">
          <span className="mb-2 block text-sm text-white/60">Symbol</span>
          <select
            value={selectedSymbol}
            onChange={(event) => onSymbolChange(event.target.value as TradingSymbol)}
            className="control-ring h-12 w-full rounded-lg px-4 text-white"
          >
            {assets.map((market) => (
              <option key={market.symbol} value={market.symbol} className="bg-axo-black">
                {market.baseAsset} - {market.name}
              </option>
            ))}
          </select>
        </label>

        <label className="block">
          <span className="mb-2 block text-sm text-white/60">Position Size</span>
          <div className="control-ring flex h-12 items-center rounded-lg px-4">
            <Coins className="mr-2 size-4 text-axo-green" />
            <input
              min="0.001"
              step="0.001"
              value={size}
              onChange={(event) => setSize(Math.max(Number(event.target.value), 0))}
              type="number"
              className="w-full bg-transparent text-white outline-none"
            />
          </div>
        </label>
      </div>

      <div className="mt-4 grid gap-4 md:grid-cols-2">
        <div>
          <span className="mb-2 block text-sm text-white/60">Side</span>
          <div className="grid grid-cols-2 gap-2 rounded-lg border border-white/10 bg-black/25 p-1">
            {(["Buy", "Sell"] as const).map((option) => (
              <button
                key={option}
                onClick={() => setSide(option)}
                className={`h-11 rounded-md text-sm font-semibold transition ${
                  side === option
                    ? option === "Buy"
                      ? "bg-axo-green text-black shadow-glow"
                      : "bg-axo-red text-white"
                    : "text-white/60 hover:bg-white/10 hover:text-white"
                }`}
              >
                {option}
              </button>
            ))}
          </div>
        </div>

        <label className="block">
          <span className="mb-2 block text-sm text-white/60">Leverage</span>
          <select
            value={leverage}
            onChange={(event) => setLeverage(Number(event.target.value))}
            className="control-ring h-12 w-full rounded-lg px-4 text-white"
          >
            {[1, 2, 3, 5, 10].map((item) => (
              <option key={item} value={item} className="bg-axo-black">
                {item}x
              </option>
            ))}
          </select>
        </label>
      </div>

      <div className="mt-5 rounded-lg border border-white/10 bg-black/30 p-4 shadow-[inset_0_1px_0_rgba(255,255,255,0.06)]">
        <div className="grid gap-3 text-sm sm:grid-cols-3">
          <Summary label="Balance" value={formatCurrency(accountBalance)} />
          <Summary label="Equity" value={formatCurrency(accountBalance + totalPnl)} />
          <Summary label="Notional" value={formatCurrency(notional)} />
          <Summary label="Margin" value={formatCurrency(margin)} />
          <Summary label="AI Signal" value={signal ? `${signal.decision} ${signal.confidence}%` : "Loading"} />
          <Summary label="Mode" value="Simulation only" />
        </div>
      </div>

      {unsafeLeverage ? (
        <div className="mt-4 flex items-start gap-3 rounded-lg border border-axo-amber/25 bg-axo-amber/10 p-4 text-sm text-axo-amber">
          <AlertTriangle className="mt-0.5 size-5 shrink-0" />
          <span>Unsafe leverage warning: selected leverage is above the current risk engine suggestion.</span>
        </div>
      ) : null}

      <button
        onClick={() => setShowConfirm(true)}
        className="mt-5 flex h-12 w-full items-center justify-center gap-2 rounded-lg bg-axo-green px-5 text-sm font-bold text-black shadow-glow transition hover:-translate-y-0.5 hover:bg-axo-mint"
      >
        <Send className="size-4" />
        Preview Simulated Trade
      </button>

      <div className="mt-5 grid gap-3 lg:grid-cols-2">
        <TradeList title="Open Positions" positions={positions} assets={assets} />
        <HistoryList history={history} />
      </div>

      {showConfirm ? (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4 backdrop-blur-md"
        >
          <motion.div
            initial={{ scale: 0.96, y: 16 }}
            animate={{ scale: 1, y: 0 }}
            className="w-full max-w-md rounded-lg border border-axo-green/30 bg-[#06110c] p-5 shadow-glow"
          >
            <div className="mb-4 flex items-center justify-between">
              <div className="flex items-center gap-2 text-axo-green">
                <CheckCircle2 className="size-5" />
                <h3 className="font-semibold text-white">Confirm paper trade</h3>
              </div>
              <button onClick={() => setShowConfirm(false)} className="text-white/50 transition hover:text-white">
                <X className="size-5" />
              </button>
            </div>
            <p className="text-sm leading-6 text-white/60">
              Simulation only — no real-money execution. This creates a simulated {side.toLowerCase()} position only. No
              broker, exchange, wallet, or real-money order is connected.
            </p>
            <div className="mt-4 rounded-lg border border-white/10 bg-black/30 p-4 text-sm">
              <Summary label="Setup" value={`${side} ${size} ${asset?.baseAsset ?? ""} at ${leverage}x`} />
              <div className="mt-3">
                <Summary label="Entry" value={formatCurrency(currentPrice)} />
              </div>
              <div className="mt-3">
                <Summary label="Notional" value={formatCurrency(notional)} />
              </div>
            </div>
            <button
              onClick={confirmTrade}
              className="mt-5 h-11 w-full rounded-lg bg-axo-green text-sm font-bold text-black shadow-glow transition hover:bg-axo-mint"
            >
              Confirm Simulation
            </button>
          </motion.div>
        </motion.div>
      ) : null}
    </section>
  );
}

function Summary({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p className="text-xs font-semibold uppercase text-white/40">{label}</p>
      <p className="mt-1 font-semibold text-white">{value}</p>
    </div>
  );
}

function TradeList({
  title,
  positions,
  assets
}: {
  title: string;
  positions: TradePosition[];
  assets: MarketAsset[];
}) {
  return (
    <div className="rounded-lg border border-white/10 bg-black/20 p-4">
      <p className="text-sm font-semibold text-white">{title}</p>
      <div className="mt-3 space-y-2">
        {positions.length ? (
          positions.map((position) => {
            const live = assets.find((asset) => asset.symbol === position.symbol);
            const current = live?.price ?? position.entryPrice;
            const direction = position.side === "Buy" ? 1 : -1;
            const pnl = (current - position.entryPrice) * position.size * position.leverage * direction;
            return (
              <div key={position.id} className="rounded-md border border-white/10 bg-white/[0.04] p-3 text-sm">
                <div className="flex items-center justify-between">
                  <span className="font-medium text-white">
                    {position.side} {position.symbol.replace("USDT", "")}
                  </span>
                  <span className={pnl >= 0 ? "text-axo-green" : "text-axo-red"}>{formatCurrency(pnl)}</span>
                </div>
                <p className="mt-1 text-xs text-white/45">
                  {position.size} at {formatCurrency(position.entryPrice)} / {position.leverage}x
                </p>
              </div>
            );
          })
        ) : (
          <p className="text-sm text-white/45">No open paper positions.</p>
        )}
      </div>
    </div>
  );
}

function HistoryList({ history }: { history: TradeRecord[] }) {
  return (
    <div className="rounded-lg border border-white/10 bg-black/20 p-4">
      <p className="text-sm font-semibold text-white">Trade History</p>
      <div className="mt-3 space-y-2">
        {history.length ? (
          history.map((item) => (
            <div key={item.id} className="rounded-md border border-white/10 bg-white/[0.04] p-3 text-sm">
              <div className="flex items-center justify-between">
                <span className="font-medium text-white">
                  {item.side} {item.symbol.replace("USDT", "")}
                </span>
                <span className="text-axo-mint">{formatCurrency(item.notional)}</span>
              </div>
              <p className="mt-1 text-xs text-white/45">Opened {new Date(item.openedAt).toLocaleTimeString()}</p>
            </div>
          ))
        ) : (
          <p className="text-sm text-white/45">Simulated fills will appear here.</p>
        )}
      </div>
    </div>
  );
}
