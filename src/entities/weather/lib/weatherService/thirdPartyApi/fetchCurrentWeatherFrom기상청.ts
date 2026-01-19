import { QueryStringBuilder } from "@shared/lib";
import {
  FORECAST_API_BASE_URL,
  FORECAST_API_KRY,
  기상청_API_에러코드_TO_MESSAGE,
  기상청ApiResponse,
  실시간예보데이터,
} from "./types";
import { cacheLife, cacheTag } from "next/cache";
import { getSecondsUntilNextTenMinutes } from "@entities/weather/api/fetchWeatherCurrent";

interface GetUltraSrtNcstParams {
  /** 발표일자 (YYYYMMDD) */
  baseDate: string;
  /** 발표시각 (HHmm) */
  baseTime: string;
  /** 예보지점 격자 X 좌표 */
  nx: number;
  /** 예보지점 격자 Y 좌표 */
  ny: number;
}

const ROWS_PER_HOUR = 8;
/**
 * 초단기실황 조회 (현재 날씨 관측 데이터)
 */
export async function fetchCurrentWeatherFrom기상청(params: GetUltraSrtNcstParams) {
  "use cache";
  cacheLife({
    stale: 300,
    revalidate: getSecondsUntilNextTenMinutes(),
    expire: getSecondsUntilNextTenMinutes(),
  });
  cacheTag("currentWeather");

  const url = new QueryStringBuilder(FORECAST_API_BASE_URL, "/getUltraSrtNcst")
    .setMany({
      authKey: FORECAST_API_KRY(),
      dataType: "JSON",
      base_date: params.baseDate,
      base_time: params.baseTime,
      nx: params.nx,
      ny: params.ny,
      pageNo: 1,
      numOfRows: ROWS_PER_HOUR,
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

  const data = (await res.json()) as 기상청ApiResponse<실시간예보데이터>;

  const errorCode = data.response.header.resultCode;
  if (errorCode !== "00") {
    throw new Error(기상청_API_에러코드_TO_MESSAGE[errorCode].message);
  }

  const result = data.response.body.items.item;
  return result;
}
