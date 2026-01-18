import { ApiResponse, ParcelAddress } from "@shared/model";

import { apiClient } from "@shared/api";
import { WeatherCurrentApiSearchParams } from "./weather-current-api-route.server";
import z from "zod";
import { CurrentWeatherSchema } from "../../model/schemas";

type Props = { address: ParcelAddress };

type Params = WeatherCurrentApiSearchParams;

export type FetchWeatherCurrentResponseDTO = ApiResponse<z.input<typeof CurrentWeatherSchema>>;

export const fetchWeatherCurrent = async ({ address }: Props) => {
  const params: Params = {
    address,
  };
  const response = await apiClient.get<FetchWeatherCurrentResponseDTO>("/api/weather-current", {
    params,
  });

  return {
    error: response.error,
    data: response.data,
  };
};
