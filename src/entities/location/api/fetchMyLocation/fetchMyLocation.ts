import { ApiResponse, Coordinate, ParcelAddress } from "@shared/types";

import { QueryStringBuilder } from "@shared/lib";
export type MyLocationApiResponse = ApiResponse<{
  address: ParcelAddress;
  updatedAt: string;
}>;
export type MyLocationApiSearchParams = Coordinate | null;

export const fetchMyLocation = async (coordinate: Coordinate | null) => {
  const searchParams: MyLocationApiSearchParams = coordinate;

  const url = new QueryStringBuilder()
    .endpoint("/api/my-location")
    .setMany(searchParams || {})
    .build();

  const response = await fetch(url);
  const data: MyLocationApiResponse = await response.json();

  return data;
};
