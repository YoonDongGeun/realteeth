"use client";

import { useFavoriteLocationStore } from "@entities/favorite-location";
import { ParcelAddress } from "@shared/model";
import { IconButton } from "@shared/ui";
import { AiOutlineLoading } from "react-icons/ai";
import { HiStar } from "react-icons/hi2";
import { useShallow } from "zustand/shallow";

interface AddFavoriteButtonProps {
  address: ParcelAddress;
  onSuccess?: () => void;
  onError?: (reason: "duplicate" | "limit") => void;
}

export function AddFavoriteButton({ address, onSuccess, onError }: AddFavoriteButtonProps) {
  const { isFavorited, canAdd, hydrated } = useFavoriteLocationStore(
    useShallow((state) => ({
      isFavorited: state.isFavorite(address),
      canAdd: state.canAddMore(),
      hydrated: state._hydrated,
    }))
  );

  const { addFavorite, removeFavorite } = useFavoriteLocationStore.getState();

  const handleToggle = () => {
    if (isFavorited) {
      removeFavorite(address);
      onSuccess?.();
      return;
    }

    if (!canAdd) {
      onError?.("limit");
      return;
    }

    const success = addFavorite({ address, alias: address });
    if (success) {
      onSuccess?.();
    } else {
      onError?.("limit");
    }
  };

  if (!hydrated) {
    return <SkeletonButton />;
  }

  const disabled = !isFavorited && !canAdd;

  return (
    <IconButton
      onClick={handleToggle}
      disabled={disabled}
      variant={isFavorited ? "favorite" : "default"}
      icon={HiStar}
      iconClassName={isFavorited ? "fill-current" : ""}
      aria-label={isFavorited ? "즐겨찾기 제거" : disabled ? "즐겨찾기 최대 개수 초과" : "즐겨찾기 추가"}
      title={disabled ? "최대 6개까지 추가할 수 있습니다" : undefined}
    />
  );
}

const SkeletonButton = () => (
  <IconButton
    disabled
    variant="default"
    icon={AiOutlineLoading}
    iconClassName="animate-spin opacity-75"
    aria-label="즐겨찾기 로딩 중"
  />
);
