/**
 * 지역 정보
 * 예: "서울특별시-종로구-청운동"
 */
export interface Location {
  /** 전체 지역명 (하이픈으로 구분된 문자열) */
  fullName: string;
  /** 시/도 */
  city: string;
  /** 구/군 (선택) */
  district?: string;
  /** 동/읍/면 (선택) */
  neighborhood?: string;
}

/**
 * 즐겨찾기 장소
 */
export interface FavoriteLocation extends Location {
  /** 고유 ID */
  id: string;
  /** 사용자 지정 별칭 */
  alias?: string;
  /** 추가된 시간 */
  createdAt: string;
}
