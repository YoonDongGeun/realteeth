"use server";
import { ApiResponse, ParcelAddress } from "@shared/model";
import { NextRequest, NextResponse } from "next/server";
import { cacheLife, cacheTag } from "next/cache";

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
  const res = await fetchDailyWeatherByAddress(address);
  return NextResponse.json<FetchWeatherDailyResponse>({ data: res }, { status: 200 });
}

function parseParams(params: URLSearchParams): WeatherDailyApiSearchParams {
  const address = params.get("address");
  return { address } as { address: string };
}

async function fetchDailyWeatherByAddress(address: ParcelAddress) {
  "use cache";
  const coordinate = geocoder.geoCode(address);
  const cacheSeconds = getSecondsUntilNextDailyWeatherUpdate();
  cacheLife({ revalidate: cacheSeconds, stale: cacheSeconds + 300 });
  cacheTag("dailyWeather", address);
  return await weatherService.fetchDailyWeatherByCoordinates(coordinate);
}
