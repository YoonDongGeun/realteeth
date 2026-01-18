import { z } from "zod";
import { localDayjs } from "@shared/lib";
// Helper for WeatherCondition
export const WeatherConditionSchema = z.enum([
  "clear",
  "partly_cloudy",
  "cloudy",
  "rain",
  "snow",
  "sleet",
  "thunderstorm",
  "fog",
]);

// Helper for date string to boolean/number safety
const SafeNumber = z.number();

export const CurrentWeatherSchema = z.object({
  temperature: SafeNumber,
  condition: WeatherConditionSchema,
  humidity: SafeNumber,
  windSpeed: SafeNumber,
  windDirection: SafeNumber,
  precipitation: SafeNumber,
  measuredAt: z.string().transform((str) => localDayjs(str)),
});

export const HourlyWeatherSchema = z.object({
  time: z.string().transform((str) => localDayjs(str)),
  temperature: SafeNumber,
  condition: WeatherConditionSchema,
  precipitationProbability: SafeNumber,
  humidity: SafeNumber,
  windSpeed: SafeNumber,
});

export const DailyWeatherSchema = z.object({
  date: z.string().transform((str) => localDayjs(str)),
  minTemperature: SafeNumber,
  maxTemperature: SafeNumber,
  condition: WeatherConditionSchema,
  precipitationProbability: SafeNumber,
  hourly: z.array(HourlyWeatherSchema),
});
