"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { useTypewriter } from "@/hooks/useTypewriter";

type Phase = "star" | "text" | "done";

/** Star reveal total duration in seconds */
const STAR_REVEAL_DURATION = 3.5;

export default function LoadingPage() {
  const router = useRouter();
  const [phase, setPhase] = useState<Phase>("star");
  const [shouldSkip, setShouldSkip] = useState(false);
  // Check if loading should be shown (only on refresh or direct / navigation)
  useEffect(() => {
    const navEntries = performance.getEntriesByType(
      "navigation",
    ) as PerformanceNavigationTiming[];
    const navType = navEntries[0]?.type;

    const isDirectOrRefresh =
      navType === "navigate" || navType === "reload" || !navType;

    const hasSeenLoading = sessionStorage.getItem("loading-seen");

    if (!isDirectOrRefresh && hasSeenLoading) {
      setShouldSkip(true);
      router.replace("/exhibition");
      return;
    }
  }, [router]);

  // Typewriter only starts when phase is "text"
  const { displayText, isComplete } = useTypewriter(
    "THE ART OF LIGHT",
    120,
    phase === "text" ? 0 : 999999,
  );

  // Star reveal complete → immediately transition to text
  const handleStarComplete = () => {
    if (phase === "star") setPhase("text");
  };

  // When typewriter completes, show collaboration text then navigate
  useEffect(() => {
    if (phase === "text" && isComplete) {
      const timeout = setTimeout(() => {
        setPhase("done");
      }, 2000);
      return () => clearTimeout(timeout);
    }
  }, [phase, isComplete]);

  // Navigate to exhibition when done
  useEffect(() => {
    if (phase === "done") {
      sessionStorage.setItem("loading-seen", "true");
      router.replace("/exhibition");
    }
  }, [phase, router]);

  if (shouldSkip) {
    return <div className="min-h-screen bg-black" />;
  }

  return (
    <div className="min-h-screen bg-black flex items-center justify-center overflow-hidden">
      <AnimatePresence mode="wait">
        {/* Phase 1: Star — bottom-to-top clipPath reveal (matches loading page.mp4) */}
        {phase === "star" && (
          <motion.div
            key="star"
            className="relative"
            initial={{ clipPath: "inset(100% 0 0 0)", opacity: 0 }}
            animate={{
              clipPath: [
                "inset(100% 0 0 0)", // start: hidden
                "inset(45% 0 0 0)", // 55% revealed — fast
                "inset(45% 0 0 0)", // pause at 55%
                "inset(30% 0 0 0)", // 70% revealed — fast
                "inset(30% 0 0 0)", // pause at 70%
                "inset(10% 0 0 0)", // 100% revealed — snap
                "inset(10% 0 0 0)", // hold at 100%
              ],
              opacity: [0, 1, 1, 1, 1, 1, 1],
            }}
            exit={{ opacity: 0, transition: { duration: 0.4, ease: "easeIn" } }}
            transition={{
              duration: STAR_REVEAL_DURATION,
              times: [0, 0.25, 0.42, 0.57, 0.75, 0.82, 1],
            }}
            onAnimationComplete={handleStarComplete}
          >
            <Image
              src="/light-loading.svg"
              alt="Loading"
              width={121}
              height={167}
              priority
            />
          </motion.div>
        )}

        {/* Phase 2: Text content */}
        {phase === "text" && (
          <motion.div
            key="text"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0, transition: { duration: 0.5 } }}
            transition={{ duration: 0.3 }}
            className="flex flex-col items-center"
          >
            <h1
              className="font-normal text-white uppercase flex items-center leading-[1.54]"
              style={{
                fontSize: "clamp(1.25rem, 1.49vw, 2rem)",
                letterSpacing: "-0.02em",
              }}
            >
              {displayText}
              <span
                className="inline-block bg-white ml-[0.15em] animate-blink"
                style={{ width: "0.57em", height: "0.7em" }}
              />
            </h1>

            {isComplete && (
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 0.64 }}
                transition={{ duration: 1 }}
                className="text-white uppercase"
                style={{
                  fontSize: "clamp(0.75rem, 0.96vw, 1.25rem)",
                  letterSpacing: "-0.02em",
                  lineHeight: "1.24",
                }}
              >
                XIAOMI KOREA &nbsp; X &nbsp; JDZ CHUNG
              </motion.p>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
