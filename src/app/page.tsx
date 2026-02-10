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
    80,
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
            animate={{ clipPath: "inset(0% 0 0 0)", opacity: 1, scale: 1 }}
            exit={{ opacity: 0, transition: { duration: 0.5 } }}
            transition={{ duration: 3, ease: "easeOut" }}
            onAnimationComplete={() => {
              if (phase === "star") {
                setTimeout(() => setPhase("text"), 500);
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
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
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
