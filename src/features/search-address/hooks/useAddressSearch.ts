import { useDeferredValue, useMemo, useState } from "react";
import Fuse, { FuseResultMatch, IFuseOptions } from "fuse.js";
import KOREA_DISTRICTS_DATA from "../korea_districts.json";
import { normalizeHangul } from "@shared/lib";
import { ParcelAddress } from "@shared/types";

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

export function useAddressSearch(maxResults: number = 10) {
  const [query, setQuery] = useState("");
  const defferedQuery = useDeferredValue(query);

  const fuse = useMemo(() => new Fuse(KOREA_DISTRICTS_DATA, fuseOptions), []);
  const results = useMemo<AddressSearchResult[]>(() => {
    const trimmedQuery = defferedQuery.trim();

    if (!trimmedQuery) {
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
  };
}
