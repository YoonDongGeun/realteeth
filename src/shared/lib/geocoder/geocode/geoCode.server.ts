import Fuse from "fuse.js";
import ADDRESS_COORDINATES_DATA from "./addressCoordinates.json";
import { Coordinate } from "@shared/model";

/** @param address - "서울특별시 종로구 청운효자동", "경상남도 의령군 궁류면 평촌리" */
export function geoCode(address: string): Coordinate {
  // 법정동의 읍/동/면 단위까지만 검색
  const addressToSearch = address.split(" ").slice(0, 3).join(" ");

  const result = coordinatesSearcherByAddress.search(addressToSearch).at(0);
  if (!result?.item) throw new Error("없는 주소입니다.");

  const [lng, lat] = result.item.value.split(",") as [string, string];
  return { lat: Number(lat), lng: Number(lng) };
}

const coordinatesSearcherByAddress = new Fuse(ADDRESS_COORDINATES_DATA, {
  keys: ["name"],
  location: 0,
  distance: 5,
  threshold: 0.6,
});
