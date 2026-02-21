"use client";

import { createContext, useContext, useState, useMemo } from "react";
import { LAUNCH_DATE } from "@/lib/constants";

interface DebugDateContextValue {
  adjustedDate: Date;
  dateOffset: number;
  setDateOffset: React.Dispatch<React.SetStateAction<number>>;
}

const DebugDateContext = createContext<DebugDateContextValue>({
  adjustedDate: LAUNCH_DATE,
  dateOffset: 0,
  setDateOffset: () => {},
});

export function DebugDateProvider({ children }: { children: React.ReactNode }) {
  const [dateOffset, setDateOffset] = useState(0);

  const adjustedDate = useMemo(() => {
    if (dateOffset === 0) return LAUNCH_DATE;
    const d = new Date(LAUNCH_DATE.getTime());
    d.setSeconds(d.getSeconds() + dateOffset);
    return d;
  }, [dateOffset]);

  return (
    <DebugDateContext.Provider value={{ adjustedDate, dateOffset, setDateOffset }}>
      {children}
    </DebugDateContext.Provider>
  );
}

export function useDebugDate() {
  return useContext(DebugDateContext);
}
