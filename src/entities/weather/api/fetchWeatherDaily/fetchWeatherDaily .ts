import { apiClient } from "@shared/api";
import { ApiResponse, ParcelAddress } from "@shared/model";
import { DailyWeatherSchema } from "../../model/schemas";

import z from "zod";
type Props = { address: ParcelAddress };

export type WeatherDailyApiSearchParams = {
  address: ParcelAddress;
};
export type FetchWeatherDailyResponse = ApiResponse<z.input<typeof DailyWeatherSchema>>;
export const fetchWeatherDaily = async ({ address }: Props) => {
  const params: WeatherDailyApiSearchParams = {
    address,
  };
  const response = await apiClient.get<FetchWeatherDailyResponse>("/api/weather-daily", {
    params,
  });
  return {
    data: response.data,
    error: response.error,
  };
};
