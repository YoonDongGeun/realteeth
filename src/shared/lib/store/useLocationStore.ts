import { Coordinate } from "@shared/types";
import { create } from "zustand";
import { persist } from "zustand/middleware";

type Address = {
  name: string;
  updatedAt: string; // ISO 8601 형식
} | null;

interface LocationStore {
  // 위치 정보 (localStorage 저장)
  address: Address;
  coordinate: Coordinate | null;

  // Actions
  setAddress: (address: Address) => void;
  clearAddress: () => void;
  setCoordinate: (coordinate: Coordinate) => void;
}

/**
 * 위치 정보를 localStorage에 저장하는 Zustand Store
 * GPS 좌표는 Provider에서 ref로 관리
 */
export const useLocationStore = create<LocationStore>()(
  persist(
    (set) => ({
      address: null,
      coordinate: null,

      setAddress: (address) => {
        set({ address });
      },

      clearAddress: () => {
        set({ address: null });
      },

      setCoordinate: (coordinate) => {
        set({ coordinate });
      },
    }),
    {
      name: "location-storage",
    }
  )
);
