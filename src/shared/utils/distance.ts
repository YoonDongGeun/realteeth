import { Coordinate } from "@shared/model";

function calculateDistance(coord1: Coordinate, coord2: Coordinate): number {
  const R = 6371e3; // 지구 반지름 (미터)
  const φ1 = (coord1.lat * Math.PI) / 180;
  const φ2 = (coord2.lat * Math.PI) / 180;
  const Δφ = ((coord2.lat - coord1.lat) * Math.PI) / 180;
  const Δλ = ((coord2.lng - coord1.lng) * Math.PI) / 180;

  const a = Math.sin(Δφ / 2) * Math.sin(Δφ / 2) + Math.cos(φ1) * Math.cos(φ2) * Math.sin(Δλ / 2) * Math.sin(Δλ / 2);

  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

  return R * c; // 미터 단위 거리
}

/**
 * 두 좌표가 지정된 거리 이상 떨어져 있는지 확인
 *
 * @param coord1 첫 번째 좌표
 * @param coord2 두 번째 좌표
 * @param thresholdMeters 임계값 (미터, 기본: 500m)
 * @returns 임계값 이상 떨어져 있으면 true
 */
export function isDistanceExceeded(coord1: Coordinate, coord2: Coordinate, thresholdMeters: number = 500): boolean {
  const distance = calculateDistance(coord1, coord2);
  return distance >= thresholdMeters;
}
