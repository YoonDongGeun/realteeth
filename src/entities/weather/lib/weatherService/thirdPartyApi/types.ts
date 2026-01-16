import { z } from "zod";

/** 기상청 API URL */
export const FORECAST_API_BASE_URL = "https://apihub.kma.go.kr/api/typ02/openApi/VilageFcstInfoService_2.0";
/** 기상처 API 키 */
export const FORECAST_API_KRY = () => {
  const API_KEY = process.env.KMA_API_KEY;
  if (!API_KEY) throw new Error("날씨 API KEY가 없습니다.");
  return API_KEY;
};

export const CATEGORY_CODE = {
  TMP: "TMP",
  UUU: "UUU",
  VVV: "VVV",
  VEC: "VEC",
  WSD: "WSD",
  SKY: "SKY",
  PTY: "PTY",
  POP: "POP",
  WAV: "WAV",
  PCP: "PCP",
  REH: "REH",
  SNO: "SNO",
  TMN: "TMN",
  TMX: "TMX",
} as const;

export const CURRENT_WEATHER_CATEGORY_CODE = {
  T1H: "T1H",
  RN1: "RN1",
  REH: "REH",
  PTY: "PTY",
  WSD: "WSD",
  VEC: "VEC",
  UUU: "UUU",
  VVV: "VVV",
} as const;

export const SKY_CODE = {
  CLEAR: "1", // 맑음
  PARTLY_CLOUDY: "3", // 구름많음
  CLOUDY: "4", // 흐림
} as const;

/** 단기예보 강수형태(PTY) 코드 */
export const PTY_CODE = {
  NONE: "0", // 없음
  RAIN: "1", // 비
  SLEET: "2", // 비/눈
  SNOW: "3", // 눈
  SHOWER: "4", // 소나기
} as const;

/** 초단기실황 강수형태(PTY) 코드 */
export const CURRENT_WEATHER_PTY_CODE = {
  NONE: "0", // 없음
  RAIN: "1", // 비
  SLEET: "2", // 비/눈
  SNOW: "3", // 눈
  RAIN_DROP: "5", // 빗방울
  RAIN_DROP_SNOW: "6", // 빗방울눈날림
  SNOW_DRIFT: "7", // 눈날림
} as const;

export type GridCoordinate = {
  nx: number;
  ny: number;
};

/** 단기예보 데이터 */
export const 단기예보데이터Schema = z.object({
  baseDate: z.string().length(8), // YYYYMMDD
  baseTime: z.string().length(4), // HHmm
  category: z.enum(["TMP", "UUU", "VVV", "VEC", "WSD", "SKY", "PTY", "POP", "WAV", "PCP", "REH", "SNO", "TMN", "TMX"]),
  fcstDate: z.string().length(8), // YYYYMMDD
  fcstTime: z.string().length(4), // HHmm
  fcstValue: z.string(),
  nx: z.number(),
  ny: z.number(),
});

export type 단기예보데이터 = z.infer<typeof 단기예보데이터Schema>;

/** 초단기실황 데이터 */
export const 실시간예보데이터Schema = z.object({
  baseDate: z.string().length(8), // YYYYMMDD
  baseTime: z.string().length(4), // HHmm
  category: z.enum(["T1H", "RN1", "REH", "PTY", "WSD", "VEC", "UUU", "VVV"]),
  obsrValue: z.string(),
  nx: z.number(),
  ny: z.number(),
});

export type 실시간예보데이터 = z.infer<typeof 실시간예보데이터Schema>;

export type 기상청ApiResponse<T> = {
  response: {
    header: {
      resultCode: keyof typeof 기상청_API_에러코드_TO_MESSAGE;
      resultMsg: string;
    };
    body: {
      dataType: string;
      items: {
        item: T[];
      };
      pageNo: number;
      numOfRows: number;
      totalCount: number;
    };
  };
};

export const 기상청_API_에러코드_TO_MESSAGE = {
  "00": { code: "NORMAL_SERVICE", message: "정상" },
  "01": { code: "APPLICATION_ERROR", message: "어플리케이션 에러" },
  "02": { code: "DB_ERROR", message: "데이터베이스 에러" },
  "03": { code: "NODATA_ERROR", message: "데이터 없음 에러" },
  "04": { code: "HTTP_ERROR", message: "HTTP 에러" },
  "05": { code: "SERVICETIME_OUT", message: "서비스 연결 실패 에러" },
  "10": { code: "INVALID_REQUEST_PARAMETER_ERROR", message: "잘못된 요청 파라미터 에러" },
  "11": { code: "NO_MANDATORY_REQUEST_PARAMETERS_ERROR", message: "필수 요청 파라미터가 없음" },
  "12": { code: "NO_OPENAPI_SERVICE_ERROR", message: "해당 오픈 API 서비스가 없거나 폐기됨" },
  "20": { code: "SERVICE_ACCESS_DENIED_ERROR", message: "서비스 접근 거부" },
  "21": { code: "TEMPORARILY_DISABLE_THE_SERVICEKEY_ERROR", message: "일시적으로 사용할 수 없는 서비스 키" },
  "22": { code: "LIMITED_NUMBER_OF_SERVICE_REQUESTS_EXCEEDS_ERROR", message: "서비스 요청 제한 횟수 초과" },
  "30": { code: "SERVICE_KEY_IS_NOT_REGISTERED_ERROR", message: "등록되지 않은 서비스 키" },
  "31": { code: "DEADLINE_HAS_EXPIRED_ERROR", message: "기한 만료된 서비스 키" },
  "32": { code: "UNREGISTERED_IP_ERROR", message: "등록되지 않은 IP" },
  "33": { code: "UNSIGNED_CALL_ERROR", message: "서명되지 않은 호출" },
  "99": { code: "UNKNOWN_ERROR", message: "기타 에러" },
} as const;
