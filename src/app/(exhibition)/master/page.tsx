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
const STEP_OFFSETS = [0, 0, 30];

export default function MasterPage() {
  const [phase, setPhase] = useState(0);
  const [step, setStep] = useState(0);
  const stepRef = useRef(0);
  const wheelAccum = useRef(0);
  const isTransitioning = useRef(false);

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

  const slideOffset = STEP_OFFSETS[step] ?? 0;

  return (
    <div className="relative h-[calc(100dvh-5rem)] overflow-hidden text-white">
      <motion.div
        className="relative h-full px-[5%]"
        animate={{ y: `-${slideOffset}dvh` }}
        transition={{ duration: 1, ease: [0.33, 1, 0.68, 1] }}
      >
        <div className="absolute inset-0 pointer-events-none z-20 mx-[5%]">
          <motion.span
            className="absolute w-[clamp(8px,0.7vw,10px)] h-[clamp(8px,0.7vw,10px)] bg-white"
            style={{ left: "0%" }}
            initial={{ opacity: 0, top: "calc(50% - 2.5rem)" }}
            animate={
              phase >= 4
                ? { opacity: 1, top: "calc(50% - 2.5rem)" }
                : phase >= 1
                  ? {
                      opacity:
                        phase >= 2
                          ? 1
                          : [0, 1, 1, 0, 0, 1, 1, 0, 0, 1, 1, 0, 0, 1],
                      top: "calc(50% - 2.5rem)",
                    }
                  : { opacity: 0, top: "calc(50% - 2.5rem)" }
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
            className="absolute w-[clamp(8px,0.7vw,10px)] h-[clamp(8px,0.7vw,10px)] bg-white"
            initial={{ opacity: 0, left: "0%", top: "calc(50% - 2.5rem)" }}
            animate={
              phase >= 4
                ? { opacity: 1, left: "19%", top: "calc(50% - 2.5rem)" }
                : phase >= 2
                  ? { opacity: 1, left: "19%", top: "calc(50% - 2.5rem)" }
                  : { opacity: 0, left: "0%", top: "calc(50% - 2.5rem)" }
            }
            transition={
              phase >= 4
                ? { duration: 0.8, ease: "easeOut" }
                : { duration: 0.5, ease: "easeOut" }
            }
          />
          <motion.span
            className="absolute w-[clamp(8px,0.7vw,10px)] h-[clamp(8px,0.7vw,10px)] bg-white"
            initial={{ opacity: 0, left: "19%", top: "calc(50% - 2.5rem)" }}
            animate={
              phase >= 4
                ? {
                    opacity: 1,
                    left: "calc(100% - clamp(8px,0.7vw,10px))",
                    top: "calc(50% - 2.5rem)",
                  }
                : phase >= 3
                  ? {
                      opacity: 1,
                      left: "calc(100% - clamp(8px,0.7vw,10px))",
                      top: "calc(50% - 2.5rem)",
                    }
                  : { opacity: 0, left: "19%", top: "calc(50% - 2.5rem)" }
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
          style={{ paddingTop: "calc(50dvh - 4rem + 2rem)" }}
          initial={{ opacity: 0, y: 20 }}
          animate={phase >= 4 ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.5, ease: "easeOut" }}
        >
          <h1 className="text-[clamp(1.2rem,1.75vw,2rem)] font-semibold mb-3 leading-[1.54] tracking-[-0.02em]">
            마스터 포토그래퍼 JDZ
          </h1>
          <p className="text-[clamp(0.7rem,1.18vw,1.1rem)] leading-[1.64] tracking-[-0.02em] text-white max-w-3xl whitespace-pre-line">
            {ARTIST.bio}
          </p>
        </motion.div>

        <motion.div
          className="relative z-10 mt-[4dvh]"
          initial={{ opacity: 0, y: 20 }}
          animate={step >= 1 ? { opacity: 0.7, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
        >
          <div className="flex items-end gap-[16%] mb-4">
            <p className="text-[clamp(0.8rem,1.3vw,1.2rem)] font-normal leading-[1.54] tracking-[-0.02em]">
              01
            </p>
            <p className="text-[clamp(0.8rem,1.3vw,1.2rem)] font-normal leading-[1.54] tracking-[-0.02em] uppercase">
              ABOUT
            </p>
          </div>
          <p className="text-[clamp(0.7rem,1.25vw,1.1rem)] font-light leading-[1.64] tracking-[-0.05em] text-white max-w-4xl whitespace-pre-line">
            {ARTIST.about}
          </p>
        </motion.div>

        <motion.div
          className="relative z-10 mt-[4dvh]"
          initial={{ opacity: 0, y: 20 }}
          animate={step >= 2 ? { opacity: 0.7, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
        >
          <div className="flex items-end gap-[16%] mb-4">
            <p className="text-[clamp(0.8rem,1.3vw,1.2rem)] font-normal leading-[1.54] tracking-[-0.02em]">
              02
            </p>
            <p className="text-[clamp(0.8rem,1.3vw,1.2rem)] font-normal leading-[1.54] tracking-[-0.02em] uppercase">
              PHILOSOPHY
            </p>
          </div>
          <p className="text-[clamp(0.7rem,1.25vw,1.1rem)] font-light leading-[1.64] tracking-[-0.05em] text-white max-w-4xl whitespace-pre-line">
            {ARTIST.philosophy}
          </p>
        </motion.div>
      </motion.div>
    </div>
  );
}
