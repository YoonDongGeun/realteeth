"use client";

import { useFavoriteLocationStore } from "@entities/favorite-location";
import { FavoriteAddressWeatherCard } from "./FavoriteAddressWeatherCard";
import { useShallow } from "zustand/shallow";

export function FavoriteAddressWeatherList() {
  const { favorites, _hydrated } = useFavoriteLocationStore(
    useShallow((state) => ({ favorites: state.favorites, _hydrated: state._hydrated }))
  );
  const count = _hydrated ? favorites.length : 0;
  let content: React.ReactNode;
  if (!_hydrated) {
    content = <LoadingList />;
  } else if (favorites.length === 0) {
    content = <BlankList />;
  } else {
    content = (
      <ul className="grid gap-3" role="list">
        {favorites.map((favorite) => (
          <li key={favorite.address}>
            <FavoriteAddressWeatherCard address={favorite.address} alias={favorite.alias || favorite.address} />
          </li>
        ))}
      </ul>
    );
  }

  return (
    <section aria-labelledby="favorites-heading" className="flex flex-col gap-3">
      <h3 id="favorites-heading" className="text-zinc-900 dark:text-zinc-100 font-semibold px-1">
        즐겨찾기 ({count})
      </h3>
      {content}
    </section>
  );
}

const LoadingList = () => (
  <ul className="grid gap-3" role="list" aria-label="즐겨찾기 로딩 중">
    {[1, 2, 3].map((i) => (
      <li key={i}>
        <div className="h-24 bg-zinc-100 dark:bg-zinc-800 rounded-2xl animate-pulse" aria-hidden="true" />
      </li>
    ))}
  </ul>
);

const BlankList = () => (
  <div className="text-center py-8 bg-zinc-50 dark:bg-zinc-800/50 rounded-2xl border border-dashed border-zinc-200 dark:border-zinc-700">
    <p className="text-zinc-500 text-sm">즐겨찾는 장소가 없습니다.</p>
  </div>
);
