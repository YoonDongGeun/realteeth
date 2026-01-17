import { Coordinate } from "@shared/types";

type Response = {
  lat: number;
  lon: number;
  countryCode: string;
};

// ThidParty
export async function fetchLocationFromIP(ip: string): Promise<{ coordinate: Coordinate; isKorea: boolean }> {
  const response = await fetch(`http://ip-api.com/json/${ip}`);

  const data: Response = await response.json();
  return {
    coordinate: {
      lat: data.lat,
      lng: data.lon,
    },
    isKorea: data.countryCode === "KR",
  };
}
