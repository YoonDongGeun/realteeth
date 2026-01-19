import { queryOptions, useSuspenseQuery } from "@tanstack/react-query";

import { fetchWeatherCurrent } from "./fetchWeatherCurrent/fetchWeatherCurrent";
import { fetchWeatherDaily } from "./fetchWeatherDaily/fetchWeatherDaily ";
import { ParcelAddress } from "@shared/model";
import { getSecondsUntilNextTenMinutes } from "./fetchWeatherCurrent/current-weather-cache-time";
import { getSecondsUntilNextDailyWeatherUpdate } from "./fetchWeatherDaily/current-weather-cache-time";

export const weatherQueries = {
  current: (address: ParcelAddress) =>
    queryOptions({
      queryKey: ["weather", address, "current"],
      queryFn: async () => {
        const params = { address: address };
        const res = await fetchWeatherCurrent(params);
        if (res.error) throw new Error(res.error);
        if (!res.data) throw new Error("No data returned");
        return res.data;
      },
      staleTime: 1000 * 60 * 10,
      refetchInterval: () => {
        return Math.max(getSecondsUntilNextTenMinutes() * 1000, 60 * 1000);
      },
    }),

  daily: (address: ParcelAddress) =>
    queryOptions({
      queryKey: ["weather", address, "daily"],
      queryFn: async () => {
        const params = { address: address };
        const res = await fetchWeatherDaily(params);
        if (res.error) throw new Error(res.error);
        if (!res.data) throw new Error("No data returned");
        return res.data;
      },
      staleTime: 1000 * 60 * 60 * 3,
      refetchInterval: () => {
        return Math.max(getSecondsUntilNextDailyWeatherUpdate() * 1000, 180 * 1000);
      },
    }),
};

export const useCurrentWeather = (address: ParcelAddress) => {
  return useSuspenseQuery({
    ...weatherQueries.current(address),
  });
};

export const useDailyWeather = (address: ParcelAddress) => {
  return useSuspenseQuery({
    ...weatherQueries.daily(address),
  });
};
