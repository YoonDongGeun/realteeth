"use client";

import { localDayjs } from "@shared/lib";
import { HourlyWeather } from "../../model/types";
import { useMemo } from "react";
import { Area, AreaChart, ResponsiveContainer, Tooltip, XAxis, LabelList } from "recharts";

type Props = {
  data: HourlyWeather[];
};

export function HourlyWeatherStatistics({ data }: Props) {
  const chartData = useMemo(() => {
    return data.map((item) => ({
      time: localDayjs(item.time).format("H시"),
      temp: Math.round(item.temperature),
    }));
  }, [data]);

  if (data.length === 0) return null;

  return (
    <ResponsiveContainer
      initialDimension={{
        width: 300,
        height: 200,
      }}
      width={"100%"}
      height={"100%"}
    >
      <AreaChart data={chartData} margin={{ top: 20, right: 10, left: 10, bottom: 0 }}>
        <defs>
          <linearGradient id="tempGradient" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3} />
            <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
          </linearGradient>
        </defs>
        <XAxis dataKey="time" tick={{ fontSize: 12, fill: "#71717a" }} axisLine={false} tickLine={false} interval={2} />
        <Tooltip
          content={({ active, payload, label }) => {
            if (active && payload && payload.length) {
              return (
                <div className="bg-white/90 dark:bg-black/90 backdrop-blur-sm p-2 rounded-lg shadow-sm border border-zinc-100 dark:border-zinc-800">
                  <p className="text-xs text-zinc-500 mb-1">{label}</p>
                  <p className="text-sm font-bold text-zinc-900 dark:text-zinc-100">{payload[0].value}°</p>
                </div>
              );
            }
            return null;
          }}
        />
        <Area
          type="monotone"
          dataKey="temp"
          stroke="#3b82f6"
          strokeWidth={2}
          fill="url(#tempGradient)"
          animationDuration={1000}
        >
          <LabelList
            dataKey="temp"
            position="top"
            formatter={(value) => `${value}°`}
            style={{
              fontSize: "12px",
              fill: "#3b82f6",
              fontWeight: 600,
            }}
          />
        </Area>
      </AreaChart>
    </ResponsiveContainer>
  );
}
