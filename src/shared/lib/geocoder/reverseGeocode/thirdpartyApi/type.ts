/**
 * VWorld Reverse Geocoding API 응답 타입
 */
export interface VWorldApiResponse {
  response: {
    service: {
      name: string;
      version: string;
      operation: string;
      time: string;
    };
    input?: {
      point: {
        x: string;
        y: string;
      };
      crs: string;
      type: string;
    };
  } & (
    | {
        status: "ERROR";
        error: VWorldApiError;
        result?: undefined;
      }
    | {
        status: "NOT_FOUND";
        result?: undefined;
        error?: undefined;
      }
    | {
        status: "OK";
        result: VWorldAddressItem[];
        error?: undefined;
      }
  );
}

/**
 * 주소 정보 아이템
 */
export interface VWorldAddressItem {
  zipcode?: string;
  type: AddressType;
  text: string;
  structure: {
    level0: string; // 국가
    level1: string; // 시·도
    level2: string; // 시·군·구
    level3: string; // (일반구)구
    level4L: string; // (도로)도로명, (지번)법정읍·면·동 명
    level4LC: string; // (도로)도로코드, (지번)법정읍·면·동 코드
    level4A: string; // (도로)행정읍·면·동 명, (지번)지원안함
    level4AC: string; // (도로)행정읍·면·동 코드, (지번)지원안함
    level5: string; // (도로)길, (지번)번지
    detail: string; // 상세주소
  };
}

/**
 * VWorld API 오류 응답 타입
 */
export interface VWorldApiError {
  level: number;
  code: VWorldErrorCode;
  text: string;
}

/**
 * VWorld API 오류 코드
 */
export type VWorldErrorCode =
  | "PARAM_REQUIRED" // 필수 파라미터 누락
  | "INVALID_TYPE" // 파라미터 타입 유효하지 않음
  | "INVALID_RANGE" // 파라미터 값이 유효한 범위 초과
  | "INVALID_KEY" // 등록되지 않은 인증키
  | "INCORRECT_KEY" // 인증키 정보가 올바르지 않음
  | "UNAVAILABLE_KEY" // 임시로 인증키 사용 불가
  | "OVER_REQUEST_LIMIT" // 일일 제한량 초과
  | "SYSTEM_ERROR" // 시스템 에러
  | "UNKNOWN_ERROR"; // 알 수 없는 에러

/**
 * 주소 검색 타입
 */
export type AddressType = "PARCEL" | "ROAD"; //  지번(법정동) | 도로명(행정동)

/**
 * 좌표계
 * @see https://www.vworld.kr/dev/v4dv_geocoderguide2_s001.do
 */
export type CoordinateSystem =
  | "EPSG:4326" // WGS84 경위도 (기본값, 기상청 좌표계)
  | "EPSG:900913" // Google Mercator
  | "EPSG:3857" // Web Mercator
  | "EPSG:5179" // UTM-K
  | "EPSG:5174" // Modified TM
  | "EPSG:5186"; // Korea 2000 중부원점
