import { AddFavoriteButton } from "@features/favorite-location";
import { ParcelAddress } from "@shared/model";
import { Card, Text } from "@shared/ui";
import { PropsWithChildren, Suspense } from "react";
import { StreamingCurrentWeather, StreamingDailyWeather } from "./StreamingWeather";
import { CurrentWeatherCardSkeleton, DailyWeatherCardSkeleton, weatherQueries } from "@entities/weather";
import { WeatherDetailSkeleton } from "./WeatherDetailSkeleton";
import { PrefetchBoundary } from "@shared/lib";

type Props = {
  address: ParcelAddress;
};

export function WeatherDetail({ address }: Props) {
  return (
    <Card className="flex flex-col gap-4 w-full mx-auto transition-colors dark:bg-black">
      <Header title={address}>
        <AddFavoriteButton address={address} />
      </Header>

      <Suspense fallback={<CurrentWeatherCardSkeleton />}>
        <PrefetchBoundary prefetchOption={weatherQueries.current(address)}>
          <StreamingCurrentWeather address={address} />
        </PrefetchBoundary>
      </Suspense>

      <Suspense fallback={<DailyWeatherCardSkeleton />}>
        <PrefetchBoundary prefetchOption={weatherQueries.daily(address)}>
          <StreamingDailyWeather address={address} />
        </PrefetchBoundary>
      </Suspense>
    </Card>
  );
}

WeatherDetail.Skeleton = WeatherDetailSkeleton;

type HeaderProps = PropsWithChildren<{ title: string }>;

const Header = ({ children, title }: HeaderProps) => {
  return (
    <div className="flex justify-between">
      <Text variant="h5" as="h2">
        {title}
      </Text>
      {children}
    </div>
  );
};
