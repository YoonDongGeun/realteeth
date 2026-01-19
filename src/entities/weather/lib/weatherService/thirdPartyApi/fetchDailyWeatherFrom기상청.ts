import { QueryStringBuilder } from "@shared/lib";
import {
  FORECAST_API_BASE_URL,
  FORECAST_API_KRY,
  GridCoordinate,
  기상청_API_에러코드_TO_MESSAGE,
  기상청ApiResponse,
  단기예보데이터,
} from "./types";
import { getSecondsUntilNextDailyWeatherUpdate } from "@entities/weather/api/fetchWeatherDaily";
import { cacheLife, cacheTag } from "next/cache";

interface GetVilageFcstParams {
  /** 발표일자 (YYYYMMDD) */
  baseDate: string;
  baseTime: string;
  gridCoordinate: GridCoordinate;
}

const ROWS_PER_HOUR = 12;

/**
 * 단기예보 조회
 */
export async function fetchDailyWeatherFrom기상청(params: GetVilageFcstParams) {
  "use cache";
  const { baseDate, baseTime, gridCoordinate } = params;
  cacheTag(`daily-${baseDate}-${baseTime}-${gridCoordinate.nx}-${gridCoordinate.ny}`);
  cacheLife({
    expire: getSecondsUntilNextDailyWeatherUpdate(),
    revalidate: getSecondsUntilNextDailyWeatherUpdate(),
    stale: 600,
  });

  const url = new QueryStringBuilder(FORECAST_API_BASE_URL, "/getVilageFcst")
    .setMany({
      authKey: FORECAST_API_KRY(),
      dataType: "JSON",
      base_date: baseDate,
      base_time: baseTime,
      nx: gridCoordinate.nx,
      ny: gridCoordinate.ny,
      pageNo: 1,
      numOfRows: ROWS_PER_HOUR * 18, // 페이지당 표출 데이터 수. 1시간 데이터당 12개 데이터 존재.
    })
    .build();

  // apiClient 사용하지 말기
  const res = await fetch(url, {
    headers: {
      "Content-Type": "application/json",
    },
  });
  if (!res.ok) {
    throw new Error(`KMA API 에러: ${res.status} ${res.statusText}`);
  }

  const data = (await res.json()) as 기상청ApiResponse<단기예보데이터>;
  const errorCode = data.response.header.resultCode;
  if (errorCode !== "00") {
    throw new Error(기상청_API_에러코드_TO_MESSAGE[errorCode].message);
  }

  const result = data.response.body.items.item;
  return result;
}
