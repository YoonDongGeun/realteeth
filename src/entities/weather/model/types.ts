import { Dayjs } from "dayjs";

export type WeatherCondition =
  | "clear" // 맑음
  | "partly_cloudy" // 구름 조금
  | "cloudy" // 흐림
  | "rain" // 비
  | "snow" // 눈
  | "sleet" // 진눈깨비
  | "thunderstorm" // 천둥번개
  | "fog"; // 안개

/**
 * 현재 날씨 정보
 */
export interface CurrentWeather {
  /** 현재 기온 (°C) */
  temperature: number;
  /** 날씨 상태 */
  condition: WeatherCondition;
  /** 습도 (%) */
  humidity: number;
  /** 풍속 (m/s) */
  windSpeed: number;
  /** 풍향 (degree) */
  windDirection: number;
  /** 강수량 (mm) */
  precipitation: number;
  /** 측정 시간 */
  measuredAt: Dayjs;
}

/**
 * 일일 날씨 정보 (최저/최고 기온)
 */
export interface DailyWeather {
  date: string; // YYYY-MM-DD
  /** 최저 기온 (°C) */
  minTemperature: number;
  /** 최고 기온 (°C) */
  maxTemperature: number;
  /** 날씨 상태 */
  condition: WeatherCondition;
  /** 강수 확률 (%) */
  precipitationProbability: number;
  /** 시간대별 날씨 정보 */
  hourly: HourlyWeather[];
}

/**
 * 시간대별 날씨 정보
 */
export interface HourlyWeather {
  time: Dayjs;
  /** 기온 (°C) */
  temperature: number;
  /** 날씨 상태 */
  condition: WeatherCondition;
  /** 강수 확률 (%) */
  precipitationProbability: number;
  /** 습도 (%) */
  humidity: number;
  /** 풍속 (m/s) */
  windSpeed: number;
}

/**
 * 완전한 날씨 정보
 */
export interface Weather {
  current: CurrentWeather;
  today: DailyWeather;
  hourly: HourlyWeather[];
}
