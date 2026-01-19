import { ApiResponse, ParcelAddress } from "@shared/model";
import { NextRequest, NextResponse } from "next/server";
import { unstable_cache } from "next/cache";

import { geocoder } from "@shared/lib/geocoder";
import { weatherService } from "@entities/weather/lib";
import { FetchWeatherDailyResponse } from "./fetchWeatherDaily ";
import { getSecondsUntilNextDailyWeatherUpdate } from "./current-weather-cache-time";

export type WeatherDailyApiSearchParams = {
  address: ParcelAddress;
};

export async function weatherDailyApiRoute(request: NextRequest) {
  const { address } = parseParams(request.nextUrl.searchParams);
  if (!address) return NextResponse.json<ApiResponse>({ error: "잘못된 파라미터", data: null }, { status: 400 });

  const res = await fetchCachedDailyWeather(address);
  return NextResponse.json<FetchWeatherDailyResponse>({ data: res }, { status: 200 });
}

function parseParams(params: URLSearchParams): WeatherDailyApiSearchParams {
  const address = params.get("address");
  return { address } as { address: string };
}

const fetchCachedDailyWeather = unstable_cache(fetchDailyWeatherByAddress, ["dailyWeather"], {
  tags: ["dailyWeather"],
  revalidate: getSecondsUntilNextDailyWeatherUpdate(),
});

async function fetchDailyWeatherByAddress(address: ParcelAddress) {
  const coordinate = geocoder.geoCode(address);
  return await weatherService.fetchDailyWeatherByCoordinates(coordinate);
}
