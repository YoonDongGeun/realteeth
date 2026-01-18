"use client";
import { useEffect, useRef, useCallback } from "react";

import { Coordinate, useLocationStore } from "@shared/model";
import { fetchMyLocation } from "../../entities/location/api/fetchMyLocation/fetchMyLocation";
import { useMutation } from "@tanstack/react-query";

export function GPSLocationProvider() {
  const { setLocation } = useLocationStore();
  const { mutateAsync: getMyLocation } = useMutation({
    mutationKey: ["location"],
    mutationFn: fetchMyLocation,
  });
  const gpsCoordinatesRef = useRef<Coordinate | null>(null);
  const isPermittedRef = useRef<boolean | null>(null);
  const isInitialFetch = useRef(true);

  // 위치 정보 업데이트
  const updateLocation = useCallback(
    async (coordinate: Coordinate | null) => {
      try {
        const data = await getMyLocation(coordinate);
        if (data.data) {
          setLocation({
            address: data.data.address,
            updatedAt: data.data.updatedAt,
          });
        }
      } catch (error) {
        console.error("위치 정보 업데이트 실패:", error);
      }
    },
    [setLocation, getMyLocation]
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
  }, [updateLocation]);

  // 권한 변경 감지 후 켜지면 위치 업데이트
  const watchPermission = useCallback(() => {
    if (!("permissions" in navigator)) {
      return;
    }

    let permissionStatus: PermissionStatus | null = null;

    const handlePermissionChange = () => {
      if (permissionStatus?.state === "granted") {
        fetchGPSLocation();
      } else if (permissionStatus?.state === "denied") {
        gpsCoordinatesRef.current = null;
        isPermittedRef.current = false;
      }
    };

    navigator.permissions
      .query({ name: "geolocation" as PermissionName })
      .then((status) => {
        permissionStatus = status;
        permissionStatus.addEventListener("change", handlePermissionChange);
      })
      .catch((error) => {
        console.log("Permissions API 조회 실패:", error);
      });
    return () => {
      if (permissionStatus) {
        permissionStatus.removeEventListener("change", handlePermissionChange);
      }
    };
  }, [fetchGPSLocation]);

  useEffect(() => {
    fetchGPSLocation();
    const cleanup = watchPermission();

    return cleanup;
  }, [fetchGPSLocation, watchPermission]);

  return null;
}
