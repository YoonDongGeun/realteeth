import { fetchLocationFromIP } from "./thirdPartyApi/fetchLocationFromIP.server";

export const ipLocationConvertService = {
  fetchLocationFromIP,
} as const;
