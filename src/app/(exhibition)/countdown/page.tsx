"use client";

import { useCountdown } from "@/hooks/useCountdown";
import { useTypewriter } from "@/hooks/useTypewriter";
import { useDebugDate } from "@/contexts/DebugDateContext";
import { padTwo } from "@/lib/format";
import { motion, useAnimation } from "framer-motion";
import { track } from "@vercel/analytics";

export default function CountdownPage() {
  const { adjustedDate } = useDebugDate();

  const { days, hours, minutes, seconds, isExpired } =
    useCountdown(adjustedDate);
  const shakeControls = useAnimation();

  const unlocked = isExpired;

  const totalHours = days * 24 + hours;
  const display = unlocked
    ? "00:00:00 (KST)"
    : `${padTwo(totalHours)}:${padTwo(minutes)}:${padTwo(seconds)} (KST)`;

  const revealMessage = unlocked
    ? "THE ANSWER IS HERE"
    : "GET READY FOR THE REVEAL";

  const { displayText: revealText } = useTypewriter(revealMessage, 60, 500);

  const handleLockedClick = () => {
    track("locked_button_click");
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
        className="fixed inset-0 flex flex-col items-center justify-center gap-[clamp(0.5rem,1vw,1rem)] select-none overflow-hidden"
      >
        <p className="text-white uppercase pb-4 md:pb-10 text-[clamp(0.875rem,1.2vw,1.5rem)] leading-[1.54] tracking-[-0.02em] px-4 text-center">
          WHAT DO YOU THINK IT WAS SHOT ON?
        </p>

        <h1 className="font-normal text-white uppercase tabular-nums text-[clamp(2.5rem,10vw,8rem)] leading-none tracking-[-0.02em]">
          {display}
        </h1>

        <p className="text-white uppercase flex items-center text-[clamp(0.875rem,1.2vw,1.5rem)] leading-[1.54] tracking-[-0.02em] min-h-[1.6em]">
          {revealText}
          <span className="inline-block bg-white ml-[0.15em] w-[0.57em] h-[0.7em] animate-blink" />
        </p>

        <div className="min-h-[2.5rem]">
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
              <a
                href="https://sgp-api.buy.mi.com/i18n_op/opx/kr/product-station/preview/kr/event/2026/xiaomi-launch-february-2026?id=9837344#"
                target="_blank"
                rel="noopener noreferrer"
                className="pl-2 pr-4 flex items-center bg-white rounded-xl"
                onClick={() => track("reveal_button_click")}
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src="/images/unlock-icon.png"
                  alt="Unlock"
                  className="w-[clamp(1.25rem,1.5vw,2rem)] h-auto"
                />
                <span className="text-black uppercase text-[clamp(0.75rem,0.8vw,1rem)] tracking-[-0.02em]">
                  REVEAL THE ANSWER
                </span>
              </a>
            </motion.div>
          </motion.div>
        ) : (
          <motion.div animate={shakeControls}>
            <button
              onClick={handleLockedClick}
              className="pl-2 pr-4 flex items-center bg-[#737373] rounded-md cursor-not-allowed select-none"
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="/images/lock-icon.png"
                alt="Lock"
                className="w-[clamp(1.25rem,1.5vw,2rem)] h-auto"
              />
              <span className="text-white uppercase text-[clamp(0.75rem,0.8vw,1rem)] tracking-[-0.02em]">
                LOCKED
              </span>
            </button>
          </motion.div>
        )}
        </div>
      </motion.div>
    </>
  );
}
