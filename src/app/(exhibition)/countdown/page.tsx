"use client";

import { useCountdown } from "@/hooks/useCountdown";
import { useTypewriter } from "@/hooks/useTypewriter";
import { LAUNCH_DATE } from "@/lib/constants";
import { useDebugDate } from "@/contexts/DebugDateContext";
import { padTwo } from "@/lib/format";
import { motion, useAnimation } from "framer-motion";
import Link from "next/link";

export default function CountdownPage() {
  const { adjustedDate, setDateOffset } = useDebugDate();

  const { days, hours, minutes, seconds, isExpired } =
    useCountdown(adjustedDate);
  const shakeControls = useAnimation();

  const unlocked = isExpired;

  const totalHours = days * 24 + hours;
  const display = unlocked
    ? "00:00:00 (KST)"
    : `${padTwo(totalHours)}:${padTwo(minutes)}:${padTwo(seconds)} (KST)`;

  const revealMessage = unlocked ? "THE ANSWER IS HERE" : "GET READY FOR THE REVEAL";

  const { displayText: revealText } = useTypewriter(
    revealMessage,
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
    <>
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.8, ease: "easeOut" }}
      className="fixed inset-0 flex flex-col items-center justify-center gap-[1vw] select-none overflow-hidden"
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

      {/* Button — locked or unlocked state */}
      {unlocked ? (
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{
            scale: [0.9, 1.08, 1],
            opacity: 1,
            boxShadow: [
              "0 0 0px rgba(255,255,255,0)",
              "0 0 30px rgba(255,255,255,0.6)",
              "0 0 0px rgba(255,255,255,0)",
            ],
          }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="rounded-xl"
        >
          <motion.div
            animate={{
              scale: [1, 1.02, 1],
              boxShadow: [
                "0 0 0px rgba(255,255,255,0)",
                "0 0 15px rgba(255,255,255,0.4)",
                "0 0 0px rgba(255,255,255,0)",
              ],
            }}
            transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
            className="rounded-xl"
          >
            <Link
              href="/gallery"
              className="pl-2 pr-4 flex items-center bg-white rounded-xl"
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="/images/unlock-icon.png"
                alt="Unlock"
                className="w-[clamp(0.8rem,1.5vw,2rem)] h-auto"
              />
              <span className="text-black uppercase text-[clamp(0.6rem,0.8vw,1rem)] tracking-[-0.02em]">
                REVEAL THE ANSWER
              </span>
            </Link>
          </motion.div>
        </motion.div>
      ) : (
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
      )}

    </motion.div>

    {/* Debug: launch date controller — outside motion container for clickability */}
    <div className="fixed right-4 top-1/2 -translate-y-1/2 z-[100] flex flex-col gap-1.5 bg-zinc-800 rounded-lg px-2 py-2 opacity-50 hover:opacity-100 transition-opacity">
      <button
        onClick={() => setDateOffset((v) => v - 3600)}
        className="text-zinc-400 text-xs px-2 py-1 rounded hover:bg-zinc-700"
      >
        -1h
      </button>
      <button
        onClick={() => setDateOffset((v) => v - 60)}
        className="text-zinc-400 text-xs px-2 py-1 rounded hover:bg-zinc-700"
      >
        -1m
      </button>
      <button
        onClick={() => setDateOffset(-LAUNCH_DATE.getTime() / 1000 + Date.now() / 1000 - 1)}
        className="text-zinc-400 text-xs px-2 py-1 rounded hover:bg-zinc-700 text-yellow-400"
      >
        Expire
      </button>
      <button
        onClick={() => setDateOffset(0)}
        className="text-zinc-400 text-xs px-2 py-1 rounded hover:bg-zinc-700"
      >
        Reset
      </button>
      <button
        onClick={() => setDateOffset((v) => v + 60)}
        className="text-zinc-400 text-xs px-2 py-1 rounded hover:bg-zinc-700"
      >
        +1m
      </button>
      <button
        onClick={() => setDateOffset((v) => v + 3600)}
        className="text-zinc-400 text-xs px-2 py-1 rounded hover:bg-zinc-700"
      >
        +1h
      </button>
    </div>
    </>
  );
}
