import { geoCode } from "./geocode/geoCode.server";
import { reverseGeoCode } from "./reverseGeocode/reverseGeoCode.server";

export const geocoder = {
  geoCode,
  reverseGeoCode,
};
