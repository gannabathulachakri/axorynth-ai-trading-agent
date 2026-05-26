import {
  Activity,
  BadgeDollarSign,
  BarChart3,
  CandlestickChart,
  Gauge,
  RadioTower,
  ShieldCheck,
  Sparkles,
  TrendingDown,
  TrendingUp,
  Zap
} from "lucide-react";
import type { LucideIcon } from "lucide-react";

export type Market = {
  symbol: "BTC" | "ETH" | "SOL" | "AVAX";
  name: string;
  price: string;
  change: string;
  changeType: "up" | "down";
  volume: string;
  confidence: number;
  accent: string;
  data: Array<{ time: string; value: number }>;
};

export type Indicator = {
  label: string;
  value: string;
  signal: "Bullish" | "Bearish" | "Neutral";
  strength: number;
  icon: LucideIcon;
};

export type Insight = {
  title: string;
  body: string;
  time: string;
  tone: "buy" | "sell" | "wait";
  icon: LucideIcon;
};

export const markets: Market[] = [
  {
    symbol: "BTC",
    name: "Bitcoin",
    price: "$68,420.18",
    change: "+2.84%",
    changeType: "up",
    volume: "$41.2B",
    confidence: 87,
    accent: "#39ff88",
    data: [
      { time: "09:00", value: 67220 },
      { time: "10:00", value: 67590 },
      { time: "11:00", value: 68140 },
      { time: "12:00", value: 67910 },
      { time: "13:00", value: 68420 },
      { time: "14:00", value: 68840 },
      { time: "15:00", value: 68420 }
    ]
  },
  {
    symbol: "ETH",
    name: "Ethereum",
    price: "$3,746.92",
    change: "+1.37%",
    changeType: "up",
    volume: "$18.7B",
    confidence: 74,
    accent: "#8fffd0",
    data: [
      { time: "09:00", value: 3650 },
      { time: "10:00", value: 3692 },
      { time: "11:00", value: 3710 },
      { time: "12:00", value: 3701 },
      { time: "13:00", value: 3734 },
      { time: "14:00", value: 3762 },
      { time: "15:00", value: 3747 }
    ]
  },
  {
    symbol: "SOL",
    name: "Solana",
    price: "$158.33",
    change: "-0.92%",
    changeType: "down",
    volume: "$5.8B",
    confidence: 61,
    accent: "#f8d267",
    data: [
      { time: "09:00", value: 163 },
      { time: "10:00", value: 161 },
      { time: "11:00", value: 159 },
      { time: "12:00", value: 160 },
      { time: "13:00", value: 157 },
      { time: "14:00", value: 158 },
      { time: "15:00", value: 158.3 }
    ]
  },
  {
    symbol: "AVAX",
    name: "Avalanche",
    price: "$37.58",
    change: "+3.18%",
    changeType: "up",
    volume: "$1.1B",
    confidence: 79,
    accent: "#39ff88",
    data: [
      { time: "09:00", value: 35.8 },
      { time: "10:00", value: 36.1 },
      { time: "11:00", value: 36.9 },
      { time: "12:00", value: 36.7 },
      { time: "13:00", value: 37.1 },
      { time: "14:00", value: 37.4 },
      { time: "15:00", value: 37.58 }
    ]
  }
];

export const aiSignal = {
  decision: "BUY",
  confidence: 88,
  entryPrice: "$68,120.00",
  stopLoss: "$66,780.00",
  takeProfit: "$71,900.00",
  reasoning:
    "Momentum remains above VWAP while funding cools and liquidity clusters are building near the prior daily high. Axorynth waits for a shallow retest before scaling into the simulated long."
};

export const indicators: Indicator[] = [
  {
    label: "RSI",
    value: "61.8",
    signal: "Bullish",
    strength: 72,
    icon: Gauge
  },
  {
    label: "MACD",
    value: "+148",
    signal: "Bullish",
    strength: 81,
    icon: Activity
  },
  {
    label: "EMA Trend",
    value: "20 > 50",
    signal: "Bullish",
    strength: 86,
    icon: TrendingUp
  },
  {
    label: "Volatility",
    value: "2.4%",
    signal: "Neutral",
    strength: 49,
    icon: BarChart3
  },
  {
    label: "Order Flow",
    value: "+$92M",
    signal: "Bullish",
    strength: 77,
    icon: CandlestickChart
  },
  {
    label: "Drawdown Guard",
    value: "Armed",
    signal: "Neutral",
    strength: 55,
    icon: ShieldCheck
  }
];

export const insights: Insight[] = [
  {
    title: "Liquidity sweep detected",
    body: "BTC reclaimed the intraday value area after sweeping stops below the London low.",
    time: "2m ago",
    tone: "buy",
    icon: RadioTower
  },
  {
    title: "Risk model cooled leverage",
    body: "Portfolio beta rose above the target band, so suggested leverage was reduced to 3x.",
    time: "8m ago",
    tone: "wait",
    icon: ShieldCheck
  },
  {
    title: "SOL momentum fading",
    body: "Short-term EMA compression and lower bid depth lowered the signal score.",
    time: "14m ago",
    tone: "sell",
    icon: TrendingDown
  },
  {
    title: "Narrative strength rising",
    body: "Layer-one basket sentiment improved after a positive funding reset.",
    time: "19m ago",
    tone: "buy",
    icon: Sparkles
  }
];

export const riskStats = [
  { label: "Portfolio Risk", value: "Low", detail: "14.2% max allocation", icon: ShieldCheck },
  { label: "Daily Loss Limit", value: "$1,250", detail: "72% buffer remaining", icon: BadgeDollarSign },
  { label: "Exposure", value: "42%", detail: "Across 4 mock assets", icon: Zap }
];

export const equityCurve = [
  { time: "Mon", value: 10000 },
  { time: "Tue", value: 10180 },
  { time: "Wed", value: 10090 },
  { time: "Thu", value: 10310 },
  { time: "Fri", value: 10640 },
  { time: "Sat", value: 10580 },
  { time: "Sun", value: 10890 }
];
