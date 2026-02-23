"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { motion } from "framer-motion";
import Image from "next/image";
import { ARTIST } from "@/lib/constants";

/* ── Intro animation timing (seconds) ── */
const SQUARE1_APPEAR = 0.3;
const BLINK_START = 0.4;
const BLINK_DURATION = 0.1;
const BLINK_COUNT = 3;
const SQUARE2_APPEAR = BLINK_START + BLINK_COUNT * BLINK_DURATION * 2 + 0.1;
const SQUARE3_APPEAR = SQUARE2_APPEAR + 0.2;
const CONTENT_FADE_IN = SQUARE3_APPEAR + 0.8;

const WHEEL_THRESHOLD = 50;
const SCROLL_STEPS = [0, 40, 75];

export default function MasterPage() {
  const [phase, setPhase] = useState(0);
  const [step, setStep] = useState(0);
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
        setStep((prev) => {
          const next = Math.min(prev + 1, SCROLL_STEPS.length - 1);
          if (next !== prev) goStep(next);
          return prev;
        });
      } else if (wheelAccum.current < -WHEEL_THRESHOLD) {
        wheelAccum.current = 0;
        setStep((prev) => {
          const next = Math.max(prev - 1, 0);
          if (next !== prev) goStep(next);
          return prev;
        });
      }
    };

    window.addEventListener("wheel", handleWheel, { passive: false });
    return () => window.removeEventListener("wheel", handleWheel);
  }, [phase, goStep]);

  // Touch: swipe up/down for section transitions
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
        // Swipe up → next section
        setStep((prev) => {
          const next = Math.min(prev + 1, SCROLL_STEPS.length - 1);
          if (next !== prev) goStep(next);
          return prev;
        });
      } else {
        // Swipe down → prev section
        setStep((prev) => {
          const next = Math.max(prev - 1, 0);
          if (next !== prev) goStep(next);
          return prev;
        });
      }
    };

    window.addEventListener("touchstart", handleTouchStart, { passive: true });
    window.addEventListener("touchend", handleTouchEnd, { passive: true });
    return () => {
      window.removeEventListener("touchstart", handleTouchStart);
      window.removeEventListener("touchend", handleTouchEnd);
    };
  }, [phase, goStep]);

  const translateY = SCROLL_STEPS[step];

  return (
    <div className="relative h-[calc(100dvh-5rem)] overflow-hidden text-white">
      {/* Background JDZ photo */}
      <motion.div
        className="absolute inset-0"
        initial={{ opacity: 0 }}
        animate={{ opacity: phase >= 4 ? 1 : 0 }}
        transition={{ duration: 1.5, ease: "easeOut" }}
      >
        <Image
          src="/images/master-jdz.png"
          alt="JDZ CHUNG"
          fill
          className="object-cover object-top"
          style={{ mixBlendMode: "luminosity" }}
          priority
        />
      </motion.div>

      {/* Three squares — fixed position */}
      <div className="absolute inset-0 pointer-events-none z-20">
        <motion.span
          className="absolute w-[clamp(8px,0.7vw,10px)] h-[clamp(8px,0.7vw,10px)] bg-white"
          style={{ left: "5%", top: "15%" }}
          initial={{ opacity: 0 }}
          animate={
            phase >= 1
              ? {
                  opacity:
                    phase >= 2 ? 1 : [0, 1, 1, 0, 0, 1, 1, 0, 0, 1, 1, 0, 0, 1],
                }
              : { opacity: 0 }
          }
          transition={
            phase >= 2
              ? { duration: 0.3 }
              : {
                  duration: BLINK_COUNT * BLINK_DURATION * 2 + 0.4,
                  ease: "linear",
                }
          }
        />
        <motion.span
          className="absolute w-[clamp(8px,0.7vw,10px)] h-[clamp(8px,0.7vw,10px)] bg-white"
          style={{ top: "15%" }}
          initial={{ opacity: 0, left: "5%" }}
          animate={
            phase >= 2
              ? { opacity: 1, left: "28%" }
              : { opacity: 0, left: "5%" }
          }
          transition={{ duration: 0.5, ease: "easeOut" }}
        />
        <motion.span
          className="absolute w-[clamp(8px,0.7vw,10px)] h-[clamp(8px,0.7vw,10px)] bg-white"
          style={{ top: "15%" }}
          initial={{ opacity: 0, left: "28%" }}
          animate={
            phase >= 3
              ? { opacity: 1, left: "95%" }
              : { opacity: 0, left: "28%" }
          }
          transition={{ duration: 0.6, ease: "easeOut" }}
        />
      </div>

      {/* ── Sliding content layer ── */}
      <motion.div
        className="relative z-10 px-[5%]"
        animate={{ y: `-${translateY}%` }}
        transition={{ duration: 0.6, ease: [0.33, 1, 0.68, 1] }}
      >
        {/* Hero: title + bio */}
        <motion.div
          className="h-[calc(100dvh-5rem)] flex flex-col justify-center"
          initial={{ opacity: 0, y: 15 }}
          animate={phase >= 4 ? { opacity: 1, y: 0 } : { opacity: 0, y: 15 }}
          transition={{ duration: 1.2, ease: "easeOut" }}
        >
          <div className="mt-[-5%]">
            <h1 className="text-[clamp(1.2rem,2vw,2.2rem)] font-semibold mb-5 tracking-tight">
              마스터 포토그래퍼 JDZ
            </h1>
            <p className="text-[clamp(0.7rem,1vw,0.95rem)] leading-[1.75] text-white/90 max-w-3xl whitespace-pre-line">
              {ARTIST.bio}
            </p>
          </div>
        </motion.div>

        {/* 01 ABOUT */}
        <div className="h-[calc(100dvh-5rem)] flex flex-col justify-center">
          <div>
            <div className="flex items-end gap-6 md:gap-20 mb-6">
              <p className="text-[clamp(1.2rem,2vw,2rem)] font-light">01</p>
              <p className="text-[clamp(1.2rem,2vw,2rem)] font-light uppercase tracking-wider">
                ABOUT
              </p>
            </div>
            <p className="text-[clamp(0.7rem,0.9vw,0.875rem)] leading-[1.75] text-white/85 max-w-4xl whitespace-pre-line">
              {ARTIST.about}
            </p>
          </div>
        </div>

        {/* 02 PHILOSOPHY */}
        <div className="h-[calc(100dvh-5rem)] flex flex-col justify-center">
          <div>
            <div className="flex items-end gap-6 md:gap-20 mb-6">
              <p className="text-[clamp(1.2rem,2vw,2rem)] font-light">02</p>
              <p className="text-[clamp(1.2rem,2vw,2rem)] font-light uppercase tracking-wider">
                PHILOSOPHY
              </p>
            </div>
            <p className="text-[clamp(0.7rem,0.9vw,0.875rem)] leading-[1.75] text-white/85 max-w-4xl whitespace-pre-line">
              {ARTIST.philosophy}
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
