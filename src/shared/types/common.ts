import { z } from "zod";

export type ParcelAddress = string;
export type RoadNameAddress = string;

export const CoordinateSchema = z.preprocess(
  (obj) => {
    if (typeof obj !== "string") return obj;
    const [lng, lat] = obj.split(",").map(Number);
    return { lat, lng };
  },
  z.object({
    lat: z.number(),
    lng: z.number(),
  })
);
export const coordinateToStringSchema = CoordinateSchema.transform((coord) => `${coord.lng},${coord.lat}`);
export type Coordinate = z.infer<typeof CoordinateSchema>;
export type CoordinateString = z.output<typeof coordinateToStringSchema>;

export type ApiResponse<T = null> = {
  error?: string;
  data: T;
};
