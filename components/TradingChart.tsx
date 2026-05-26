"use client";

import { useEffect, useMemo, useRef } from "react";
import { motion } from "framer-motion";
import {
  ColorType,
  CrosshairMode,
  createChart,
  type IChartApi,
  type UTCTimestamp
} from "lightweight-charts";
import { CandlestickChart } from "lucide-react";
import type { Candle, MarketAsset } from "@/src/types/trading";

type TradingChartProps = {
  asset: MarketAsset | null;
};

function calculateEma(candles: Candle[], period: number) {
  const multiplier = 2 / (period + 1);
  let previous = candles[0]?.close ?? 0;

  return candles.map((candle, index) => {
    previous = index === 0 ? candle.close : (candle.close - previous) * multiplier + previous;
    return {
      time: candle.time as UTCTimestamp,
      value: previous
    };
  });
}

export function TradingChart({ asset }: TradingChartProps) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const chartRef = useRef<IChartApi | null>(null);

  const chartData = useMemo(() => {
    if (!asset) return null;
    return {
      candles: asset.candles.map((candle) => ({
        time: candle.time as UTCTimestamp,
        open: candle.open,
        high: candle.high,
        low: candle.low,
        close: candle.close
      })),
      volume: asset.candles.map((candle) => ({
        time: candle.time as UTCTimestamp,
        value: candle.volume,
        color: candle.close >= candle.open ? "rgba(57, 255, 136, 0.34)" : "rgba(255, 90, 122, 0.34)"
      })),
      ema20: calculateEma(asset.candles, 20),
      ema50: calculateEma(asset.candles, 50)
    };
  }, [asset]);

  useEffect(() => {
    if (!containerRef.current || !chartData) return;

    const chart = createChart(containerRef.current, {
      autoSize: true,
      layout: {
        background: { type: ColorType.Solid, color: "transparent" },
        textColor: "rgba(255,255,255,0.62)"
      },
      grid: {
        vertLines: { color: "rgba(143,255,208,0.06)" },
        horzLines: { color: "rgba(143,255,208,0.06)" }
      },
      crosshair: {
        mode: CrosshairMode.Normal
      },
      rightPriceScale: {
        borderColor: "rgba(255,255,255,0.1)"
      },
      timeScale: {
        borderColor: "rgba(255,255,255,0.1)",
        timeVisible: true,
        secondsVisible: false
      }
    });

    const candleSeries = chart.addCandlestickSeries({
      upColor: "#39ff88",
      downColor: "#ff5a7a",
      borderUpColor: "#39ff88",
      borderDownColor: "#ff5a7a",
      wickUpColor: "#8fffd0",
      wickDownColor: "#ff5a7a"
    });

    const ema20 = chart.addLineSeries({
      color: "#8fffd0",
      lineWidth: 2,
      priceLineVisible: false
    });

    const ema50 = chart.addLineSeries({
      color: "#f8d267",
      lineWidth: 2,
      priceLineVisible: false
    });

    const volume = chart.addHistogramSeries({
      priceFormat: { type: "volume" },
      priceScaleId: ""
    });
    volume.priceScale().applyOptions({ scaleMargins: { top: 0.78, bottom: 0 } });

    candleSeries.setData(chartData.candles);
    ema20.setData(chartData.ema20);
    ema50.setData(chartData.ema50);
    volume.setData(chartData.volume);
    chart.timeScale().fitContent();
    chartRef.current = chart;

    return () => {
      chart.remove();
      chartRef.current = null;
    };
  }, [chartData]);

  return (
    <motion.section
      initial={{ opacity: 0, y: 18 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.45 }}
      className="glass-card neon-border min-w-0 overflow-hidden rounded-lg p-5 sm:p-6"
    >
      <div className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <div className="flex items-center gap-2 text-sm font-semibold uppercase text-axo-green">
            <CandlestickChart className="size-4" />
            Professional Charts
          </div>
          <h2 className="mt-2 text-2xl font-semibold text-white">
            {asset ? `${asset.baseAsset}/USDT live structure` : "Loading market structure"}
          </h2>
        </div>
        <div className="flex flex-wrap gap-2 text-xs text-white/55">
          <span className="rounded-full border border-axo-mint/25 bg-axo-mint/10 px-3 py-1.5 text-axo-mint">
            EMA 20
          </span>
          <span className="rounded-full border border-axo-amber/25 bg-axo-amber/10 px-3 py-1.5 text-axo-amber">
            EMA 50
          </span>
          <span className="rounded-full border border-white/10 bg-white/[0.05] px-3 py-1.5">Volume</span>
        </div>
      </div>
      <div className="relative min-h-[360px] overflow-hidden rounded-lg border border-white/10 bg-black/30">
        {asset ? (
          <div ref={containerRef} className="h-[360px] w-full" />
        ) : (
          <div className="h-[360px] w-full animate-pulse bg-white/10" />
        )}
      </div>
    </motion.section>
  );
}
