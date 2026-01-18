import { CurrentWeatherCardSkeleton, DailyWeatherCardSkeleton } from "@entities/weather";
import { Card } from "@shared/ui";

export function WeatherDetailSkeleton() {
  return (
    <Card className="flex flex-col gap-4 w-full mx-auto">
      <CurrentWeatherCardSkeleton />
      <DailyWeatherCardSkeleton />
    </Card>
  );
}
