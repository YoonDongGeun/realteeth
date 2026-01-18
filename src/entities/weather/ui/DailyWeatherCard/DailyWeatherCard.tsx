"use client";

import { DailyWeather } from "../../model/types";
import { localDayjs } from "@shared/lib";
import { Card, Text } from "@shared/ui";
import dynamic from "next/dynamic";
import { ReactNode, Suspense, useMemo } from "react";
import { DailyWeatherCardSkeleton } from "./DailyWeatherCardSkeleton";

const HourlyWeatherStatistics = dynamic(
  () => import("./HourlyWeatherStatistics").then((mod) => mod.HourlyWeatherStatistics),
  { ssr: false }
);

type Props = {
  data: DailyWeather;
};

export function DailyWeatherCard({ data }: Props) {
  const { minTemperature, maxTemperature, hourly, date, precipitationProbability: 강수확률 } = data;

  const formattedDate = useMemo(() => localDayjs(date).format("M월 D일 (ddd)"), [date]);

  return (
    <Card className="w-full bg-white dark:bg-zinc-900 border-zinc-100 dark:border-zinc-800 transition-colors">
      <Header
        title="오늘의 날씨"
        subTitle={formattedDate}
        headerRight={강수확률 > 0 && <HeaderBadge title={`강수 확률 ${강수확률}%`} />}
      />
      <Content maxTemperature={maxTemperature} minTemperature={minTemperature} />
      <HourlyTemperatureChart data={hourly} />
    </Card>
  );
}

DailyWeatherCard.Skeleton = DailyWeatherCardSkeleton;

type HeaderProps = {
  title: string;
  subTitle: string;
  headerRight?: ReactNode;
};
const Header = ({ title, subTitle, headerRight }: HeaderProps) => {
  return (
    <div className="flex justify-between items-start">
      <div>
        <Text as="h2" weight="semibold">
          {title}
        </Text>
        <Text variant="small" color="muted" className="mt-1">
          {subTitle}
        </Text>
      </div>
      {headerRight}
    </div>
  );
};

type HeaderBadgeProps = { title: string };
const HeaderBadge = ({ title }: HeaderBadgeProps) => (
  <div className="px-3 py-1 rounded-full bg-blue-50 dark:bg-blue-900/30">
    <Text variant="caption" color="primary" weight="medium">
      {title}
    </Text>
  </div>
);

type ContetProps = {
  maxTemperature: number;
  minTemperature: number;
};
const Content = ({ maxTemperature, minTemperature }: ContetProps) => {
  return (
    <div className="flex items-center gap-4">
      <div className="flex items-baseline gap-2">
        <Text variant="h2" weight="bold">
          {Math.round(maxTemperature)}°
        </Text>
        <Text variant="h3" color="muted">
          /
        </Text>
        <Text variant="h2" weight="bold" color="muted">
          {Math.round(minTemperature)}°
        </Text>
      </div>
    </div>
  );
};
type HourlyTemperatureChartProps = {
  data: DailyWeather["hourly"];
};
const HourlyTemperatureChart = ({ data }: HourlyTemperatureChartProps) => {
  return (
    <div className="w-full h-50 select-none relative">
      <Suspense fallback={<HourlyWeatherStatisticsSkeleton />}>
        <HourlyWeatherStatistics data={data} />
      </Suspense>
    </div>
  );
};

function HourlyWeatherStatisticsSkeleton() {
  return <div className="w-full h-50 bg-zinc-100 dark:bg-zinc-800/50 rounded-2xl animate-pulse" />;
}
