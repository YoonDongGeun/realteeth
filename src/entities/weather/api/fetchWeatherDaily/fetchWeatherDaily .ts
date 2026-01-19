import { apiClient } from "@shared/api";
import { ApiResponse, ParcelAddress } from "@shared/model";
import { DailyWeatherSchema } from "../../model/schemas";
import { WeatherDailyApiSearchParams } from "@app/api/weather-daily/weather-daily-api-route.server";
import z from "zod";
type Props = { address: ParcelAddress };

type QueryString = WeatherDailyApiSearchParams;

export type FetchWeatherDailyResponse = ApiResponse<z.input<typeof DailyWeatherSchema>>;
export const fetchWeatherDaily = async ({ address }: Props) => {
  const params: QueryString = {
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
