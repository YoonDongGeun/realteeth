"use client";
import { useDeferredValue, useMemo, useState, useEffect } from "react";
import Fuse, { FuseResultMatch, IFuseOptions } from "fuse.js";
import { normalizeHangul } from "@shared/lib";
import { ParcelAddress } from "@shared/model";

export interface AddressSearchResult {
  fullName: ParcelAddress;
  matches?: readonly FuseResultMatch[];
}

const fuseOptions: IFuseOptions<string> = {
  threshold: 0.7,
  distance: 200,
  minMatchCharLength: 1,
  includeMatches: true,
};

// 클라이언트 파일 버저닝
const DB_VERSION = "20260118";

export function useAddressSearch(maxResults: number = 10) {
  const [query, setQuery] = useState("");
  const defferedQuery = useDeferredValue(query);
  const [isDataLoaded, setIsDataLoaded] = useState(false);
  const [districtsData, setDistrictsData] = useState<string[]>([]);

  // Load data when user starts typing
  useEffect(() => {
    if (!isDataLoaded) {
      fetch(`/data/korea_districts.json?v=${DB_VERSION}`, {
        cache: "force-cache",
      })
        .then((res) => res.json())
        .then((data) => {
          setDistrictsData(data);
          setIsDataLoaded(true);
        });
    }
  }, [defferedQuery, isDataLoaded]);

  const fuse = useMemo(() => {
    if (!isDataLoaded || districtsData.length === 0) {
      return null;
    }
    return new Fuse(districtsData, fuseOptions);
  }, [isDataLoaded, districtsData]);

  const results = useMemo<AddressSearchResult[]>(() => {
    const trimmedQuery = defferedQuery.trim();

    if (!trimmedQuery || !fuse) {
      return [];
    }

    const normalizedQuery = normalizeHangul(trimmedQuery);

    const chosungResults = fuse
      .search(`${normalizedQuery}`)
      .map((result) => ({
        fullName: result.item,
        matches: result.matches,
      }))
      .slice(0, maxResults);

    return chosungResults;
  }, [defferedQuery, fuse, maxResults]);

  return {
    query: defferedQuery,
    setQuery,
    results,
    isLoading: !isDataLoaded && !!defferedQuery.trim(),
  };
}
