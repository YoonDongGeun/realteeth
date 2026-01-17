"use client";
import { PropsWithChildren } from "react";

import { QueryClientProvider } from "./QueryClientProvider";
import { GPSLocationProvider } from "./GPSLocationProvider";

export function Providers({ children }: PropsWithChildren) {
  return (
    <QueryClientProvider>
      <GPSLocationProvider />
      {children}
    </QueryClientProvider>
  );
}
