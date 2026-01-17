import "server-only";
import { Coordinate, ParcelAddress } from "@shared/model";
import { fetchParcelAddressByCoordinate } from "./thirdpartyApi/fetchParcelAddressByCoordinate";

export async function reverseGeoCode(coordinate: Coordinate): Promise<ParcelAddress> {
  const parcelAddress = await fetchParcelAddressByCoordinate(coordinate);

  return parcelAddress;
}
