"use client";
import { useEffect, useRef, useCallback } from "react";
import { useLocationStore } from "@shared/lib";
import { isDistanceExceeded } from "@shared/utils";
import { Coordinate } from "@shared/types";
import { fetchMyLocation } from "../../entities/location/api/fetchMyLocation/fetchMyLocation";

export function GPSLocationProvider() {
  const { address, coordinate, setAddress, setCoordinate } = useLocationStore();
  const gpsCoordinatesRef = useRef<Coordinate | null>(null);
  const isPermittedRef = useRef<boolean | null>(null);
  const isInitialFetch = useRef(true);

  // 위치 정보 업데이트
  const updateLocation = useCallback(
    async (coordinate: Coordinate | null) => {
      try {
        const data = await fetchMyLocation(coordinate);
        if (data.data) {
          setAddress({
            name: data.data.address,
            updatedAt: data.data.updatedAt,
          });
          if (!coordinate) return;
          setCoordinate(coordinate);
        }
      } catch (error) {
        console.error("위치 정보 업데이트 실패:", error);
      }
    },
    [setAddress, setCoordinate]
  );

  // GPS 위치 가져오기
  const fetchGPSLocation = useCallback(async () => {
    if (!navigator.geolocation) {
      console.error("GPS를 지원하지 않는 브라우저입니다.");
      return;
    }
    const onGPSSuccess = (pos: GeolocationPosition) => {
      const newCoords: Coordinate = {
        lat: pos.coords.latitude,
        lng: pos.coords.longitude,
      };

      gpsCoordinatesRef.current = newCoords;
      isPermittedRef.current = true;
      const savedCoord = coordinate;

      // 저장된 위치가 없거나, 500m 이상 이동한 경우 업데이트
      if (!address || !savedCoord || isDistanceExceeded(savedCoord, newCoords, 500)) {
        updateLocation(newCoords);
      }
    };

    const onGPSFail = (err: GeolocationPositionError) => {
      console.warn(`GPS 활성화 실패 ${err.message}`);
      gpsCoordinatesRef.current = null;
      isPermittedRef.current = false;
      if (isInitialFetch.current) {
        isInitialFetch.current = false;
        updateLocation(null); // 위치 정보 비활성화
      }
    };

    navigator.geolocation.getCurrentPosition(onGPSSuccess, onGPSFail, {
      enableHighAccuracy: false,
      timeout: 7 * 1000,
      maximumAge: 60 * 1000,
    });
  }, [address, coordinate, updateLocation]);

  // 권한 변경 감지
  const watchPermission = useCallback(() => {
    if (!("permissions" in navigator)) {
      return;
    }

    navigator.permissions
      .query({ name: "geolocation" as PermissionName })
      .then((permissionStatus) => {
        permissionStatus.addEventListener("change", () => {
          if (permissionStatus.state === "granted") {
            fetchGPSLocation();
          } else if (permissionStatus.state === "denied") {
            gpsCoordinatesRef.current = null;
            isPermittedRef.current = false;
          }
        });
      })
      .catch((error) => {
        console.log("Permissions API 조회 실패:", error);
      });
  }, [fetchGPSLocation]);

  // 초기화
  useEffect(() => {
    fetchGPSLocation();
    watchPermission();
  }, [fetchGPSLocation, watchPermission]);

  return null;
}
