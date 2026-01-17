import { Coordinate } from "@shared/model";
import { GridCoordinate } from "../types";

/** 기상청 격자 좌표 변환 상수 */
const GRID_PARAMS = {
  /** 격자 간격 (km) */
  GRID: 5.0,
  /** 투영 위도1 (degree) */
  SLAT1: 30.0,
  /** 투영 위도2 (degree) */
  SLAT2: 60.0,
  /** 투영 원점 위도 (degree) */
  OLAT: 38.0,
  /** 투영 원점 경도 (degree) */
  OLON: 126.0,
  /** 기준점 X좌표 */
  XO: 43,
  /** 기준점 Y좌표 */
  YO: 136,
  /** 지구 반경 (km) */
  RADIUS: 6371.00877,
} as const;

const DEGRAD = Math.PI / 180.0;
const RADDEG = 180.0 / Math.PI;

/** Lambert Conformal Conic 투영법 클래스 */
class LambertProjection {
  private readonly re: number;
  private readonly sn: number;
  private readonly sf: number;
  private readonly ro: number;
  private readonly olon: number;

  constructor() {
    this.re = GRID_PARAMS.RADIUS / GRID_PARAMS.GRID;

    const slat1 = GRID_PARAMS.SLAT1 * DEGRAD;
    const slat2 = GRID_PARAMS.SLAT2 * DEGRAD;
    const olat = GRID_PARAMS.OLAT * DEGRAD;
    this.olon = GRID_PARAMS.OLON * DEGRAD;

    // 투영 상수 계산 (sn)
    const sn = Math.tan(Math.PI * 0.25 + slat2 * 0.5) / Math.tan(Math.PI * 0.25 + slat1 * 0.5);
    this.sn = Math.log(Math.cos(slat1) / Math.cos(slat2)) / Math.log(sn);

    // 투영 상수 계산 (sf)
    const sf = Math.tan(Math.PI * 0.25 + slat1 * 0.5);
    this.sf = (Math.pow(sf, this.sn) * Math.cos(slat1)) / this.sn;

    // 투영 원점 거리 계산 (ro)
    const ro = Math.tan(Math.PI * 0.25 + olat * 0.5);
    this.ro = (this.re * this.sf) / Math.pow(ro, this.sn);
  }

  /** WGS84 경위도를 기상청 격자 좌표로 변환 */
  toGridCoordinate(coordinate: Coordinate): GridCoordinate {
    const { lat, lng } = coordinate;
    // 위도로부터 거리 계산
    let ra = Math.tan(Math.PI * 0.25 + lat * DEGRAD * 0.5);
    ra = (this.re * this.sf) / Math.pow(ra, this.sn);

    // 경도로부터 각도 계산
    let theta = lng * DEGRAD - this.olon;
    if (theta > Math.PI) theta -= 2.0 * Math.PI;
    if (theta < -Math.PI) theta += 2.0 * Math.PI;
    theta *= this.sn;

    // 격자 좌표 계산
    const nx = Math.floor(ra * Math.sin(theta) + GRID_PARAMS.XO + 0.5);
    const ny = Math.floor(this.ro - ra * Math.cos(theta) + GRID_PARAMS.YO + 0.5);

    return { nx, ny };
  }

  /** 기상청 격자 좌표를 WGS84 경위도로 변환 */
  toLatLon(gridCoordinate: GridCoordinate): Coordinate {
    const { nx, ny } = gridCoordinate;
    const xn = nx - GRID_PARAMS.XO;
    const yn = this.ro - ny + GRID_PARAMS.YO;
    const ra = Math.sqrt(xn * xn + yn * yn);

    // 위도 계산
    let alat = Math.pow((this.re * this.sf) / ra, 1.0 / this.sn);
    alat = 2.0 * Math.atan(alat) - Math.PI * 0.5;

    // 경도 계산
    let theta = 0.0;
    if (Math.abs(xn) <= 0.0) {
      theta = 0.0;
    } else {
      if (Math.abs(yn) <= 0.0) {
        theta = Math.PI * 0.5;
        if (xn < 0.0) theta = -theta;
      } else {
        theta = Math.atan2(xn, yn);
      }
    }
    const alon = theta / this.sn + this.olon;

    return {
      lat: alat * RADDEG,
      lng: alon * RADDEG,
    };
  }
}

/**
 * Lambert Conformal Conic 투영법 적용을 위한 값들이 계산된 컨텍스트 제공.
 */
const lambertProjection = new LambertProjection();

/**
 * WGS84 경위도를 기상청 격자 좌표로 변환
 */
export function convertToGrid(coordinate: Coordinate): GridCoordinate {
  return lambertProjection.toGridCoordinate(coordinate);
}

/**
 * 기상청 격자 좌표를 WGS84 경위도로 변환

 */
export function convertToLatLon(gridCoordinate: GridCoordinate): Coordinate {
  return lambertProjection.toLatLon(gridCoordinate);
}
