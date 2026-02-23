"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";
import { useCountdown } from "@/hooks/useCountdown";
import { useDebugDate } from "@/contexts/DebugDateContext";
import { padTwo } from "@/lib/format";
import { useCallback, useEffect, useRef, useState } from "react";
const tabs = [
  { href: "/exhibition", label: "THE ART OF LIGHT" },
  { href: "/gallery", label: "OVERVIEW" },
  { href: "/master", label: "MASTER PHOTOGRAPHER JDZ" },
];

interface TabRect {
  left: number;
  width: number;
}

export default function Navigation() {
  const { adjustedDate } = useDebugDate();
  const { days, hours, minutes, isExpired } = useCountdown(adjustedDate);
  const pathname = usePathname();
  const containerRef = useRef<HTMLDivElement>(null);
  const tabRefs = useRef<(HTMLAnchorElement | null)[]>([]);
  const [activeRect, setActiveRect] = useState<TabRect | null>(null);

  const activeIndex = tabs.findIndex(
    (tab) =>
      tab.href === pathname ||
      (pathname === "/countdown" && tab.href === "/master"),
  );

  const measureActiveTab = useCallback(() => {
    const container = containerRef.current;
    const activeTab = tabRefs.current[activeIndex];
    if (!container || !activeTab) return;

    const containerBox = container.getBoundingClientRect();
    const tabBox = activeTab.getBoundingClientRect();

    setActiveRect({
      left: tabBox.left - containerBox.left,
      width: tabBox.width,
    });
  }, [activeIndex]);

  useEffect(() => {
    measureActiveTab();
    window.addEventListener("resize", measureActiveTab);
    return () => window.removeEventListener("resize", measureActiveTab);
  }, [measureActiveTab]);

  const countdown = isExpired
    ? "LIVE"
    : `${padTwo(days)}D:${padTwo(hours)}H:${padTwo(minutes)}M (KST)`;

  return (
    <motion.nav
      className="fixed top-0 left-0 right-0 z-50"
      style={{
        padding:
          "clamp(0.4rem, 1.22vw, 1.22vw) clamp(0.4rem, 1.33vw, 1.33vw) 0",
      }}
    >
      <div className="flex items-center justify-between gap-1.5">
        <div
          ref={containerRef}
          className="relative flex items-center bg-[#242424] font-(family-name:--font-ibm-plex-mono) min-w-0 flex-shrink"
          style={{
            padding: "clamp(2px, 0.23vw, 4px) clamp(3px, 0.29vw, 5px)",
            gap: "clamp(2px, 0.29vw, 5px)",
            borderRadius: "clamp(6px, 0.764vw, 12px)",
          }}
        >
          {activeRect && (
            <motion.div
              className="absolute bg-black"
              style={{
                borderRadius: "clamp(5px, 0.634vw, 10px)",
                top: "clamp(2px, 0.23vw, 4px)",
                bottom: "clamp(2px, 0.23vw, 4px)",
              }}
              animate={{
                left: activeRect.left,
                width: activeRect.width,
              }}
              transition={{
                type: "spring",
                stiffness: 380,
                damping: 30,
              }}
            />
          )}

          {tabs.map((tab, i) => {
            const isActive = i === activeIndex;
            return (
              <Link
                key={tab.href}
                href={tab.href}
                ref={(el) => {
                  tabRefs.current[i] = el;
                }}
                className="relative flex items-center justify-center uppercase font-normal min-h-7 md:min-h-11 text-center"
                style={{
                  borderRadius: "clamp(5px, 0.634vw, 10px)",
                  padding:
                    "clamp(0.1rem, 0.3vw, 0.5rem) clamp(0.4rem, 2.2vw, 2.5rem)",
                  fontSize: "clamp(9px, 0.968vw, 1.125rem)",
                  letterSpacing: "-0.07em",
                  lineHeight: "1.16",
                }}
              >
                <span
                  className={`relative z-10 ${
                    isActive
                      ? "text-white"
                      : "text-[#707070] hover:text-zinc-200"
                  }`}
                >
                  {tab.label}
                </span>
                {!isActive && (
                  <motion.div
                    className="absolute inset-0 bg-white/0"
                    style={{ borderRadius: "clamp(5px, 0.634vw, 10px)" }}
                    transition={{ duration: 0.004 }}
                  />
                )}
              </Link>
            );
          })}
        </div>
        <Link
          href="/countdown"
          className={`flex items-center justify-center uppercase tabular-nums font-normal transition-colors min-h-7 md:min-h-11 font-(family-name:--font-ibm-plex-mono) flex-shrink-0 whitespace-nowrap ${
            pathname === "/countdown"
              ? "bg-white text-black"
              : "bg-[#242424]/70 text-[#707070] hover:text-white"
          }`}
          style={{
            padding:
              "clamp(0.1rem, 0.4vw, 0.5rem) clamp(0.4rem, 1.4vw, 1.6rem)",
            fontSize: "clamp(9px, 0.968vw, 1.125rem)",
            letterSpacing: "-0.02em",
            lineHeight: "1.16",
            borderRadius: "clamp(6px, 0.764vw, 12px)",
          }}
        >
          {pathname === "/countdown"
            ? isExpired
              ? "UNLOCKED!"
              : "COMING SOON"
            : countdown}
        </Link>
      </div>
    </motion.nav>
  );
}
