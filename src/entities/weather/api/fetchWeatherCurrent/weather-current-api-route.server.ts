import { ApiResponse, ParcelAddress } from "@shared/model";
import { NextRequest, NextResponse } from "next/server";
import { unstable_cache } from "next/cache";

import { geocoder } from "@shared/lib/geocoder";
import { weatherService } from "@entities/weather/lib";
import { FetchWeatherCurrentResponseDTO } from "./fetchWeatherCurrent";
import { getSecondsUntilNextTenMinutes } from "./current-weather-cache-time";

export type WeatherCurrentApiSearchParams = {
  address: ParcelAddress;
};

export async function weatherCurrentApiRoute(request: NextRequest) {
  const { address } = parseParams(request.nextUrl.searchParams);
  if (!address) {
    return NextResponse.json<ApiResponse>({ error: "잘못된 파라미터", data: null }, { status: 400 });
  }

  const cacheSeconds = getSecondsUntilNextTenMinutes();
  const res = await unstable_cache(fetchCurrentWeatherByAddress, ["currentWeather", address], {
    tags: ["currentWeather", address],
    revalidate: cacheSeconds,
  })(address);
  return NextResponse.json<FetchWeatherCurrentResponseDTO>({ data: res }, { status: 200 });
}

function parseParams(params: URLSearchParams): WeatherCurrentApiSearchParams {
  const address = params.get("address");

  return { address } as { address: string };
}

async function fetchCurrentWeatherByAddress(address: ParcelAddress) {
  const coordinate = geocoder.geoCode(address);
  return await weatherService.fetchCurrentWeatherByCoordinates(coordinate);
}
