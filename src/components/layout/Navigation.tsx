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
  const { days, hours, minutes, seconds, isExpired } =
    useCountdown(adjustedDate);
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

  const totalHours = days * 24 + hours;
  const countdown = isExpired
    ? "LIVE"
    : `${padTwo(totalHours)}:${padTwo(minutes)}:${padTwo(seconds)} (KST)`;

  return (
    <motion.nav
      className="fixed top-0 left-0 right-0 z-50"
      style={{ padding: "1.22vw 1.33vw 0" }}
    >
      <div className="flex items-center justify-between">
        <div
          ref={containerRef}
          className="relative flex items-center bg-[#242424]"
          style={{
            padding: "0.23vw 0.29vw",
            gap: "0.29vw",
            borderRadius: "0.764vw",
          }}
        >
          {/* Active indicator */}
          {activeRect && (
            <motion.div
              className="absolute bg-black"
              style={{
                borderRadius: "0.634vw",
                top: "0.23vw",
                bottom: "0.23vw",
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
                className="relative flex items-center justify-center uppercase font-normal"
                style={{
                  borderRadius: "0.634vw",
                  padding: "0.3vw 2.2vw",
                  fontSize: "clamp(0.5625rem, 0.968vw, 1.125rem)",
                  letterSpacing: "-0.02em",
                  lineHeight: "1.54",
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
                    style={{ borderRadius: "0.634vw" }}
                    transition={{ duration: 0.004 }}
                  />
                )}
              </Link>
            );
          })}
        </div>
        <Link
          href="/countdown"
          className={`flex items-center justify-center uppercase tabular-nums font-normal transition-colors ${
            pathname === "/countdown"
              ? "bg-white text-black"
              : "bg-[#242424]/70 text-[#707070] hover:text-white"
          }`}
          style={{
            padding: "0.4vw 1.4vw",
            fontSize: "clamp(0.5625rem, 0.968vw, 1.125rem)",
            letterSpacing: "-0.02em",
            lineHeight: "1.54",
            borderRadius: "0.764vw",
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
