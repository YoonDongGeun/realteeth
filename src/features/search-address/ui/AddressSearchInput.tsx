"use client";

import { useState, useMemo } from "react";
import { Autocomplete, type AutocompleteOption } from "@shared/ui/Autocomplete";
import { useAddressSearch } from "../hooks/useAddressSearch";

interface CitySearchInputProps {
  onSelect: (cityName: string) => void;
  placeholder?: string;
  maxResults?: number;
}

export function AddressSearchInput({
  onSelect,
  placeholder = "장소를 검색하세요 (예: 서울특별시, 종로구, 청운동)",
  maxResults = 10,
}: CitySearchInputProps) {
  const { query, setQuery, results } = useAddressSearch(maxResults);
  const [selectedOption, setSelectedOption] = useState<AutocompleteOption | null>(null);

  const options = useMemo<AutocompleteOption[]>(
    () =>
      results.map((result) => ({
        value: result.fullName,
        label: result.fullName,
      })),
    [results]
  );

  const handleChange = (option: AutocompleteOption | null) => {
    setSelectedOption(option);
    if (option) {
      onSelect(option.value);
    }
  };

  return (
    <Autocomplete
      options={options}
      query={query}
      value={selectedOption}
      onChange={handleChange}
      onQueryChange={setQuery}
      placeholder={placeholder}
      emptyMessage="검색 결과가 없습니다."
      maxResults={maxResults}
    />
  );
}
