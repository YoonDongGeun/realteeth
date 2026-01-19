"use client";

import { ParcelAddress, useLocationStore } from "@shared/model";
import { useCurrentWeather, useDailyWeather } from "@entities/weather";

import { Suspense } from "react";
import { Card, Text } from "@shared/ui";
import Link from "next/link";

export function CurrentLocationSummaryCard() {
  const { location, isFetchTried, isGpsRefreshing, _rehydrated } = useLocationStore();

  const notReady = !_rehydrated || !isFetchTried || isGpsRefreshing;
  const showAddress = notReady ? "위치 찾는중..." : location?.address || "서울특별시";
  return (
    <Link href={"/"} role="button" tabIndex={0} aria-label={`현재 위치: ${showAddress}`}>
      <Card className="p-4 bg-blue-500 dark:bg-blue-600 text-white flex hover:bg-blue-600 dark:hover:bg-blue-700 justify-between items-center cursor-pointer transition-all">
        <MyLocationDisplay display={showAddress} />
        <div>
          <Suspense fallback={<TempSkeleton />}>{!notReady && <CurrentLocationTemp address={showAddress} />}</Suspense>
          <Suspense fallback={<MinMaxTempSkeleton />}>
            {!notReady && <MaxAndMinTemperatures address={showAddress} />}
          </Suspense>
        </div>
      </Card>
    </Link>
  );
}

function MyLocationDisplay({ display }: { display?: ParcelAddress }) {
  return (
    <div className="flex flex-col gap-1">
      <Text variant="body" color="inherit">
        나의 위치
      </Text>
      <Text variant="body" color="inherit" className="truncate max-w-40">
        {display}
      </Text>
    </div>
  );
}

function CurrentLocationTemp({ address }: { address: ParcelAddress }) {
  const { data: weather } = useCurrentWeather(address);
  return (
    <div className="flex flex-col items-end">
      <span className="text-2xl font-bold">{Math.round(weather.temperature)}°</span>
      <span className="text-xs text-blue-100">{/* Condition text if needed */}</span>
    </div>
  );
}

const MaxAndMinTemperatures = ({ address }: { address: ParcelAddress }) => {
  const dailyWeather = useDailyWeather(address);
  const maxTemp = dailyWeather.data.maxTemperature;
  const minTemp = dailyWeather.data.minTemperature;
  return (
    <div className="flex items-center gap-1">
      <Text variant="caption" color="inherit">
        최고 {maxTemp != null ? Math.round(maxTemp) : "-"}°
      </Text>
      <Text variant="caption" color="inherit">
        최저 {minTemp != null ? Math.round(minTemp) : "-"}°
      </Text>
    </div>
  );
};

const TempSkeleton = () => <div className="h-8 w-12 bg-white/20 rounded animate-pulse" aria-hidden="true" />;
const MinMaxTempSkeleton = () => <div className="h-4 w-16 bg-white/20 rounded animate-pulse" aria-hidden="true" />;
