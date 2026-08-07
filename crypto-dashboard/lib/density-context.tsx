"use client";

import { createContext, useContext, useEffect, useState } from "react";

export type Density = "clean" | "advanced";

const DENSITY_COOKIE = "vaultline-density";

const DensityContext = createContext<{
  density: Density;
  setDensity: (d: Density) => void;
}>({ density: "clean", setDensity: () => {} });

function readCookie(): Density {
  if (typeof document === "undefined") return "clean";
  const match = document.cookie.match(new RegExp(`${DENSITY_COOKIE}=(clean|advanced)`));
  return (match?.[1] as Density) ?? "clean";
}

export function DensityProvider({ children }: { children: React.ReactNode }) {
  const [density, setDensityState] = useState<Density>("clean");

  useEffect(() => {
    setDensityState(readCookie());
  }, []);

  const setDensity = (d: Density) => {
    setDensityState(d);
    if (typeof document !== "undefined") {
      document.cookie = `${DENSITY_COOKIE}=${d}; path=/; max-age=31536000`;
    }
  };

  return <DensityContext.Provider value={{ density, setDensity }}>{children}</DensityContext.Provider>;
}

export function useDensity() {
  return useContext(DensityContext);
}
