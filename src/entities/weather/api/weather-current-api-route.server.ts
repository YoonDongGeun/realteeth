import { ApiResponse, CoordinateSchema, CoordinateString, ParcelAddress } from "@shared/types";
import { NextRequest, NextResponse } from "next/server";

import { geocoder } from "@shared/lib/geocoder";
import { weatherService } from "@entities/weather/lib";
import { CurrentWeather } from "../model/types";

export type WeatherCurrentApiSearchParams = {
  address?: ParcelAddress;
  coordinate?: CoordinateString;
};

export async function weatherCurrentApiRoute(request: NextRequest) {
  const { address, coordinate: coordinateString } = parseParams(request.nextUrl.searchParams);
  let coordinate;

  if (address) {
    coordinate = geocoder.geoCode(address);
  } else {
    coordinate = CoordinateSchema.parse(coordinateString);
  }

  const res = await weatherService.fetchCurrentWeatherByCoordinates(coordinate);

  return NextResponse.json<ApiResponse<CurrentWeather>>({ data: res }, { status: 200 });
}

function parseParams(params: URLSearchParams): WeatherCurrentApiSearchParams {
  const address = params.get("address") || undefined;
  const coordinate = params.get("coordinate") || undefined;

  if (!address && !coordinate)
    NextResponse.json<ApiResponse>({ error: "잘못된 파라미터", data: null }, { status: 400 });

  return { address, coordinate };
}
