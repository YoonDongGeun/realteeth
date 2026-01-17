import type { CurrentWeather, DailyWeather } from "../../model/types";

import { 단기예보데이터ToDailyWeather, 실시간예보데이터ToCurrentWeather } from "./thirdPartyApi/weather.adapter";
import { localDayjs } from "@shared/lib";
import { fetchDailyWeatherFrom기상청 } from "./thirdPartyApi/fetchDailyWeatherFrom기상청";
import { fetchCurrentWeatherFrom기상청 } from "./thirdPartyApi/fetchCurrentWeatherFrom기상청";
import { convertToGrid } from "./thirdPartyApi/utils/coordinatesToGrid";
import { Coordinate } from "@shared/model";

async function fetchDailyWeatherByCoordinates(coordinate: Coordinate): Promise<DailyWeather> {
  // WGS84 좌표 → 기상청 격자 좌표 변환
  const gridCoordinate = convertToGrid(coordinate);
  const { date, time } = getBaseTimeForCurrentWeather();

  const res = await fetchDailyWeatherFrom기상청({
    baseDate: date,
    baseTime: time,
    gridCoordinate,
  });

  return 단기예보데이터ToDailyWeather(res);
}

async function fetchCurrentWeatherByCoordinates(coordinate: Coordinate): Promise<CurrentWeather> {
  // WGS84 좌표 → 기상청 격자 좌표 변환
  const { nx, ny } = convertToGrid(coordinate);
  const { date, time } = getBaseTimeForCurrentWeather();

  const res = await fetchCurrentWeatherFrom기상청({
    baseDate: date,
    baseTime: time,
    nx,
    ny,
  });

  return 실시간예보데이터ToCurrentWeather(res);
}

/**
 * 초단기실황 API 베이스 타임 계산
 *
 * 기상청 API는 매시 정각 데이터를 10분 후 반영하므로,
 * HH:00~HH:09 사이에는 이전 시간(HH-1:00) 데이터를 조회합니다.
 * 만약 그냥 조회한다면 데이터 업데이트가 안돼 No Data가 찍힙니다.
 *
 * @see {@link https://apihub.kma.go.kr/getAttachFile.do?fileName=%EB%8B%A8%EA%B8%B0%EC%98%88%EB%B3%B4%20%EC%A1%B0%ED%9A%8C%EC%84%9C%EB%B9%84%EC%8A%A4_API%ED%99%9C%EC%9A%A9%EA%B0%80%EC%9D%B4%EB%93%9C_241128.docx} 기상청 API 가이드
 */
export function getBaseTimeForCurrentWeather(): { date: string; time: string } {
  const now = localDayjs();
  const currentMinute = now.minute();

  // 현재가 XX:00 ~ XX:09 사이면 이전 시간 사용
  if (currentMinute < 10) {
    const prevHour = now.subtract(1, "hour");
    return {
      date: prevHour.format("YYYYMMDD"),
      time: prevHour.format("HH50"), // 정각
    };
  }

  // XX:10 이후면 현재 시간 사용
  return {
    date: now.format("YYYYMMDD"),
    time: now.format("HHmm"), // 정각
  };
}

export const weatherService = {
  fetchDailyWeatherByCoordinates, // 오늘 시간당 날씨
  fetchCurrentWeatherByCoordinates, // 현재 날씨
} as const;
