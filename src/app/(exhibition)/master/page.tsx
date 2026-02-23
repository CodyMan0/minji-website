"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { motion } from "framer-motion";
import { ARTIST } from "@/lib/constants";

const SQUARE1_APPEAR = 0.3;
const BLINK_START = 0.4;
const BLINK_DURATION = 0.1;
const BLINK_COUNT = 3;
const SQUARE2_APPEAR = BLINK_START + BLINK_COUNT * BLINK_DURATION * 2 + 0.1;
const SQUARE3_APPEAR = SQUARE2_APPEAR + 0.2;
const CONTENT_FADE_IN = SQUARE3_APPEAR + 0.8;

const WHEEL_THRESHOLD = 50;
const MAX_STEP = 2;
const STEP_OFFSETS_DESKTOP = [0, 0, 32];
const STEP_OFFSETS_MOBILE = [0, 0, 30];

export default function MasterPage() {
  const [phase, setPhase] = useState(0);
  const [step, setStep] = useState(0);
  const [isMobile, setIsMobile] = useState(false);
  const stepRef = useRef(0);
  const wheelAccum = useRef(0);
  const isTransitioning = useRef(false);

  useEffect(() => {
    const mq = window.matchMedia("(max-width: 767px)");
    setIsMobile(mq.matches);
    const handler = (e: MediaQueryListEvent) => setIsMobile(e.matches);
    mq.addEventListener("change", handler);
    return () => mq.removeEventListener("change", handler);
  }, []);

  useEffect(() => {
    const timers = [
      setTimeout(() => setPhase(1), SQUARE1_APPEAR * 1000),
      setTimeout(() => setPhase(2), SQUARE2_APPEAR * 1000),
      setTimeout(() => setPhase(3), SQUARE3_APPEAR * 1000),
      setTimeout(() => setPhase(4), CONTENT_FADE_IN * 1000),
    ];
    return () => timers.forEach(clearTimeout);
  }, []);

  const goStep = useCallback((next: number) => {
    if (isTransitioning.current) return;
    isTransitioning.current = true;
    stepRef.current = next;
    setStep(next);
    setTimeout(() => {
      isTransitioning.current = false;
    }, 600);
  }, []);

  useEffect(() => {
    const handleWheel = (e: WheelEvent) => {
      e.preventDefault();
      if (phase < 4) return;

      wheelAccum.current += e.deltaY;

      if (wheelAccum.current > WHEEL_THRESHOLD) {
        wheelAccum.current = 0;
        const next = Math.min(stepRef.current + 1, MAX_STEP);
        if (next !== stepRef.current) goStep(next);
      } else if (wheelAccum.current < -WHEEL_THRESHOLD) {
        wheelAccum.current = 0;
        const next = Math.max(stepRef.current - 1, 0);
        if (next !== stepRef.current) goStep(next);
      }
    };

    window.addEventListener("wheel", handleWheel, { passive: false });
    return () => window.removeEventListener("wheel", handleWheel);
  }, [phase, goStep]);

  useEffect(() => {
    if (phase < 4) return;

    let touchStartY = 0;

    const handleTouchStart = (e: TouchEvent) => {
      touchStartY = e.touches[0].clientY;
    };

    const handleTouchEnd = (e: TouchEvent) => {
      const dy = touchStartY - e.changedTouches[0].clientY;
      if (Math.abs(dy) < 50) return;

      if (dy > 0) {
        const next = Math.min(stepRef.current + 1, MAX_STEP);
        if (next !== stepRef.current) goStep(next);
      } else {
        const next = Math.max(stepRef.current - 1, 0);
        if (next !== stepRef.current) goStep(next);
      }
    };

    window.addEventListener("touchstart", handleTouchStart, { passive: true });
    window.addEventListener("touchend", handleTouchEnd, { passive: true });
    return () => {
      window.removeEventListener("touchstart", handleTouchStart);
      window.removeEventListener("touchend", handleTouchEnd);
    };
  }, [phase, goStep]);

  const stepOffsets = isMobile ? STEP_OFFSETS_MOBILE : STEP_OFFSETS_DESKTOP;
  const slideOffset = stepOffsets[step] ?? 0;
  const dotsTop = isMobile ? "calc(50% - 59px)" : "calc(50% - 130px)";
  const contentPt = isMobile ? "calc(50dvh - 61px)" : "calc(50dvh - 132px)";

  return (
    <div className="relative h-[calc(100dvh-5rem)] overflow-hidden text-white">
      <motion.div
        className="relative h-full px-[5%]"
        animate={{ y: `-${slideOffset}dvh` }}
        transition={{ duration: 1, ease: [0.33, 1, 0.68, 1] }}
      >
        <div className="absolute inset-0 pointer-events-none z-20 mx-[5%]">
          <motion.span
            className="absolute w-[clamp(10px,0.81vw,15px)] h-[clamp(12px,1vw,18px)] bg-white"
            style={{ left: "0%", top: dotsTop }}
            initial={{ opacity: 0 }}
            animate={
              phase >= 4
                ? { opacity: 1 }
                : phase >= 1
                  ? {
                      opacity:
                        phase >= 2
                          ? 1
                          : [0, 1, 1, 0, 0, 1, 1, 0, 0, 1, 1, 0, 0, 1],
                    }
                  : { opacity: 0 }
            }
            transition={
              phase >= 4
                ? { duration: 0.8, ease: "easeOut" }
                : phase >= 2
                  ? { duration: 0.3 }
                  : {
                      duration: BLINK_COUNT * BLINK_DURATION * 2 + 0.4,
                      ease: "linear",
                    }
            }
          />
          <motion.span
            className="absolute w-[clamp(10px,0.81vw,15px)] h-[clamp(12px,1vw,18px)] bg-white"
            style={{ top: dotsTop }}
            initial={{ opacity: 0, left: "0%" }}
            animate={
              phase >= 4
                ? { opacity: 1, left: "19%" }
                : phase >= 2
                  ? { opacity: 1, left: "19%" }
                  : { opacity: 0, left: "0%" }
            }
            transition={
              phase >= 4
                ? { duration: 0.8, ease: "easeOut" }
                : { duration: 0.5, ease: "easeOut" }
            }
          />
          <motion.span
            className="absolute w-[clamp(10px,0.81vw,15px)] h-[clamp(12px,1vw,18px)] bg-white"
            style={{ top: dotsTop }}
            initial={{ opacity: 0, left: "19%" }}
            animate={
              phase >= 4
                ? {
                    opacity: 1,
                    left: "calc(100% - clamp(10px,0.81vw,15px))",
                  }
                : phase >= 3
                  ? {
                      opacity: 1,
                      left: "calc(100% - clamp(10px,0.81vw,15px))",
                    }
                  : { opacity: 0, left: "19%" }
            }
            transition={
              phase >= 4
                ? { duration: 0.8, ease: "easeOut" }
                : { duration: 0.6, ease: "easeOut" }
            }
          />
        </div>

        <motion.div
          className="relative z-10"
          style={{ paddingTop: contentPt }}
          initial={{ opacity: 0, y: 20 }}
          animate={phase >= 4 ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.5, ease: "easeOut" }}
        >
          <h1 className="text-[clamp(1.2rem,1.75vw,2rem)] font-normal mb-3 md:mb-5 leading-[1.54] tracking-[-0.02em]">
            마스터 포토그래퍼 JDZ
          </h1>
          <p className="text-[clamp(0.7rem,1.18vw,1.1rem)] leading-[1.64] tracking-[-0.02em] text-white max-w-3xl whitespace-pre-line">
            {ARTIST.bio}
          </p>
        </motion.div>

        <motion.div
          className="relative z-10 mt-[4dvh] md:mt-[6dvh]"
          initial={{ opacity: 0, y: 20 }}
          animate={step >= 1 ? { opacity: 0.7, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
        >
          <div className="flex items-end gap-[16%] mb-4 md:mb-8">
            <p className="text-[clamp(0.8rem,1.3vw,1.2rem)] font-normal leading-[1.54] tracking-[-0.02em]">
              01
            </p>
            <p className="text-[clamp(0.8rem,1.3vw,1.2rem)] font-normal leading-[1.54] tracking-[-0.02em] uppercase">
              ABOUT
            </p>
          </div>
          <p className="text-[clamp(0.7rem,1.25vw,1.1rem)] font-normal leading-[1.64] tracking-[-0.05em] text-white max-w-4xl whitespace-pre-line">
            {ARTIST.about}
          </p>
        </motion.div>

        <motion.div
          className="relative z-10 mt-[4dvh] md:mt-[6dvh]"
          initial={{ opacity: 0, y: 20 }}
          animate={step >= 2 ? { opacity: 0.7, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
        >
          <div className="flex items-end gap-[16%] mb-4 md:mb-8">
            <p className="text-[clamp(0.8rem,1.3vw,1.2rem)] font-normal leading-[1.54] tracking-[-0.02em]">
              02
            </p>
            <p className="text-[clamp(0.8rem,1.3vw,1.2rem)] font-normal leading-[1.54] tracking-[-0.02em] uppercase">
              PHILOSOPHY
            </p>
          </div>
          <p className="text-[clamp(0.7rem,1.25vw,1.1rem)] font-normal leading-[1.64] tracking-[-0.05em] text-white max-w-4xl whitespace-pre-line">
            {ARTIST.philosophy}
          </p>
        </motion.div>
      </motion.div>

      <motion.div
        className="absolute bottom-14 left-1/2 -translate-x-1/2 z-30 flex flex-col items-center gap-1"
        initial={{ opacity: 0 }}
        animate={phase >= 4 && step === 0 ? { opacity: 0.5 } : { opacity: 0 }}
        transition={{ duration: 0.4 }}
      >
        <motion.svg
          width="16"
          height="20"
          viewBox="0 0 16 20"
          fill="none"
          className="text-white"
          animate={{ y: [0, 2, 0] }}
          transition={{ repeat: Infinity, duration: 1.5, ease: "easeInOut" }}
        >
          <path
            d="M2 2L8 8L14 2"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            d="M2 10L8 16L14 10"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </motion.svg>
        <span className="text-white text-[10px] uppercase tracking-widest font-(family-name:--font-ibm-plex-mono) pt-2">
          Scroll down
        </span>
      </motion.div>
    </div>
  );
}
