import { ApiResponse, ParcelAddress } from "@shared/model";
import { NextRequest, NextResponse } from "next/server";
import { unstable_cache } from "next/cache";

import { geocoder } from "@shared/lib/geocoder";
import { weatherService } from "@entities/weather/lib";
import { FetchWeatherDailyResponse, getSecondsUntilNextDailyWeatherUpdate } from "@entities/weather";
import { WeatherDailyApiSearchParams } from "@entities/weather/api/fetchWeatherDaily";

// api route의 경우 반드시 app 폴더에 파일이 위치해야 캐싱됨!! 이동 금지.
export async function GET(request: NextRequest) {
  const { address } = parseParams(request.nextUrl.searchParams);
  if (!address) return NextResponse.json<ApiResponse>({ error: "잘못된 파라미터", data: null }, { status: 400 });

  const res = await getCachedDailyWeatherByAddress(address);
  return NextResponse.json<FetchWeatherDailyResponse>({ data: res }, { status: 200 });
}

function parseParams(params: URLSearchParams): WeatherDailyApiSearchParams {
  const address = params.get("address");
  return { address } as { address: string };
}

export async function fetchDailyWeatherByAddress(address: ParcelAddress) {
  const coordinate = geocoder.geoCode(address);
  return await weatherService.fetchDailyWeatherByCoordinates(coordinate);
}
const getCachedDailyWeatherByAddress = (address: string) =>
  unstable_cache(
    async (address: string) => {
      return await fetchDailyWeatherByAddress(address);
    },
    [`daily-${address}`],
    {
      revalidate: getSecondsUntilNextDailyWeatherUpdate(),
      tags: [`daily-${address}`],
    }
  )(address);
