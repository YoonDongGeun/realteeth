import { ApiResponse, CoordinateSchema, CoordinateString, ParcelAddress } from "@shared/types";
import { NextRequest, NextResponse } from "next/server";
import { geocoder } from "@shared/lib/geocoder";
import { weatherService } from "@entities/weather/lib";
import { FetchWeatherHourlyResponse } from "./fetchWeatherHourly ";

export type WeatherHourlyApiSearchParams = {
  address?: ParcelAddress;
  coordinate?: CoordinateString;
};

export async function weatherHourlyApiRoute(request: NextRequest) {
  const { address, coordinate: coordinateString } = parseParams(request.nextUrl.searchParams);
  let coordinate;

  if (address) {
    coordinate = geocoder.geoCode(address);
  } else {
    coordinate = CoordinateSchema.parse(coordinateString);
  }

  const res = await weatherService.fetchHourlyWeatherByCoordinates(coordinate);

  return NextResponse.json<FetchWeatherHourlyResponse>({ data: res }, { status: 200 });
}

function parseParams(params: URLSearchParams): WeatherHourlyApiSearchParams {
  const address = params.get("address") || undefined;
  const coordinate = params.get("coordinate") || undefined;

  if (!address && !coordinate)
    NextResponse.json<ApiResponse>({ error: "잘못된 파라미터", data: null }, { status: 400 });

  return { address, coordinate };
}
