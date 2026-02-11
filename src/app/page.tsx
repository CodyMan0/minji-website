"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { useTypewriter } from "@/hooks/useTypewriter";

type Phase = "star" | "text" | "done";

export default function LoadingPage() {
  const router = useRouter();
  const [phase, setPhase] = useState<Phase>("star");
  const [shouldSkip, setShouldSkip] = useState(false);

  // Check if loading should be shown (only on refresh or direct / navigation)
  useEffect(() => {
    const navEntries = performance.getEntriesByType(
      "navigation"
    ) as PerformanceNavigationTiming[];
    const navType = navEntries[0]?.type;

    // Show loading only on direct navigation or reload (not back/forward)
    const isDirectOrRefresh =
      navType === "navigate" || navType === "reload" || !navType;

    // Check sessionStorage for in-app navigation
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
    phase === "text" ? 0 : 999999
  );

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

  // Skip rendering if redirecting
  if (shouldSkip) {
    return <div className="min-h-screen bg-black" />;
  }

  return (
    <div className="min-h-screen bg-black flex items-center justify-center overflow-hidden">
      <AnimatePresence mode="wait">
        {/* Phase: Star/Light Reveal */}
        {phase === "star" && (
          <motion.div
            key="star"
            initial={{ clipPath: "inset(100% 0 0 0)", opacity: 0, scale: 0.8 }}
            animate={{
              clipPath: [
                "inset(100% 0 0 0)", // start
                "inset(34% 0 0 0)",  // 66% filled — smooth
                "inset(34% 0 0 0)",  // pause
                "inset(20% 0 0 0)",  // 80% filled
                "inset(20% 0 0 0)",  // pause
                "inset(5% 0 0 0)",   // 95% filled
                "inset(0% 0 0 0)",   // 100% — slow finish
              ],
              opacity: [0, 1, 1, 1, 1, 1, 1],
              scale: [0.8, 1, 1, 1, 1, 1, 1],
            }}
            exit={{ opacity: 0, transition: { duration: 0 } }}
            transition={{
              duration: 7,
              times: [0, 0.35, 0.42, 0.58, 0.65, 0.82, 1],
              ease: [
                [0.2, 0, 0.1, 1.15],   // 0→66%: 쓰윽 차다가 살짝 오버슛
                [0.7, 0, 0.3, 1],       // 66% 멈칫: 쫀득하게 멈춤
                [0.8, -0.1, 0.2, 1.1],  // 멈춤→80%: 달라붙었다 떨어지는 느낌
                [0.7, 0, 0.3, 1],       // 80% 멈칫: 쫀득하게 멈춤
                [0.75, -0.05, 0.15, 1], // 멈춤→95%: 스티키하게 출발
                [0.4, 0, 0.05, 1],      // 95→100%: 아주 천천히 마무리
              ],
            }}
            onAnimationComplete={() => {
              if (phase === "star") {
                setPhase("text");
              }
            }}
            className="relative"
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

        {/* Phase: Text content — matches Figma node 62:225 */}
        {phase === "text" && (
          <motion.div
            key="text"
            initial={{ opacity: 1 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="flex flex-col items-center"
          >
            {/* Title: IBM Plex Sans Condensed Regular, 1.49vw proportional */}
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

            {/* Subtitle: 0.96vw proportional, 64% opacity */}
            {isComplete && (
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 0.64 }}
                transition={{ duration: 1 }}
                className="text-white uppercase mt-1"
                style={{
                  fontSize: "clamp(0.75rem, 0.96vw, 1.25rem)",
                  letterSpacing: "-0.02em",
                  lineHeight: "1.24",
                }}
              >
                XIAOMI KOREA  X  JDZ CHUNG
              </motion.p>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
