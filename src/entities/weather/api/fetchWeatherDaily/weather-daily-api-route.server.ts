import { ApiResponse, CoordinateSchema, CoordinateString, ParcelAddress } from "@shared/model";
import { NextRequest, NextResponse } from "next/server";
import { geocoder } from "@shared/lib/geocoder";
import { weatherService } from "@entities/weather/lib";
import { FetchWeatherDailyResponse } from "./fetchWeatherDaily ";

export type WeatherDailyApiSearchParams = {
  address?: ParcelAddress;
  coordinate?: CoordinateString;
};

export async function weatherDailyApiRoute(request: NextRequest) {
  const { address, coordinate: coordinateString } = parseParams(request.nextUrl.searchParams);
  let coordinate;

  if (address) {
    coordinate = geocoder.geoCode(address);
  } else {
    coordinate = CoordinateSchema.parse(coordinateString);
  }

  const res = await weatherService.fetchDailyWeatherByCoordinates(coordinate);

  return NextResponse.json<FetchWeatherDailyResponse>({ data: res }, { status: 200 });
}

function parseParams(params: URLSearchParams): WeatherDailyApiSearchParams {
  const address = params.get("address") || undefined;
  const coordinate = params.get("coordinate") || undefined;

  if (!address && !coordinate)
    NextResponse.json<ApiResponse>({ error: "잘못된 파라미터", data: null }, { status: 400 });

  return { address, coordinate };
}
