"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import {
  BrainCircuit,
  CheckCircle2,
  Crosshair,
  DatabaseZap,
  Gauge,
  Shield,
  Target,
  XCircle,
  Zap
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import type { AiTradeSignal } from "@/src/types/trading";

type AISignalCardProps = {
  signal: AiTradeSignal | null;
  loading?: boolean;
};

const formatCurrency = (value: number) =>
  value.toLocaleString(undefined, {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: value > 1000 ? 0 : 2
  });

export function AISignalCard({ signal, loading = false }: AISignalCardProps) {
  const [typedReasoning, setTypedReasoning] = useState("");

  useEffect(() => {
    if (!signal?.reasoning) {
      setTypedReasoning("");
      return;
    }

    setTypedReasoning("");
    let index = 0;
    const interval = window.setInterval(() => {
      index += 2;
      setTypedReasoning(signal.reasoning.slice(0, index));
      if (index >= signal.reasoning.length) window.clearInterval(interval);
    }, 18);

    return () => window.clearInterval(interval);
  }, [signal?.reasoning]);

  if (loading || !signal) {
    return (
      <section id="signal" className="glass-card neon-border overflow-hidden rounded-lg p-6">
        <div className="mb-6 h-px w-full animate-pulse bg-axo-green/40" />
        <div className="h-8 w-64 animate-pulse rounded bg-white/10" />
        <div className="mt-6 h-24 animate-pulse rounded-lg bg-white/10" />
        <div className="mt-4 grid gap-3 sm:grid-cols-3">
          <div className="h-24 animate-pulse rounded-lg bg-white/10" />
          <div className="h-24 animate-pulse rounded-lg bg-white/10" />
          <div className="h-24 animate-pulse rounded-lg bg-white/10" />
        </div>
      </section>
    );
  }

  const decisionTone =
    signal.decision === "BUY"
      ? "border-axo-green/30 bg-axo-green/10 text-axo-green"
      : signal.decision === "SELL"
        ? "border-axo-red/30 bg-axo-red/10 text-axo-red"
        : "border-axo-amber/30 bg-axo-amber/10 text-axo-amber";
  const riskTone =
    signal.riskLevel === "LOW"
      ? "text-axo-green"
      : signal.riskLevel === "MEDIUM"
        ? "text-axo-amber"
        : "text-axo-red";
  const dataSourceTone =
    signal.dataSource === "fallback"
      ? "border-axo-amber/30 bg-axo-amber/10 text-axo-amber"
      : "border-axo-green/30 bg-axo-green/10 text-axo-green";
  const sourceLabel = signal.dataSource === "fallback" ? "DEMO DATA ACTIVE" : signal.dataSourceLabel;

  return (
    <motion.section
      id="signal"
      initial={{ opacity: 0, y: 18 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.45 }}
      className="glass-card neon-border relative h-full min-w-0 overflow-hidden rounded-lg p-6 transition duration-500 hover:border-axo-green/40"
    >
      <div className="absolute inset-x-6 top-0 h-px bg-gradient-to-r from-transparent via-axo-green/80 to-transparent" />
      <div className="relative">
        <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <div className="flex items-center gap-3">
              <span className="flex size-11 animate-pulse-glow items-center justify-center rounded-lg border border-axo-green/30 bg-axo-green/10 text-axo-green">
                <BrainCircuit className="size-5" />
              </span>
              <div>
                <p className="text-sm font-semibold uppercase text-axo-green">
                  AI Signal Engine
                </p>
                <h2 className="mt-1 text-2xl font-semibold text-white">
                  Autonomous signal readout
                </h2>
              </div>
            </div>
          </div>
          <div className="flex flex-col gap-2 sm:items-end">
            <div className={`inline-flex items-center gap-2 rounded-full border px-3 py-1.5 text-xs font-semibold ${dataSourceTone}`}>
              <DatabaseZap className="size-3.5" />
              {sourceLabel}
            </div>
            <div className={`rounded-lg border px-5 py-3 text-left shadow-[0_0_34px_rgba(57,255,136,0.16)] sm:text-right ${decisionTone}`}>
              <p className="text-xs font-semibold uppercase text-axo-mint">Decision</p>
              <p className="mt-1 text-4xl font-black">{signal.decision}</p>
            </div>
          </div>
        </div>

        <div className="mb-5 grid gap-3 sm:grid-cols-2">
          <SignalMetric icon={Gauge} label="Market Sentiment" value={signal.marketSentiment} />
          <SignalMetric
            icon={Shield}
            label="Risk Level"
            value={`${signal.riskLevel} (${signal.riskScore}/100)`}
            tone={signal.riskLevel === "HIGH" ? "red" : signal.riskLevel === "MEDIUM" ? "amber" : "green"}
          />
        </div>

        <div className="mb-6">
          <div className="mb-2 flex items-center justify-between text-sm">
            <span className="text-white/60">Confidence</span>
            <span className="font-semibold text-axo-green">{signal.confidence}%</span>
          </div>
          <div className="h-3 overflow-hidden rounded-full bg-white/10 shadow-inner">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${signal.confidence}%` }}
              transition={{ duration: 0.75, ease: "easeOut" }}
              className="h-full rounded-full bg-gradient-to-r from-axo-green to-axo-mint shadow-glow"
            />
          </div>
        </div>

        <div className="grid gap-3 sm:grid-cols-3">
          <SignalMetric icon={Crosshair} label="Entry" value={formatCurrency(signal.entryPrice)} />
          <SignalMetric icon={Shield} label="Stop Loss" value={formatCurrency(signal.stopLoss)} tone="red" />
          <SignalMetric icon={Target} label="Take Profit" value={formatCurrency(signal.takeProfit)} />
        </div>

        <div className="mt-5 rounded-lg border border-white/10 bg-black/25 p-4 shadow-[inset_0_1px_0_rgba(255,255,255,0.05)]">
          <div className="mb-3 flex items-center justify-between gap-3">
            <div className="flex items-center gap-2 text-sm font-medium text-white">
              <BrainCircuit className="size-4 text-axo-green" />
              Why AI chose this trade
            </div>
            <span className={`text-xs font-semibold ${riskTone}`}>{signal.riskLevel} risk</span>
          </div>
          <div className="grid gap-2 sm:grid-cols-2">
            {signal.why.map((reason) => (
              <div key={reason.label} className="rounded-md border border-white/10 bg-white/[0.035] p-3">
                <div className="flex items-center gap-2 text-sm font-medium text-white">
                  {reason.passed ? (
                    <CheckCircle2 className="size-4 text-axo-green" />
                  ) : (
                    <XCircle className="size-4 text-axo-amber" />
                  )}
                  {reason.label}
                </div>
                <p className="mt-1 text-xs leading-5 text-white/50">{reason.detail}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-5 rounded-lg border border-white/10 bg-black/30 p-4 shadow-[inset_0_1px_0_rgba(255,255,255,0.06)]">
          <div className="mb-2 flex items-center gap-2 text-sm font-medium text-axo-mint">
            <Zap className="size-4" />
            AI Reasoning
          </div>
          <p className="min-h-[3rem] text-sm leading-6 text-white/70">
            {typedReasoning}
            <span className="ml-1 inline-block h-4 w-1 animate-pulse bg-axo-green align-middle" />
          </p>
        </div>
      </div>
    </motion.section>
  );
}

function SignalMetric({
  icon: Icon,
  label,
  value,
  tone = "green"
}: {
  icon: LucideIcon;
  label: string;
  value: string;
  tone?: "green" | "red" | "amber";
}) {
  const iconColor = tone === "red" ? "text-axo-red" : tone === "amber" ? "text-axo-amber" : "text-axo-green";

  return (
    <div className="rounded-lg border border-white/10 bg-white/[0.045] p-4">
      <div className="flex items-center gap-2 text-xs font-semibold uppercase text-white/45">
        <Icon className={`size-4 ${iconColor}`} />
        {label}
      </div>
      <p className="mt-2 text-lg font-semibold text-white">{value}</p>
    </div>
  );
}
