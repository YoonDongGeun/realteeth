"use client";

import { ParcelAddress, useLocationStore } from "@shared/model";
import { useCurrentWeather } from "@entities/weather";
import { useRouter } from "next/navigation";
import { Suspense, useCallback } from "react";
import { Card } from "@shared/ui";

export function CurrentLocationSummaryCard() {
  const { location } = useLocationStore();
  const router = useRouter();
  const handleRoute = useCallback(() => {
    router.push("/");
  }, [router]);

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        handleRoute();
      }
    },
    [handleRoute]
  );

  return (
    <article
      role="button"
      tabIndex={0}
      onClick={handleRoute}
      onKeyDown={handleKeyDown}
      aria-label={`현재 위치: ${location?.address || "위치 확인 중"}`}
    >
      <Card className="p-4 bg-blue-500 dark:bg-blue-600 text-white flex hover:bg-blue-600 dark:hover:bg-blue-700 justify-between items-center cursor-pointer transition-all">
        <Header address={location?.address} />
        <Suspense fallback={<div className="h-8 w-12 bg-white/20 rounded animate-pulse" aria-hidden="true" />}>
          <CurrentLocationTemp address={location?.address || "서울특별시"} />
        </Suspense>
      </Card>
    </article>
  );
}

function Header({ address }: { address?: ParcelAddress }) {
  return (
    <div className="flex flex-col gap-1">
      <span className="font-semibold text-sm">{address ? "나의 위치" : "위치 확인 중"}</span>
      <span className="text-xs text-blue-100 truncate max-w-30">{address ? address : "정확한 위치 찾는 중..."}</span>
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
