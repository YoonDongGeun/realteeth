import { create } from "zustand";
import { persist } from "zustand/middleware";
import { FavoriteLocation } from "./types";
import { ParcelAddress } from "@shared/model";

const MAX_FAVORITES = 6;

interface FavoriteLocationStore {
  favorites: FavoriteLocation[];
  _hydrated: boolean;
  // Actions
  addFavorite: (location: FavoriteLocation) => boolean;
  removeFavorite: (address: ParcelAddress) => void;
  updateAlias: (address: ParcelAddress, alias: string) => void;
  isFavorite: (address: ParcelAddress) => boolean;
  canAddMore: () => boolean;
  getFavorite: (address: ParcelAddress) => FavoriteLocation | undefined;
  _setHydrated: (value: boolean) => void;
}

/**
 * 즐겨찾기 위치 관리 Store
 * - 최대 6개까지 저장 가능
 * - address를 unique id로 사용
 */
export const useFavoriteLocationStore = create<FavoriteLocationStore>()(
  persist(
    (set, get) => ({
      favorites: [],
      _hydrated: false,
      addFavorite: (location) => {
        const { favorites } = get();

        // 최대 개수 체크
        if (favorites.length >= MAX_FAVORITES) {
          return false;
        }

        // 중복 체크
        if (favorites.some((fav) => fav.address === location.address)) {
          return false;
        }

        set({ favorites: [...favorites, location] });
        return true;
      },

      removeFavorite: (address) => {
        set((state) => ({
          favorites: state.favorites.filter((fav) => fav.address !== address),
        }));
      },

      updateAlias: (address, alias) => {
        set((state) => ({
          favorites: state.favorites.map((fav) => (fav.address === address ? { ...fav, alias } : fav)),
        }));
      },

      isFavorite: (address) => {
        return get().favorites.some((fav) => fav.address === address);
      },

      canAddMore: () => {
        return get().favorites.length < MAX_FAVORITES;
      },

      getFavorite: (address) => {
        return get().favorites.find((fav) => fav.address === address);
      },
      _setHydrated: (value) => {
        set(() => ({
          _hydrated: value,
        }));
      },
    }),
    {
      name: "favorite-locations",
      onRehydrateStorage: () => (state) => {
        state?._setHydrated(true);
      },
    }
  )
);
