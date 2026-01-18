import { AddFavoriteButton } from "@features/favorite-location";
import { ParcelAddress } from "@shared/model";
import { Card, Text } from "@shared/ui";
import { PropsWithChildren, Suspense } from "react";
import { StreamingCurrentWeather, StreamingDailyWeather } from "./StreamingWeather";
import { CurrentWeatherCardSkeleton, DailyWeatherCardSkeleton } from "@entities/weather";
import { WeatherDetailSkeleton } from "./WeatherDetailSkeleton";

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
        <StreamingCurrentWeather address={address} />
      </Suspense>

      <Suspense fallback={<DailyWeatherCardSkeleton />}>
        <StreamingDailyWeather address={address} />
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
