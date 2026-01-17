import { localDayjs } from "@shared/lib";
import { geocoder } from "@shared/lib/geocoder";
import { Coordinate, CoordinateSchema } from "@shared/types";
import { NextRequest, NextResponse } from "next/server";
import { ipLocationConvertService } from "../../lib";
import { MyLocationApiResponse, MyLocationApiSearchParams } from "./fetchMyLocation";

const DEFAULT_ADDRESS = "서울특별시";

export async function myLocationApiRoute(request: NextRequest) {
  const coordinate = parseParams(request.nextUrl.searchParams);
  let address: string | null = null;

  if (coordinate) {
    if (!CoordinateSchema.safeParse(coordinate).success)
      return NextResponse.json({ error: "잘못된 파라미터" }, { status: 400 });
    address = await geocoder.reverseGeoCode(coordinate);
  } else {
    const forwarded = request.headers.get("x-forwarded-for");
    const ip = forwarded ? forwarded.split(",")[0] : request.headers.get("x-real-ip");
    const IS_DEV = ip === "::1" || ip === "127.0.0.1";
    if (ip && !IS_DEV) {
      try {
        const ipLocation = await ipLocationConvertService.fetchLocationFromIP(ip);
        address = await geocoder.reverseGeoCode(ipLocation.coordinate);
      } catch {
        // 무료 플랜 API Limit이 낮아서 catch되면 다 API Limit 문제.
      }
    }
  }

  if (!address) {
    address = DEFAULT_ADDRESS;
  }

  return NextResponse.json<MyLocationApiResponse>(
    {
      data: {
        address,
        updatedAt: localDayjs().toISOString(),
      },
    },
    { status: 200 }
  );
}

function parseParams(params: URLSearchParams): MyLocationApiSearchParams | null | void {
  const lat = params.get("lat");
  const lng = params.get("lng");
  const hasGPSInfo = lat && lng;
  if (hasGPSInfo) {
    const parsedLat = parseFloat(lat);
    const parsedLng = parseFloat(lng);
    const coordinate: Coordinate = { lat: parsedLat, lng: parsedLng };
    return coordinate;
  }
  return null;
}
