"use client";

import { useFavoriteLocationStore } from "@entities/favorite-location";
import { ParcelAddress } from "@shared/model";
import { useState, useRef, useEffect } from "react";
import { Input } from "@shared/ui";

interface EditAliasInputProps {
  address: ParcelAddress;
  currentAlias?: string;
  onSuccess?: () => void;
}

export function EditAliasInput({ address, currentAlias = "", onSuccess }: EditAliasInputProps) {
  const [alias, setAlias] = useState(currentAlias);
  const [isEditing, setIsEditing] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isEditing) {
      inputRef.current?.focus();
      inputRef.current?.select();
    }
  }, [isEditing]);

  const handleSave = () => {
    const trimmedAlias = alias.trim();
    if (trimmedAlias !== currentAlias) {
      const updateAlias = useFavoriteLocationStore.getState().updateAlias;
      updateAlias(address, trimmedAlias);
      onSuccess?.();
    }
    setIsEditing(false);
  };

  const handleCancel = () => {
    setAlias(currentAlias);
    setIsEditing(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleSave();
    } else if (e.key === "Escape") {
      handleCancel();
    }
  };

  if (!isEditing) {
    return (
      <button
        onClick={() => setIsEditing(true)}
        className="text-sm text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100 transition-colors cursor-pointer border-b border-dashed border-zinc-300 dark:border-zinc-600 hover:border-zinc-500 dark:hover:border-zinc-400"
      >
        {alias || "별칭 추가"}
      </button>
    );
  }

  return (
    <Input
      ref={inputRef}
      type="text"
      value={alias}
      onChange={(e) => setAlias(e.target.value)}
      onBlur={handleSave}
      onKeyDown={handleKeyDown}
      placeholder="별칭 입력"
      maxLength={20}
      className="text-sm w-full max-w-50"
    />
  );
}
