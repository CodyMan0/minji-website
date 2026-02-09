"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { useTypewriter } from "@/hooks/useTypewriter";

export default function LoadingPage() {
  const router = useRouter();
  const [phase, setPhase] = useState<1 | 2 | 3 | 4>(1);

  // Phase 2: Typewriter for main text
  const { displayText, isComplete } = useTypewriter(
    "THE ART OF LIGHT",
    80,
    phase >= 2 ? 0 : 999999 // Only start when phase 2 begins
  );

  useEffect(() => {
    // Phase 1 -> Phase 2: After 3s
    const phase1Timeout = setTimeout(() => {
      setPhase(2);
    }, 3000);

    return () => clearTimeout(phase1Timeout);
  }, []);

  useEffect(() => {
    // Phase 2 -> Phase 3: When typewriter completes
    if (phase === 2 && isComplete) {
      setPhase(3);
    }
  }, [phase, isComplete]);

  useEffect(() => {
    // Phase 3 -> Phase 4: After collaboration text fades in (1.5s delay)
    if (phase === 3) {
      const phase3Timeout = setTimeout(() => {
        setPhase(4);
      }, 1500);

      return () => clearTimeout(phase3Timeout);
    }
  }, [phase]);

  useEffect(() => {
    // Phase 4: Navigate to /exhibition after brief pause
    if (phase === 4) {
      const navigateTimeout = setTimeout(() => {
        router.push("/exhibition");
      }, 500);

      return () => clearTimeout(navigateTimeout);
    }
  }, [phase, router]);

  return (
    <div className="min-h-screen bg-black flex items-center justify-center">
      <div className="flex flex-col items-center gap-8">
        {/* Phase 1: Sparkle Star */}
        {phase === 1 && (
          <div className="w-16 h-16 animate-sparkle">
            <svg viewBox="0 0 24 24" fill="white" className="w-full h-full">
              <path d="M12 0L14.59 9.41L24 12L14.59 14.59L12 24L9.41 14.59L0 12L9.41 9.41L12 0Z" />
            </svg>
          </div>
        )}

        {/* Phase 2 & 3: Text content */}
        {phase >= 2 && (
          <div className="flex flex-col items-center gap-6">
            {/* Main title with typewriter */}
            <h1 className="text-4xl md:text-6xl font-bold text-white uppercase tracking-[0.3em]">
              {displayText}
            </h1>

            {/* Phase 3: Collaboration text fade in */}
            {phase >= 3 && (
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 1 }}
                className="text-sm text-zinc-500 uppercase tracking-[0.2em]"
              >
                xiaomi Korea x Jdz chung
              </motion.p>
            )}
          </div>
        )}
      </div>

      {/* CSS Keyframes for sparkle animation */}
      <style jsx>{`
        @keyframes sparkle {
          0% {
            transform: scale(0.3);
            opacity: 0.2;
          }
          100% {
            transform: scale(1);
            opacity: 1;
          }
        }

        .animate-sparkle {
          animation: sparkle 3s ease-out forwards;
        }
      `}</style>
    </div>
  );
}
