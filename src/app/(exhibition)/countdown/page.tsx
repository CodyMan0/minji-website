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
    500,
  );

  const handleLockedClick = () => {
    navigator.vibrate?.([10, 50, 10]);
    shakeControls.start({
      x: [0, -4, 4, -3, 3, -2, 2, -1, 1, 0],
      transition: { duration: 0.35, ease: "easeOut" },
    });
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.8, ease: "easeOut" }}
      className="min-h-screen flex flex-col items-center justify-center gap-[1vw] -mt-[3vw] select-none"
    >
      <p className="text-white uppercase pb-10 text-[clamp(0.75rem,1.2vw,1.5rem)] leading-[1.54] tracking-[-0.02em]">
        WHAT DO YOU THINK IT WAS SHOT ON?
      </p>

      <h1 className="font-normal text-white uppercase tabular-nums text-[clamp(3.2rem,6.7vw,8rem)] leading-none tracking-[-0.02em]">
        {display}
      </h1>

      <p className="text-white uppercase flex items-center text-[clamp(0.75rem,1.2vw,1.5rem)] leading-[1.54] tracking-[-0.02em] min-h-[1.6em]">
        {revealText}
        <span className="inline-block bg-white ml-[0.15em] w-[0.57em] h-[0.7em] animate-blink" />
      </p>

      {/* Locked button — no hover, iPhone-like shake on click */}
      <motion.div animate={shakeControls}>
        <button
          onClick={handleLockedClick}
          className="pl-2 pr-4 flex items-center bg-[#737373] rounded-xl cursor-not-allowed select-none"
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/images/lock-icon.png"
            alt="Lock"
            className="w-[clamp(0.8rem,1.5vw,2rem)] h-auto"
          />
          <span className="text-white uppercase text-[clamp(0.6rem,0.8vw,1rem)] tracking-[-0.02em]">
            LOCKED
          </span>
        </button>
      </motion.div>
    </motion.div>
  );
}
