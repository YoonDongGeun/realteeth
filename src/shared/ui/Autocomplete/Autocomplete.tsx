"use client";

import { Combobox, ComboboxInput, ComboboxOption, ComboboxOptions } from "@headlessui/react";
import { RefObject, useRef } from "react";
import { cn } from "@shared/utils";

export interface AutocompleteOption {
  value: string;
  label: string;
}

interface AutocompleteProps {
  options: AutocompleteOption[];
  query: string;
  value: AutocompleteOption | null;
  onChange: (option: AutocompleteOption | null) => void;
  onQueryChange?: (query: string) => void;
  placeholder?: string;
  emptyMessage?: string;
  maxResults?: number;
  debounceMs?: number;
  throttleMs?: number;
  ref?: RefObject<HTMLInputElement | null>;
}

export function Autocomplete({
  options,
  value,
  query,
  onChange,
  onQueryChange,
  placeholder = "검색...",
  emptyMessage = "검색 결과가 없습니다.",
  maxResults = 10,
  debounceMs = 300,
  throttleMs = 500,
  ref,
}: AutocompleteProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const debounceTimerRef = useRef<NodeJS.Timeout | null>(null);
  const lastExecutedTimeRef = useRef<number>(0);

  const handleQueryChange = (newQuery: string) => {
    if (!onQueryChange) return;

    const now = Date.now();
    const timeSinceLastExecution = now - lastExecutedTimeRef.current;

    // Throttle: 최대 throttleMs마다 최소 1번은 실행
    if (timeSinceLastExecution >= throttleMs) {
      lastExecutedTimeRef.current = now;
      onQueryChange(newQuery);

      if (debounceTimerRef.current) {
        clearTimeout(debounceTimerRef.current);
        debounceTimerRef.current = null;
      }
      return;
    }

    // Debounce: 타이핑 멈춘 후 debounceMs 후 실행
    if (debounceTimerRef.current) {
      clearTimeout(debounceTimerRef.current);
    }

    debounceTimerRef.current = setTimeout(() => {
      lastExecutedTimeRef.current = Date.now();
      onQueryChange(newQuery);
    }, debounceMs);
  };

  const displayedOptions = options.slice(0, maxResults);

  return (
    <Combobox value={value} onChange={onChange}>
      <div className="relative w-full">
        <ComboboxInput
          className={cn(
            "w-full rounded-lg border-2 border-neutral-300 bg-background",
            "px-4 py-2.5 text-base text-foreground",
            "placeholder:text-neutral-400",
            "focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500/30",
            "transition-all"
          )}
          displayValue={(option: AutocompleteOption | null) => option?.label ?? ""}
          onChange={(event) => handleQueryChange(event.target.value)}
          placeholder={placeholder}
          ref={(node) => {
            inputRef.current = node;
            if (ref) ref.current = node;
          }}
          autoComplete="off"
        />
        <ComboboxOptions
          className={cn(
            "absolute z-10 mt-2 w-full",
            "max-h-120 overflow-auto",
            "rounded-lg border-2 border-neutral-200 bg-background",
            "py-1 shadow-lg",
            "empty:hidden"
          )}
        >
          {displayedOptions.length === 0 && query !== "" ? (
            <div className={cn("px-4 py-3 text-sm font-medium text-neutral-500")}>{emptyMessage}</div>
          ) : (
            displayedOptions.map((option) => (
              <ComboboxOption
                key={option.value}
                value={option}
                className={({ focus }) =>
                  cn(
                    "cursor-pointer px-4 py-2.5",
                    "font-medium transition-colors",
                    focus ? "bg-primary-500 text-white" : "text-foreground hover:bg-neutral-100"
                  )
                }
              >
                {option.label}
              </ComboboxOption>
            ))
          )}
        </ComboboxOptions>
      </div>
    </Combobox>
  );
}
