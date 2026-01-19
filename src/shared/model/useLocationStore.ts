import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { Coordinate } from "./types/common";
import { fetchMyLocation } from "../../entities/location/api/fetchMyLocation/fetchMyLocation";

type Location = {
  address: string;
  updatedAt: string; // ISO 8601 형식
} | null;

interface LocationStore {
  // 위치 정보 (localStorage 저장)
  location: Location;
  isFetchTried: boolean;
  isGpsRefreshing: boolean;
  _rehydrated: boolean;
  // Actions
  setLocation: (location: Location) => void;
  clearLocation: () => void;
  _setRehydrated: (rehydrated: boolean) => void;
  setIsFetchTried: () => void;
  fetchGPSLocation: () => Promise<void>;
}

/**
 * 위치 정보를 localStorage에 저장하는 Zustand Store
 * GPS 좌표는 Provider에서 ref로 관리
 */
export const useLocationStore = create<LocationStore>()(
  persist(
    (set, get) => ({
      location: null,
      _rehydrated: false,
      isFetchTried: false,
      isGpsRefreshing: false,

      setLocation: (location) => {
        set({ location });
      },

      clearLocation: () => {
        set({ location: null });
      },
      _setRehydrated: (rehydrated) => {
        set({ _rehydrated: rehydrated });
      },
      setIsFetchTried: () => {
        set({ isFetchTried: true });
      },
      fetchGPSLocation: async () => {
        // 이미 실행 중이면 중복 호출 방지
        if (get().isGpsRefreshing) {
          console.log("GPS 위치 조회가 이미 진행 중입니다.");
          return;
        }

        set({ isGpsRefreshing: true });

        // GPS를 지원하지 않는 브라우저
        if (!navigator.geolocation) {
          console.error("GPS를 지원하지 않는 브라우저입니다.");
          await fetchMyLocation(null)
            .then(({ data: location }) => {
              set({ location, isFetchTried: true });
            })
            .catch(() => {
              set({ location: null, isFetchTried: true });
            })
            .finally(() => {
              set({ isGpsRefreshing: false });
            });
          return;
        }

        const onGPSSuccess = async (pos: GeolocationPosition) => {
          const newCoords: Coordinate = {
            lat: pos.coords.latitude,
            lng: pos.coords.longitude,
          };
          await fetchMyLocation(newCoords)
            .then(({ data: location }) => {
              set({ location, isFetchTried: true });
            })
            .catch(() => {
              set({ location: null, isFetchTried: true });
            })
            .finally(() => {
              set({ isGpsRefreshing: false });
            });
        };
        const onGPSFail = async (err: GeolocationPositionError) => {
          console.warn(`GPS 활성화 실패 ${err.message}`);
          await fetchMyLocation(null)
            .then(({ data: location }) => {
              set({ location, isFetchTried: true });
            })
            .catch(() => {
              set({ location: null, isFetchTried: true });
            })
            .finally(() => {
              set({ isGpsRefreshing: false });
            });
        };
        navigator.geolocation.getCurrentPosition(onGPSSuccess, onGPSFail, {
          enableHighAccuracy: false,
          timeout: 3 * 1000,
          maximumAge: 10 * 1000,
        });
      },
    }),
    {
      name: "location-storage",
      onRehydrateStorage: () => (state) => {
        state?._setRehydrated(true);
      },
      partialize: (state) => ({
        location: state.location,
      }),
    }
  )
);
