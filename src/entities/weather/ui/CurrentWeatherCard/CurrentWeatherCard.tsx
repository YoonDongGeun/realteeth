"use client";

import { Card, Text } from "@shared/ui";
import { CurrentWeather, WeatherCondition } from "../../model/types";
import { localDayjs } from "@shared/lib";
import { CurrentWeatherCardSkeleton } from "./CurrentWeatherCardSkeleton";

type Props = {
  data: CurrentWeather;
};

export function CurrentWeatherCard({ data }: Props) {
  const { temperature, condition, humidity, windSpeed, precipitation, measuredAt } = data;

  const formattedTime = localDayjs(measuredAt).format("A h:mm");

  return (
    <Card className="w-full bg-white dark:bg-zinc-900 border-zinc-100 dark:border-zinc-800 transition-colors">
      <Header title="현재 날씨" subtitle={`${formattedTime} 기준`} />
      <Content 온도={temperature} 상태={condition} />
      <Footer 습도={humidity} 풍속={windSpeed} 강수량={precipitation} />
    </Card>
  );
}

CurrentWeatherCard.Skeleton = CurrentWeatherCardSkeleton;

type HeaderProps = {
  title: string;
  subtitle: string;
};
const Header = ({ title, subtitle }: HeaderProps) => {
  return (
    <div className="flex justify-between items-center">
      <Text variant="h5" weight="semibold" as="h3">
        {title}
      </Text>
      <Text variant="caption">{subtitle}</Text>
    </div>
  );
};
type ContentProps = {
  온도: number;
  상태: WeatherCondition;
};
const Content = ({ 온도, 상태 }: ContentProps) => {
  return (
    <div className="flex flex-col gap-2">
      <div className="flex items-center justify-between">
        <div className="flex flex-col">
          <Text className="tracking-tight" variant="h2" weight="bold">
            {Math.round(온도)}°
          </Text>
          <Text variant="body" weight="semibold" color="muted">
            {conditionToTextMap[상태]}
          </Text>
        </div>
      </div>
    </div>
  );
};
type FooterProps = {
  습도: number;
  풍속: number;
  강수량: number;
};

const Footer = ({ 습도, 풍속, 강수량 }: FooterProps) => {
  return (
    <div className="grid grid-cols-3 gap-4 mt-2">
      <DetailItem label="습도" value={`${습도}%`} />
      <DetailItem label="풍속" value={`${풍속}m/s`} />
      <DetailItem label="강수량" value={`${강수량}mm`} />
    </div>
  );
};

function DetailItem({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex flex-col items-center p-3 bg-zinc-50 dark:bg-zinc-800/50 rounded-2xl">
      <Text variant="body" color="muted" className="mb-1">
        {label}
      </Text>
      <Text variant="body" weight="semibold">
        {value}
      </Text>
    </div>
  );
}

const conditionToTextMap: Record<WeatherCondition, string> = {
  clear: "맑음",
  partly_cloudy: "구름 조금",
  cloudy: "흐림",
  rain: "비",
  snow: "눈",
  sleet: "진눈깨비",
  thunderstorm: "천둥번개",
  fog: "안개",
};
