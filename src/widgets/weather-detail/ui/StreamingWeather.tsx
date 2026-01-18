"use client";
import { CurrentWeatherCard, DailyWeatherCard, useCurrentWeather, useDailyWeather } from "@entities/weather";

type Props = { address: string };
export function StreamingCurrentWeather({ address }: Props) {
  const { data } = useCurrentWeather(address);
  return (
    <section>
      <CurrentWeatherCard data={data} />
    </section>
  );
}

export function StreamingDailyWeather({ address }: Props) {
  const { data } = useDailyWeather(address);
  return (
    <section>
      <DailyWeatherCard data={data} />
    </section>
  );
}
