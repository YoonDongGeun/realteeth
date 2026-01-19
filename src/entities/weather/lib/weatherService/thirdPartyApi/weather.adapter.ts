import type { CurrentWeather, DailyWeather, HourlyWeather, WeatherCondition } from "../../../model/types";
import {
  CATEGORY_CODE,
  CURRENT_WEATHER_CATEGORY_CODE,
  SKY_CODE,
  PTY_CODE,
  CURRENT_WEATHER_PTY_CODE,
  단기예보데이터,
  실시간예보데이터,
} from "./types";
import { localDayjs } from "@shared/lib";

/** 기상청 API 응답을 내부 도메인 모델로 변환 (Raw) */
export function 단기예보데이터ToDailyWeather(items: 단기예보데이터[]): DailyWeather {
  const groupedByDateTime = groupByDateTime(items);
  const hourly = extractHourlyWeather(groupedByDateTime);

  // Note: calculations like min/max temp are done on raw numbers, which is fine.
  const minTemperature = Math.min(...hourly.map((h) => h.temperature));
  const maxTemperature = Math.max(...hourly.map((h) => h.temperature));
  const precipitationProbability = Math.max(...hourly.map((h) => h.precipitationProbability));

  // 날씨 상태 우선순위: 눈 > 진눈깨비 > 비 > 흐림 > 구름조금 > 맑음
  const conditions = hourly.map((h) => h.condition);
  let condition: WeatherCondition = "clear";

  if (conditions.includes("snow")) condition = "snow";
  else if (conditions.includes("sleet")) condition = "sleet";
  else if (conditions.includes("rain")) condition = "rain";
  else if (conditions.includes("cloudy")) condition = "cloudy";
  else if (conditions.includes("partly_cloudy")) condition = "partly_cloudy";

  return {
    date: hourly[0]?.time ? localDayjs(hourly[0].time).format("YYYY-MM-DD") : localDayjs().format("YYYY-MM-DD"),
    minTemperature: isFinite(minTemperature) ? minTemperature : 0,
    maxTemperature: isFinite(maxTemperature) ? maxTemperature : 0,
    precipitationProbability: isFinite(precipitationProbability) ? precipitationProbability : 0,
    condition,
    hourly,
  };
}

/**
 * 날짜/시간별로 그룹화
 */
function groupByDateTime(items: 단기예보데이터[]): Map<string, Map<string, string>> {
  const grouped = new Map<string, Map<string, string>>();

  for (const item of items) {
    const key = `${item.fcstDate}-${item.fcstTime}`;
    if (!grouped.has(key)) {
      grouped.set(key, new Map());
    }
    grouped.get(key)!.set(item.category, item.fcstValue);
  }

  return grouped;
}

/** 시간대별 날씨 추출 (24시간) */
function extractHourlyWeather(grouped: Map<string, Map<string, string>>): HourlyWeather[] {
  const hourlyList: HourlyWeather[] = [];
  const entries = Array.from(grouped.entries()).slice(0, 24);

  for (const [key, data] of entries) {
    const [fcstDate, fcstTime] = key.split("-");
    const temperature = parseFloat(data.get(CATEGORY_CODE.TMP) || "0");
    const humidity = parseFloat(data.get(CATEGORY_CODE.REH) || "0");
    const windSpeed = parseFloat(data.get(CATEGORY_CODE.WSD) || "0");
    const precipProb = parseFloat(data.get(CATEGORY_CODE.POP) || "0");

    const skyCode = data.get(CATEGORY_CODE.SKY) || SKY_CODE.CLEAR;
    const ptyCode = data.get(CATEGORY_CODE.PTY) || PTY_CODE.NONE;
    const condition = getWeatherCondition(skyCode, ptyCode);

    hourlyList.push({
      time: localDayjs(`${fcstDate}${fcstTime}`, "YYYYMMDDHHmm").toISOString(),
      temperature,
      condition,
      precipitationProbability: precipProb,
      humidity,
      windSpeed,
    });
  }

  return hourlyList;
}

/**
 * 날씨 상태 코드를 WeatherCondition으로 변환
 */
function getWeatherCondition(skyCode: string, ptyCode: string): WeatherCondition {
  // 강수형태가 있으면 우선
  switch (ptyCode) {
    case PTY_CODE.RAIN:
    case PTY_CODE.SHOWER:
      return "rain";
    case PTY_CODE.SNOW:
      return "snow";
    case PTY_CODE.SLEET:
      return "sleet";
  }

  // 하늘상태
  switch (skyCode) {
    case SKY_CODE.CLEAR:
      return "clear";
    case SKY_CODE.PARTLY_CLOUDY:
      return "partly_cloudy";
    case SKY_CODE.CLOUDY:
      return "cloudy";
    default:
      return "clear";
  }
}

/**
 * 초단기실황 데이터를 CurrentWeather로 변환
 */
export function 실시간예보데이터ToCurrentWeather(items: 실시간예보데이터[]): CurrentWeather {
  const dataMap = new Map<string, string>();
  let baseDate = "";
  let baseTime = "";

  for (const item of items) {
    dataMap.set(item.category, item.obsrValue);
    baseDate = item.baseDate;
    baseTime = item.baseTime;
  }

  const temperature = parseFloat(dataMap.get(CURRENT_WEATHER_CATEGORY_CODE.T1H) || "0");
  const humidity = parseFloat(dataMap.get(CURRENT_WEATHER_CATEGORY_CODE.REH) || "0");
  const windSpeed = parseFloat(dataMap.get(CURRENT_WEATHER_CATEGORY_CODE.WSD) || "0");
  const windDirection = parseFloat(dataMap.get(CURRENT_WEATHER_CATEGORY_CODE.VEC) || "0");
  const precipitation = parseFloat(dataMap.get(CURRENT_WEATHER_CATEGORY_CODE.RN1) || "0");
  const ptyCode = dataMap.get(CURRENT_WEATHER_CATEGORY_CODE.PTY) || CURRENT_WEATHER_PTY_CODE.NONE;

  const condition = getWeatherConditionFromCurrentWeatherPty(ptyCode);

  return {
    temperature,
    condition,
    humidity,
    windSpeed,
    windDirection,
    precipitation,
    measuredAt: localDayjs(`${baseDate}${baseTime}`, "YYYYMMDDHHmm").toISOString(),
  };
}

/** 강수형태 코드만으로 날씨 상태 판단 (초단기실황용) */
function getWeatherConditionFromCurrentWeatherPty(ptyCode: string): WeatherCondition {
  switch (ptyCode) {
    case CURRENT_WEATHER_PTY_CODE.RAIN:
      return "rain";
    case CURRENT_WEATHER_PTY_CODE.SNOW:
      return "snow";
    case CURRENT_WEATHER_PTY_CODE.SLEET:
      return "sleet";
    case CURRENT_WEATHER_PTY_CODE.RAIN_DROP: // 빗방울
      return "rain";
    case CURRENT_WEATHER_PTY_CODE.RAIN_DROP_SNOW: // 빗방울눈날림
      return "sleet";
    case CURRENT_WEATHER_PTY_CODE.SNOW_DRIFT: // 눈날림
      return "snow";
    case CURRENT_WEATHER_PTY_CODE.NONE:
    default:
      return "clear";
  }
}
