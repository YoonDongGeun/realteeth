"use client";

import { EditAliasInput } from "@features/favorite-location/edit-alias";
import { useCurrentWeather, useDailyWeather } from "@entities/weather";
import { PropsWithChildren, Suspense } from "react";
import { RemoveFavoriteButton } from "@features/favorite-location";
import { ParcelAddress } from "@shared/model";
import Link from "next/link";
import { Text } from "@shared/ui";

interface Props {
  address: ParcelAddress;
  alias: string;
}

export function FavoriteAddressWeatherCard({ address, alias }: Props) {
  return (
    <Link
      href={`/search?q=${encodeURIComponent(address)}`}
      prefetch={false}
      className="bg-white dark:bg-zinc-900 rounded-2xl p-4 shadow-sm border border-zinc-100 dark:border-zinc-800 flex justify-between items-center transition-all hover:shadow-md cursor-pointer"
    >
      <LocationInfo address={address} alias={alias} />

      <WeatherInfoContainer>
        <Suspense fallback={<CurrentTemperatureSkeleton />}>
          <CurrentTemperature address={address} />
        </Suspense>

        <Suspense fallback={<MaxAndMinTemperaturesSkeleton />}>
          <MaxAndMinTemperatures address={address} />
        </Suspense>
      </WeatherInfoContainer>

      <RemoveFavoriteButton address={address} />
    </Link>
  );
}

const LocationInfo = ({ address, alias }: Props) => (
  <div className="flex flex-1 flex-col gap-1 ">
    <EventGuard>
      <EditAliasInput address={address} currentAlias={alias} />
    </EventGuard>
    <Text variant="caption" color="muted" className="truncate max-w-37.5">
      {address}
    </Text>
  </div>
);

const WeatherInfoContainer = ({ children }: PropsWithChildren) => (
  <div className="flex flex-col items-end pr-1">{children}</div>
);

const CurrentTemperature = ({ address }: { address: ParcelAddress }) => {
  const currentWeather = useCurrentWeather(address);
  const currentTemp = currentWeather.data.temperature;
  return (
    <div className="flex items-center gap-2">
      <Text variant="h4" weight="bold">
        {currentTemp ? Math.round(currentTemp) : "-"}°
      </Text>
    </div>
  );
};

const MaxAndMinTemperatures = ({ address }: { address: ParcelAddress }) => {
  const dailyWeather = useDailyWeather(address);
  const maxTemp = dailyWeather.data.maxTemperature;
  const minTemp = dailyWeather.data.minTemperature;
  return (
    <div className="flex items-center gap-1">
      <Text variant="caption" color="muted">
        최고 {maxTemp ? Math.round(maxTemp) : "-"}°
      </Text>
      <Text variant="caption" color="muted">
        최저 {minTemp ? Math.round(minTemp) : "-"}°
      </Text>
    </div>
  );
};

const EventGuard = ({ children }: PropsWithChildren) => (
  <div
    onClick={(e) => {
      e.stopPropagation();
      e.preventDefault();
    }}
    onKeyDown={(e) => {
      if (e.key === "Enter" || e.key === " ") {
        e.stopPropagation();
        e.preventDefault();
      }
    }}
  >
    {children}
  </div>
);

const CurrentTemperatureSkeleton = () => (
  <div className="h-8 w-16 bg-zinc-100 dark:bg-zinc-800 rounded animate-pulse" aria-hidden="true" />
);

const MaxAndMinTemperaturesSkeleton = () => (
  <div className="h-4 w-24 bg-zinc-100 dark:bg-zinc-800 rounded animate-pulse" aria-hidden="true" />
);
