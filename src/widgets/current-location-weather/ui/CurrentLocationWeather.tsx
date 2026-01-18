"use client";

import { useLocationStore } from "@shared/model";
import { Text } from "@shared/ui";
import { WeatherDetail } from "@widgets/weather-detail";

export function CurrentLocationWeather() {
  const { location, _rehydrated } = useLocationStore();
  if (!location || !_rehydrated) return <WeatherDetail.Skeleton />;

  return (
    <>
      <Text>현재위치 : {location?.address}</Text>
      <WeatherDetail address={location?.address} />
    </>
  );
}
