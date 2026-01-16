import { apiClient } from "@shared/api";
import { Coordinate, coordinateToStringSchema, ParcelAddress } from "@shared/types";
import { HourlyWeather } from "../model/types";
import { WeatherHourlyApiSearchParams } from "./weather-hourly-api-route.server";
type Props = { address?: ParcelAddress; coordinate?: Coordinate };

type QueryString = WeatherHourlyApiSearchParams;

type Response = HourlyWeather;
export const fetchWeatherHourly = async ({ address, coordinate }: Props) => {
  const coordinateString = coordinate ? coordinateToStringSchema.parse(coordinate) : undefined;

  const params: QueryString = {
    address,
    coordinate: coordinateString,
  };
  return await apiClient.get<Response>("/api/weather-hourly", {
    params,
  });
};
