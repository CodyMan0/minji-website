"use client";

import { useCountdown } from "@/hooks/useCountdown";
import { useTypewriter } from "@/hooks/useTypewriter";
import { LAUNCH_DATE } from "@/lib/constants";
import { padTwo } from "@/lib/format";
import { motion, useAnimation } from "framer-motion";

export default function CountdownPage() {
  const { days, hours, minutes, seconds } = useCountdown(LAUNCH_DATE);
  const shakeControls = useAnimation();

  const totalHours = days * 24 + hours;
  const display = `${padTwo(totalHours)}:${padTwo(minutes)}:${padTwo(seconds)} (KST)`;

  const { displayText: revealText } = useTypewriter(
    "GET READY FOR THE REVEAL",
    60,
    500
  );

  const handleLockedClick = () => {
    navigator.vibrate?.([10, 50, 10]);
    shakeControls.start({
      x: [0, -3, 3, -3, 3, 0],
      transition: { duration: 0.3 },
    });
  };

  return (
    <div className="min-h-[calc(100vh-5rem)] flex flex-col items-center justify-center gap-2">
      {/* Question text — static */}
      <p
        className="text-white uppercase"
        style={{
          fontFamily: "'IBM Plex Sans Condensed', sans-serif",
          fontSize: "clamp(0.75rem, 1.13vw, 1.1rem)",
          lineHeight: 1.54,
          letterSpacing: "-0.02em",
        }}
      >
        WHAT DO YOU THINK IT WAS SHOT ON?
      </p>

      {/* Large countdown timer */}
      <h1
        className="font-normal text-white uppercase tabular-nums"
        style={{
          fontFamily: "'IBM Plex Sans Condensed', sans-serif",
          fontSize: "clamp(3rem, 5.1vw, 5rem)",
          lineHeight: 1.54,
          letterSpacing: "-0.02em",
        }}
      >
        {display}
      </h1>

      {/* Reveal text with typing */}
      <p
        className="text-white uppercase flex items-center"
        style={{
          fontFamily: "'IBM Plex Sans Condensed', sans-serif",
          fontSize: "clamp(0.75rem, 1.13vw, 1.1rem)",
          lineHeight: 1.54,
          letterSpacing: "-0.02em",
          minHeight: "1.6em",
        }}
      >
        {revealText}
        <span
          className="inline-block bg-white ml-[0.15em] animate-blink"
          style={{ width: "0.5em", height: "0.65em" }}
        />
      </p>

      {/* Locked button — Figma style */}
      <motion.button
        animate={shakeControls}
        onClick={handleLockedClick}
        className="mt-4 flex items-center gap-2 bg-[#737373] rounded-full px-4 py-1.5 cursor-not-allowed"
      >
        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" className="text-white">
          <rect x="3" y="11" width="18" height="11" rx="2" stroke="currentColor" strokeWidth="2" />
          <path d="M7 11V7a5 5 0 0 1 10 0v4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
        </svg>
        <span
          className="text-white uppercase"
          style={{
            fontFamily: "'IBM Plex Sans Condensed', sans-serif",
            fontSize: "clamp(0.6rem, 0.7vw, 0.75rem)",
            letterSpacing: "-0.02em",
          }}
        >
          LOCKED
        </span>
      </motion.button>
    </div>
  );
}
