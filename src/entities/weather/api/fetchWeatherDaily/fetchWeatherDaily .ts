import { apiClient } from "@shared/api";
import { ApiResponse, Coordinate, coordinateToStringSchema, ParcelAddress } from "@shared/model";
import { DailyWeather } from "../../model/types";
import { WeatherDailyApiSearchParams } from "./weather-daily-api-route.server";
type Props = { address?: ParcelAddress; coordinate?: Coordinate };

type QueryString = WeatherDailyApiSearchParams;

export type FetchWeatherDailyResponse = ApiResponse<DailyWeather>;
export const fetchWeatherDaily = async ({ address, coordinate }: Props) => {
  const coordinateString = coordinate ? coordinateToStringSchema.parse(coordinate) : undefined;

  const params: QueryString = {
    address,
    coordinate: coordinateString,
  };
  return await apiClient.get<FetchWeatherDailyResponse>("/api/weather-daily", {
    params,
  });
};
