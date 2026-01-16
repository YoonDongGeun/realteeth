import { z } from "zod";

export type ParcelAddress = string;
export type RoadNameAddress = string;

const CoordinateSchema = z.object({
  lat: z.number(),
  lng: z.number(),
});

export const coordinateToStringSchema = CoordinateSchema.transform((coord) => `${coord.lng},${coord.lat}`);
export type Coordinate = z.infer<typeof CoordinateSchema>;
