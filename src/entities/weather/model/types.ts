import { z } from "zod";
import { WeatherConditionSchema, CurrentWeatherSchema, DailyWeatherSchema, HourlyWeatherSchema } from "./schemas";

export type WeatherCondition = z.infer<typeof WeatherConditionSchema>;
export type WeatherConditionRaw = z.input<typeof WeatherConditionSchema>;

export type CurrentWeather = z.infer<typeof CurrentWeatherSchema>;
export type CurrentWeatherRaw = z.input<typeof CurrentWeatherSchema>;

export type DailyWeather = z.infer<typeof DailyWeatherSchema>;
export type DailyWeatherRaw = z.input<typeof DailyWeatherSchema>;

export type HourlyWeather = z.infer<typeof HourlyWeatherSchema>;
export type HourlyWeatherRaw = z.input<typeof HourlyWeatherSchema>;

export interface Weather {
  current: CurrentWeather;
  today: DailyWeather;
  hourly: HourlyWeather[];
}
