import { Coordinate } from "@shared/model";

type Response = {
  latitude: number;
  longitude: number;
  countryCode: string;
};

// ThidParty
export async function fetchLocationFromIP(ip: string): Promise<{ coordinate: Coordinate; isKorea: boolean }> {
  const response = await fetch(`https://free.freeipapi.com/api/json/${ip}`);

  const data: Response = await response.json();

  return {
    coordinate: {
      lat: data.latitude,
      lng: data.longitude,
    },
    isKorea: data.countryCode === "KR",
  };
}
