import { ApiResponse, ParcelAddress } from "@shared/model";

import { apiClient } from "@shared/api";

import z from "zod";
import { CurrentWeatherSchema } from "../../model/schemas";

type Props = { address: ParcelAddress };

export type WeatherCurrentApiSearchParams = {
  address: ParcelAddress;
};

export type FetchWeatherCurrentResponseDTO = ApiResponse<z.input<typeof CurrentWeatherSchema>>;

export const fetchWeatherCurrent = async ({ address }: Props) => {
  const params: WeatherCurrentApiSearchParams = {
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
