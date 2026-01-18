import { Coordinate, coordinateToStringSchema } from "@shared/model";
import { QueryStringBuilder } from "../../../query-builder";
import { AddressType, CoordinateSystem, VWorldAddressItem, VWorldApiResponse } from "./type";

const API_BASE_URL = "https://api.vworld.kr/req/address";

const getApiKey = () => {
  const apiKey = process.env.VWORLD_API_KEY;
  if (!apiKey) {
    throw new Error("VWORLD_API_KEY is not defined in environment variables");
  }
  return apiKey;
};

export const fetchParcelAddressByCoordinate = async (coordinate: Coordinate) => {
  const coordType: CoordinateSystem = "EPSG:4326"; // 기상청이 쓰는 좌표계
  const addressType: AddressType = "PARCEL"; // 법정동 주소
  const url = new QueryStringBuilder(API_BASE_URL)
    .setMany({
      service: "address",
      request: "getaddress",
      version: "2.0",
      key: getApiKey(),
      format: "json",
      errorformat: "json",
      type: addressType,
      simple: true,
      crs: coordType, // 기상청 좌표계
      point: coordinateToStringSchema.parse(coordinate), // 경도,위도
    })
    .build();
  const response = await fetch(url);
  const data = (await response.json()) as VWorldApiResponse;

  if (data.response.status === "ERROR") {
    throw new Error(data.response.error.text);
  }
  if (data.response.status === "NOT_FOUND") {
    throw new Error("찾을 수 없는 지역입니다.");
  }
  const addressData = data.response.result[0];
  const parcelAddress = extractParcelAddress(addressData);

  return parcelAddress;
};

const extractParcelAddress = (addressData: VWorldAddressItem) => {
  const fullAddress = addressData.text;
  const parcelAddressSplit = fullAddress.split(" ").slice(0, 4);

  const lastPart = parcelAddressSplit[3];
  // ex) 전북특별자치도 순창군 인계면 갑동리 산 17 vs 서울특별시 종로구 종로1가 54
  const shouldIncludeLastPart = lastPart?.endsWith("리");

  const parcelAddress = shouldIncludeLastPart ? parcelAddressSplit.join(" ") : parcelAddressSplit.slice(0, 3).join(" ");
  return parcelAddress;
};
