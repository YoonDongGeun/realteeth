import { Coordinate, coordinateToStringSchema, ParcelAddress } from "@shared/types";
import { CurrentWeather } from "../model/types";
import { apiClient } from "@shared/api";
import { WeatherCurrentApiSearchParams } from "./weather-current-api-route.server";

type Props = { address?: ParcelAddress; coordinate?: Coordinate };

type QueryString = WeatherCurrentApiSearchParams;

type Response = CurrentWeather;
export const fetchWeatherCurrent = async ({ address, coordinate }: Props) => {
  const coordinateString = coordinate ? coordinateToStringSchema.parse(coordinate) : undefined;

  const params: QueryString = {
    address,
    coordinate: coordinateString,
  };
  return await apiClient.get<Response>("/api/weather-current", {
    params,
  });
};
