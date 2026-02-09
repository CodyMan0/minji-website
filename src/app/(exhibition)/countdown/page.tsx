"use client";

import { useCountdown } from "@/hooks/useCountdown";
import { LAUNCH_DATE } from "@/lib/constants";

export default function CountdownPage() {
  const { days, hours, minutes, seconds } = useCountdown(LAUNCH_DATE);

  const pad = (n: number) => String(n).padStart(2, "0");

  // Total hours including days
  const totalHours = days * 24 + hours;
  const display = `${pad(totalHours)}:${pad(minutes)}:${pad(seconds)} (KRT)`;

  return (
    <div className="min-h-[calc(100vh-5rem)] flex flex-col items-center justify-center">
      <h1 className="text-5xl md:text-7xl lg:text-8xl font-light tracking-tight text-white tabular-nums">
        {display}
      </h1>
      <p className="mt-4 text-xl uppercase tracking-[0.3em] text-white">
        THE FINAL REVEAL
      </p>
    </div>
  );
}
