import { CurrentWeatherCardSkeleton, DailyWeatherCardSkeleton } from "@entities/weather";
import { Card } from "@shared/ui";

export function WeatherDetailSkeleton() {
  return (
    <Card className="flex flex-col gap-4 w-full mx-auto">
      <LocationNameSkeleton />
      <CurrentWeatherCardSkeleton />
      <DailyWeatherCardSkeleton />
    </Card>
  );
}
const LocationNameSkeleton = () => (
  <div className="h-10 w-24 bg-zinc-200 dark:bg-zinc-700 rounded-lg animate-pulse" aria-hidden="true" />
);
