"use client";

import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis
} from "recharts";

type MiniChartProps = {
  data: Array<{ time: string; value: number }>;
  color?: string;
  height?: number;
  showAxis?: boolean;
};

export function MiniChart({
  data,
  color = "#39ff88",
  height = 118,
  showAxis = false
}: MiniChartProps) {
  const gradientId = `chart-${color.replace("#", "")}-${height}`;

  return (
    <div style={{ height }} className="w-full min-w-0">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={data} margin={{ top: 8, right: 0, bottom: 0, left: 0 }}>
          <defs>
            <linearGradient id={gradientId} x1="0" x2="0" y1="0" y2="1">
              <stop offset="0%" stopColor={color} stopOpacity={0.46} />
              <stop offset="100%" stopColor={color} stopOpacity={0.02} />
            </linearGradient>
          </defs>
          <XAxis
            dataKey="time"
            hide={!showAxis}
            axisLine={false}
            tickLine={false}
            tick={{ fill: "#91a99b", fontSize: 11 }}
          />
          <YAxis hide domain={["dataMin", "dataMax"]} />
          <CartesianGrid
            stroke="rgba(143, 255, 208, 0.08)"
            strokeDasharray="3 8"
            vertical={false}
          />
          <Tooltip
            cursor={{ stroke: color, strokeOpacity: 0.24 }}
            contentStyle={{
              background: "rgba(3, 10, 7, 0.92)",
              border: "1px solid rgba(255,255,255,0.12)",
              borderRadius: "8px",
              color: "#fff"
            }}
            labelStyle={{ color: "#8fffd0" }}
          />
          <Area
            type="monotone"
            dataKey="value"
            stroke={color}
            strokeWidth={2.4}
            fill={`url(#${gradientId})`}
            dot={false}
            activeDot={{ r: 4, strokeWidth: 0, fill: color }}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}
