"use client";

import { useState, useCallback, useRef, useEffect } from "react";

const COOLDOWN_MS = 600;

export function useWheelNavigation(maxIndex: number) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const isAnimating = useRef(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const handleWheel = useCallback(
    (e: WheelEvent) => {
      e.preventDefault();
      if (isAnimating.current) return;

      const isScrollDown = e.deltaY > 0;
      const canScrollDown = isScrollDown && currentIndex < maxIndex;
      const canScrollUp = !isScrollDown && currentIndex > 0;

      if (!canScrollDown && !canScrollUp) return;

      isAnimating.current = true;
      setCurrentIndex((prev) => prev + (isScrollDown ? 1 : -1));
      setTimeout(() => {
        isAnimating.current = false;
      }, COOLDOWN_MS);
    },
    [currentIndex, maxIndex]
  );

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    el.addEventListener("wheel", handleWheel, { passive: false });
    return () => el.removeEventListener("wheel", handleWheel);
  }, [handleWheel]);

  return { currentIndex, containerRef };
}
