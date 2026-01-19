import { z } from "zod";
import { WeatherConditionSchema, CurrentWeatherSchema, DailyWeatherSchema, HourlyWeatherSchema } from "./schemas";

export type WeatherCondition = z.input<typeof WeatherConditionSchema>;

export type CurrentWeather = z.input<typeof CurrentWeatherSchema>;

export type DailyWeather = z.input<typeof DailyWeatherSchema>;

export type HourlyWeather = z.input<typeof HourlyWeatherSchema>;

export interface Weather {
  current: CurrentWeather;
  today: DailyWeather;
  hourly: HourlyWeather[];
}
