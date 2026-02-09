"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { useCountdown } from "@/hooks/useCountdown";
import { useTypewriter } from "@/hooks/useTypewriter";
import { LAUNCH_DATE } from "@/lib/constants";

const NAV_ITEMS = [
  { label: "Loading page", href: "/" },
  { label: "The art of light", href: "/exhibition" },
  { label: "Index", href: "/gallery" },
  { label: "Master JDZ", href: "/master" },
  { label: "Counting page", href: "/countdown", current: true },
];

export default function CountdownPage() {
  const { days, hours, minutes, seconds } = useCountdown(LAUNCH_DATE);
  const { displayText } = useTypewriter("THE FINAL REVEAL", 80, 0);

  const padNumber = (num: number) => String(num).padStart(2, "0");

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4">
      {/* Section 1: Countdown Timer */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="flex flex-col items-center gap-8"
      >
        {/* Top Label with Typewriter Effect */}
        <div className="text-sm uppercase tracking-[0.3em] text-zinc-400 min-h-[1.5rem]">
          {displayText}
        </div>

        {/* Countdown Numbers */}
        <div className="flex items-center gap-4 md:gap-8">
          {/* Days */}
          <div className="flex flex-col items-center">
            <div className="text-6xl md:text-8xl font-light tracking-tight">
              {padNumber(days)}
            </div>
            <div className="text-xs uppercase tracking-[0.2em] text-zinc-500 mt-2">
              DAYS
            </div>
          </div>

          <div className="text-6xl md:text-8xl font-light text-zinc-700">:</div>

          {/* Hours */}
          <div className="flex flex-col items-center">
            <div className="text-6xl md:text-8xl font-light tracking-tight">
              {padNumber(hours)}
            </div>
            <div className="text-xs uppercase tracking-[0.2em] text-zinc-500 mt-2">
              HOURS
            </div>
          </div>

          <div className="text-6xl md:text-8xl font-light text-zinc-700">:</div>

          {/* Minutes */}
          <div className="flex flex-col items-center">
            <div className="text-6xl md:text-8xl font-light tracking-tight">
              {padNumber(minutes)}
            </div>
            <div className="text-xs uppercase tracking-[0.2em] text-zinc-500 mt-2">
              MIN
            </div>
          </div>

          <div className="text-6xl md:text-8xl font-light text-zinc-700">:</div>

          {/* Seconds */}
          <div className="flex flex-col items-center">
            <div className="text-6xl md:text-8xl font-light tracking-tight">
              {padNumber(seconds)}
            </div>
            <div className="text-xs uppercase tracking-[0.2em] text-zinc-500 mt-2">
              SEC
            </div>
          </div>
        </div>
      </motion.div>

      {/* Section 2: Navigation Links */}
      <nav className="mt-16 flex flex-col items-center gap-3">
        {NAV_ITEMS.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className={`text-sm uppercase tracking-wide transition-colors flex items-center gap-2 ${
              item.current
                ? "text-white"
                : "text-zinc-500 hover:text-white"
            }`}
          >
            {item.current && (
              <span className="w-1 h-1 rounded-full bg-white" />
            )}
            {item.label}
          </Link>
        ))}
      </nav>

      {/* Section 3: "coming soon" text */}
      <div className="mt-16 flex flex-col items-center gap-2">
        <div className="text-sm uppercase tracking-[0.3em] text-zinc-600">
          coming soon
        </div>
        <div className="text-lg text-zinc-400">2026.03.06</div>
      </div>
    </div>
  );
}
