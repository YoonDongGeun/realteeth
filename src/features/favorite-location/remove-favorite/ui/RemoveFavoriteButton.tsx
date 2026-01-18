"use client";

import { useFavoriteLocationStore } from "@entities/favorite-location";
import { ParcelAddress } from "@shared/model";
import { IconButton } from "@shared/ui";
import { HiTrash } from "react-icons/hi2";

interface RemoveFavoriteButtonProps {
  address: ParcelAddress;
  onSuccess?: () => void;
}

export function RemoveFavoriteButton({ address, onSuccess }: RemoveFavoriteButtonProps) {
  const handleRemove = () => {
    const removeFavorite = useFavoriteLocationStore.getState().removeFavorite;
    removeFavorite(address);
    onSuccess?.();
  };

  return (
    <IconButton
      onClick={(e) => {
        e.preventDefault();
        e.stopPropagation();
        handleRemove();
      }}
      variant="danger"
      size="sm"
      icon={HiTrash}
      iconClassName="w-5 h-5"
      aria-label="즐겨찾기 삭제"
    />
  );
}
