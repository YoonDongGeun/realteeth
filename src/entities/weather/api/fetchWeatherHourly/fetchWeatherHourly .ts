import { apiClient } from "@shared/api";
import { ApiResponse, Coordinate, coordinateToStringSchema, ParcelAddress } from "@shared/model";
import { HourlyWeather } from "../../model/types";
import { WeatherHourlyApiSearchParams } from "./weather-hourly-api-route.server";
type Props = { address?: ParcelAddress; coordinate?: Coordinate };

type QueryString = WeatherHourlyApiSearchParams;

export type FetchWeatherHourlyResponse = ApiResponse<HourlyWeather[]>;
export const fetchWeatherHourly = async ({ address, coordinate }: Props) => {
  const coordinateString = coordinate ? coordinateToStringSchema.parse(coordinate) : undefined;

  const params: QueryString = {
    address,
    coordinate: coordinateString,
  };
  return await apiClient.get<FetchWeatherHourlyResponse>("/api/weather-hourly", {
    params,
  });
};
