import { ApiResponse, ParcelAddress } from "@shared/model";
import { NextRequest, NextResponse } from "next/server";
import { cacheLife, cacheTag, unstable_cache } from "next/cache";

import { geocoder } from "@shared/lib/geocoder";
import { weatherService } from "@entities/weather/lib";
import { FetchWeatherCurrentResponseDTO, getSecondsUntilNextTenMinutes } from "@entities/weather";
import { WeatherCurrentApiSearchParams } from "@entities/weather/api/fetchWeatherCurrent";

// api route의 경우 반드시 app 폴더에 파일이 위치해야 캐싱됨!! 이동 금지.
export async function GET(request: NextRequest) {
  const { address } = parseParams(request.nextUrl.searchParams);
  if (!address) return NextResponse.json<ApiResponse>({ error: "잘못된 파라미터", data: null }, { status: 400 });

  const res = await getCachedCurrentWeatherByAddress(address);
  return NextResponse.json<FetchWeatherCurrentResponseDTO>({ data: res }, { status: 200 });
}

function parseParams(params: URLSearchParams): WeatherCurrentApiSearchParams {
  const address = params.get("address");

  return { address } as { address: string };
}

export async function fetchCurrentWeatherByAddress(address: ParcelAddress) {
  "use cache";
  const coordinate = geocoder.geoCode(address);
  cacheLife({
    stale: 300,
    revalidate: getSecondsUntilNextTenMinutes(),
    expire: getSecondsUntilNextTenMinutes(),
  });
  cacheTag("currentWeather", address);
  return await weatherService.fetchCurrentWeatherByCoordinates(coordinate);
}

const getCachedCurrentWeatherByAddress = (address: string) =>
  unstable_cache(
    async (address: string) => {
      return fetchCurrentWeatherByAddress(address);
    },
    ["user", address],
    {
      revalidate: getSecondsUntilNextTenMinutes(),
      tags: ["daily", address],
    }
  )(address);
