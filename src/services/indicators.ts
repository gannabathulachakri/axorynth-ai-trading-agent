import { ATR, BollingerBands, EMA, MACD, RSI, VWAP } from "technicalindicators";
import type { Candle, IndicatorReading, IndicatorSet, IndicatorStatus } from "@/src/types/trading";

const clamp = (value: number, min: number, max: number) => Math.min(Math.max(value, min), max);

const latest = <T>(values: T[]) => (values.length ? values[values.length - 1] : null);

const formatNumber = (value: number | null, digits = 2) =>
  value === null || Number.isNaN(value) ? "N/A" : value.toLocaleString(undefined, { maximumFractionDigits: digits });

function reading(
  label: string,
  value: number | null,
  status: IndicatorStatus,
  interpretation: string,
  strength: number,
  digits = 2
): IndicatorReading {
  return {
    label,
    value,
    displayValue: formatNumber(value, digits),
    status,
    interpretation,
    strength: Math.round(clamp(strength, 5, 100))
  };
}

export function calculateIndicators(candles: Candle[]): IndicatorSet {
  const close = candles.map((candle) => candle.close);
  const high = candles.map((candle) => candle.high);
  const low = candles.map((candle) => candle.low);
  const volume = candles.map((candle) => candle.volume);
  const currentPrice = latest(close) ?? 0;

  const rsiValue = latest(RSI.calculate({ values: close, period: 14 }));
  const rsiStatus: IndicatorStatus =
    rsiValue === null ? "Neutral" : rsiValue >= 58 ? "Bullish" : rsiValue <= 42 ? "Bearish" : "Neutral";
  const rsi = reading(
    "RSI",
    rsiValue,
    rsiStatus,
    rsiStatus === "Bullish"
      ? "Momentum is strong without a confirmed exhaustion signal."
      : rsiStatus === "Bearish"
        ? "Momentum is cooling and sellers have short-term control."
        : "Momentum is balanced and waiting for confirmation.",
    rsiValue === null ? 35 : Math.abs(rsiValue - 50) * 2.1
  );

  const emaFastValue = latest(EMA.calculate({ values: close, period: 20 }));
  const emaSlowValue = latest(EMA.calculate({ values: close, period: 50 }));
  const emaSpread = emaFastValue && emaSlowValue ? ((emaFastValue - emaSlowValue) / emaSlowValue) * 100 : 0;
  const emaStatus: IndicatorStatus = emaSpread > 0.08 ? "Bullish" : emaSpread < -0.08 ? "Bearish" : "Neutral";
  const ema = {
    ...reading(
      "EMA 20/50",
      emaSpread,
      emaStatus,
      emaStatus === "Bullish"
        ? "Fast EMA is above slow EMA, confirming trend support."
        : emaStatus === "Bearish"
          ? "Fast EMA is below slow EMA, confirming trend pressure."
          : "EMAs are compressed and trend conviction is limited.",
      45 + Math.abs(emaSpread) * 9,
      2
    ),
    fast: emaFastValue,
    slow: emaSlowValue,
    displayValue:
      emaFastValue && emaSlowValue
        ? `${formatNumber(emaFastValue, 1)} / ${formatNumber(emaSlowValue, 1)}`
        : "N/A"
  };

  const macdValue = latest(
    MACD.calculate({
      values: close,
      fastPeriod: 12,
      slowPeriod: 26,
      signalPeriod: 9,
      SimpleMAOscillator: false,
      SimpleMASignal: false
    })
  );
  const macdHistogram = macdValue?.histogram ?? null;
  const macdStatus: IndicatorStatus =
    macdHistogram === null ? "Neutral" : macdHistogram > 0 ? "Bullish" : macdHistogram < 0 ? "Bearish" : "Neutral";
  const macd = {
    ...reading(
      "MACD",
      macdHistogram,
      macdStatus,
      macdStatus === "Bullish"
        ? "Positive histogram shows momentum expanding upward."
        : macdStatus === "Bearish"
          ? "Negative histogram shows momentum fading."
          : "MACD is flat and needs a catalyst.",
      macdHistogram === null ? 35 : 48 + Math.min(Math.abs(macdHistogram) / Math.max(currentPrice, 1), 0.01) * 4200,
      4
    ),
    macd: macdValue?.MACD ?? null,
    signal: macdValue?.signal ?? null,
    histogram: macdHistogram
  };

  const atrValue = latest(ATR.calculate({ high, low, close, period: 14 }));
  const atrPercent = atrValue && currentPrice ? (atrValue / currentPrice) * 100 : null;
  const atrStatus: IndicatorStatus =
    atrPercent === null ? "Neutral" : atrPercent > 3.5 ? "Bearish" : atrPercent < 1.1 ? "Bullish" : "Neutral";
  const atr = {
    ...reading(
      "ATR",
      atrValue,
      atrStatus,
      atrStatus === "Bearish"
        ? "Volatility is elevated; position sizing should be reduced."
        : atrStatus === "Bullish"
          ? "Volatility is controlled and cleaner risk placement is possible."
          : "Volatility is normal for current conditions.",
      atrPercent === null ? 30 : 35 + atrPercent * 12
    ),
    percent: atrPercent
  };

  const bandsValue = latest(BollingerBands.calculate({ period: 20, stdDev: 2, values: close }));
  const bandWidth =
    bandsValue && bandsValue.middle ? ((bandsValue.upper - bandsValue.lower) / bandsValue.middle) * 100 : null;
  const bollingerStatus: IndicatorStatus =
    bandsValue === null
      ? "Neutral"
      : currentPrice > bandsValue.middle && currentPrice < bandsValue.upper
        ? "Bullish"
        : currentPrice < bandsValue.middle && currentPrice > bandsValue.lower
          ? "Bearish"
          : "Neutral";
  const bollinger = {
    ...reading(
      "Bollinger",
      bandWidth,
      bollingerStatus,
      bollingerStatus === "Bullish"
        ? "Price is holding above the middle band with room to expand."
        : bollingerStatus === "Bearish"
          ? "Price is below the middle band and trend risk is rising."
          : "Price is near an outer band or compression zone.",
      bandWidth === null ? 30 : 38 + bandWidth * 2
    ),
    upper: bandsValue?.upper ?? null,
    middle: bandsValue?.middle ?? null,
    lower: bandsValue?.lower ?? null
  };

  const vwapValue = latest(VWAP.calculate({ high, low, close, volume }));
  const vwapDelta = vwapValue && currentPrice ? ((currentPrice - vwapValue) / vwapValue) * 100 : null;
  const vwapStatus: IndicatorStatus =
    vwapDelta === null ? "Neutral" : vwapDelta > 0.12 ? "Bullish" : vwapDelta < -0.12 ? "Bearish" : "Neutral";
  const vwap = reading(
    "VWAP",
    vwapValue,
    vwapStatus,
    vwapStatus === "Bullish"
      ? "Price is trading above VWAP, showing buyer control."
      : vwapStatus === "Bearish"
        ? "Price is below VWAP, showing seller control."
        : "Price is rotating near fair value.",
    vwapDelta === null ? 30 : 42 + Math.abs(vwapDelta) * 14
  );

  return {
    rsi,
    ema,
    macd,
    atr,
    bollinger,
    vwap,
    cards: [rsi, ema, macd, atr, bollinger, vwap]
  };
}

export function scoreIndicators(indicators: IndicatorSet) {
  const readings = indicators.cards;
  const score = readings.reduce((total, item) => {
    if (item.status === "Bullish") return total + item.strength;
    if (item.status === "Bearish") return total - item.strength;
    return total;
  }, 0);

  return Math.round(clamp(50 + score / Math.max(readings.length * 2, 1), 0, 100));
}
