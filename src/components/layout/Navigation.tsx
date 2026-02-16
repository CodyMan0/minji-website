"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";
import { useCountdown } from "@/hooks/useCountdown";
import { LAUNCH_DATE } from "@/lib/constants";
import { padTwo } from "@/lib/format";

const tabs = [
  { href: "/exhibition", label: "THE ART OF LIGHT" },
  { href: "/gallery", label: "OVERVIEW" },
  { href: "/master", label: "MASTER PHOTOGRAPHER JDZ" },
];

export default function Navigation() {
  const { days, hours, minutes, seconds, isExpired } =
    useCountdown(LAUNCH_DATE);
  const pathname = usePathname();

  const countdown = isExpired
    ? "LIVE"
    : days > 0
      ? `${days}D ${padTwo(hours)}:${padTwo(minutes)}:${padTwo(seconds)}`
      : `${padTwo(hours)}:${padTwo(minutes)}:${padTwo(seconds)}`;

  return (
    <motion.nav
      className="fixed top-0 left-0 right-0 z-50 px-6 pt-5"
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center bg-zinc-800 rounded-xl px-1.5 py-1 gap-1">
          {tabs.map((tab) => {
            const isActive = pathname === tab.href;
            return (
              <Link
                key={tab.href}
                href={tab.href}
                className="relative px-6 py-2.5 text-xs uppercase tracking-widest rounded-lg transition-colors duration-200"
              >
                {isActive && (
                  <motion.div
                    layoutId="activeTab"
                    className="absolute inset-0 bg-black rounded-lg"
                    transition={{
                      type: "spring",
                      stiffness: 380,
                      damping: 30,
                    }}
                  />
                )}
                <span
                  className={`relative z-10 ${
                    isActive ? "text-white" : "text-zinc-400 hover:text-zinc-200"
                  }`}
                >
                  {tab.label}
                </span>
                {!isActive && (
                  <motion.div
                    className="absolute inset-0 bg-white/0 rounded-lg"
                    whileHover={{ backgroundColor: "rgba(255, 255, 255, 0.1)" }}
                    transition={{ duration: 0.2 }}
                  />
                )}
              </Link>
            );
          })}
        </div>
        <Link
          href="/countdown"
          className={`rounded-xl px-5 py-2.5 text-xs tracking-wider tabular-nums transition-colors ${
            pathname === "/countdown"
              ? "bg-white text-black"
              : "bg-zinc-800 text-white/70 hover:text-white"
          }`}
        >
          {pathname === "/countdown" ? "COMING SOON" : countdown}
        </Link>
      </div>
    </motion.nav>
  );
}
