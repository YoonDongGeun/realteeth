import { create } from "zustand";
import { persist } from "zustand/middleware";

type Location = {
  address: string;
  updatedAt: string; // ISO 8601 형식
} | null;

interface LocationStore {
  // 위치 정보 (localStorage 저장)
  location: Location;
  _rehydrated: boolean;
  // Actions
  setLocation: (location: Location) => void;
  clearLocation: () => void;
  _setRehydrated: (rehydrated: boolean) => void;
}

/**
 * 위치 정보를 localStorage에 저장하는 Zustand Store
 * GPS 좌표는 Provider에서 ref로 관리
 */
export const useLocationStore = create<LocationStore>()(
  persist(
    (set) => ({
      location: null,
      _rehydrated: false,

      setLocation: (location) => {
        set({ location });
      },

      clearLocation: () => {
        set({ location: null });
      },
      _setRehydrated: (rehydrated) => {
        set({ _rehydrated: rehydrated });
      },
    }),
    {
      name: "location-storage",
      onRehydrateStorage: () => (state) => {
        state?._setRehydrated(true);
      },
    }
  )
);
