"use client";
import { useEffect } from "react";

import { useLocationStore } from "@shared/model";

export function GPSLocationProvider() {
  const { fetchGPSLocation } = useLocationStore();

  useEffect(() => {
    fetchGPSLocation();
  }, [fetchGPSLocation]);

  return null;
}
