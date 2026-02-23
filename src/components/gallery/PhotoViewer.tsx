"use client";

import Image from "next/image";
import { motion, AnimatePresence, type Variants } from "framer-motion";
import { useCallback, useEffect, useRef, useState } from "react";
import { Photo } from "@/lib/photos";
import { useIsMobile } from "@/hooks/useIsMobile";

interface PhotoViewerProps {
  photo: Photo | null;
  onClose: () => void;
  onNavigate?: (direction: 1 | -1) => void;
}

const WHEEL_COOLDOWN_MS = 600;

/** Match the card's 3D rotation for open/close transition */
const CARD_ROTATE_X = -10;
const CARD_ROTATE_Y = -18;
const CARD_ROTATE_Z = 2;

const scaleVariants: Variants = {
  enter: {
    scale: 0.5,
    opacity: 0,
    rotateX: CARD_ROTATE_X,
    rotateY: CARD_ROTATE_Y,
    rotateZ: CARD_ROTATE_Z,
  },
  center: { scale: 1, opacity: 1, rotateX: 0, rotateY: 0, rotateZ: 0 },
  exit: {
    scale: 0.5,
    opacity: 0,
    rotateX: CARD_ROTATE_X,
    rotateY: CARD_ROTATE_Y,
    rotateZ: CARD_ROTATE_Z,
  },
};

export default function PhotoViewer({
  photo,
  onClose,
  onNavigate,
}: PhotoViewerProps) {
  const wheelCooldown = useRef(false);
  const [direction, setDirection] = useState<1 | -1>(1);
  const isNavigating = useRef(false);
  const isMobile = useIsMobile();

  const slideOffset = isMobile ? "100vw" : "60vw";

  const slideVariants: Variants = {
    enter: (dir: 1 | -1) => ({
      x: dir === 1 ? slideOffset : `-${slideOffset}`,
    }),
    center: { x: 0 },
    exit: (dir: 1 | -1) => ({
      x: dir === 1 ? `-${slideOffset}` : slideOffset,
    }),
  };

  const navigateWithDirection = useCallback(
    (dir: 1 | -1) => {
      isNavigating.current = true;
      setDirection(dir);
      onNavigate?.(dir);
    },
    [onNavigate],
  );

  // Full-screen swipe for mobile navigation
  useEffect(() => {
    if (!photo) return;
    let startX = 0;
    let startY = 0;

    const onTouchStart = (e: TouchEvent) => {
      startX = e.touches[0].clientX;
      startY = e.touches[0].clientY;
    };
    const onTouchEnd = (e: TouchEvent) => {
      const dx = e.changedTouches[0].clientX - startX;
      const dy = e.changedTouches[0].clientY - startY;
      if (Math.abs(dx) < 50 || Math.abs(dx) < Math.abs(dy)) return;
      navigateWithDirection(dx < 0 ? 1 : -1);
    };

    document.addEventListener("touchstart", onTouchStart, { passive: true });
    document.addEventListener("touchend", onTouchEnd, { passive: true });
    return () => {
      document.removeEventListener("touchstart", onTouchStart);
      document.removeEventListener("touchend", onTouchEnd);
    };
  }, [photo, navigateWithDirection]);

  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowRight" || e.key === "ArrowDown")
        navigateWithDirection(1);
      if (e.key === "ArrowLeft" || e.key === "ArrowUp")
        navigateWithDirection(-1);
    },
    [onClose, navigateWithDirection],
  );

  const handleWheel = useCallback(
    (e: WheelEvent) => {
      e.preventDefault();
      if (wheelCooldown.current || !onNavigate) return;

      const delta =
        Math.abs(e.deltaY) > Math.abs(e.deltaX) ? e.deltaY : e.deltaX;
      if (Math.abs(delta) < 30) return;

      const dir = delta > 0 ? 1 : -1;
      navigateWithDirection(dir);

      wheelCooldown.current = true;
      setTimeout(() => {
        wheelCooldown.current = false;
      }, WHEEL_COOLDOWN_MS);
    },
    [onNavigate, navigateWithDirection],
  );

  // Reset isNavigating when viewer closes
  useEffect(() => {
    if (!photo) {
      isNavigating.current = false;
    }
  }, [photo]);

  useEffect(() => {
    if (!photo) return;

    document.addEventListener("keydown", handleKeyDown);
    document.addEventListener("wheel", handleWheel, { passive: false });
    document.body.style.overflow = "hidden";

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.removeEventListener("wheel", handleWheel);
      document.body.style.overflow = "";
    };
  }, [photo, handleKeyDown, handleWheel]);

  const isOpen = photo !== null;
  const useSlide = isNavigating.current;
  const variants = useSlide ? slideVariants : scaleVariants;

  return (
    <>
      {/* Backdrop */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            key="backdrop"
            className="fixed inset-0 z-60 bg-black/70 cursor-pointer"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            onClick={onClose}
          />
        )}
        {isOpen && isMobile && (
          <motion.button
            key="close-btn"
            className="fixed top-4 right-4 z-[70] w-10 h-10 flex items-center justify-center text-white/80"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            aria-label="Close"
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
              <path d="M18 6L6 18M6 6l12 12" />
            </svg>
          </motion.button>
        )}
      </AnimatePresence>

      {/* Photo — custom direction ensures correct exit direction */}
      <AnimatePresence mode="popLayout" custom={direction}>
        {photo && (
          <motion.div
            key={photo.id}
            custom={direction}
            variants={variants}
            initial="enter"
            animate="center"
            exit="exit"
            className="fixed inset-0 z-60 flex items-center justify-center pointer-events-none"
            transition={
              useSlide
                ? { duration: 0.35, ease: "linear" }
                : { duration: 0.4, ease: [0.22, 1, 0.36, 1] }
            }
          >
            <div
              className="flex flex-col items-center cursor-default pointer-events-auto"
              onClick={(e) => e.stopPropagation()}
            >
              <Image
                src={photo.src}
                alt={photo.alt}
                width={photo.width}
                height={photo.height}
                className="max-h-[80vh] max-w-[90vw] w-auto h-auto"
                unoptimized
                priority
              />
              <p className="mt-3 text-[10px] md:text-xs uppercase tracking-widest text-zinc-500">
                {photo.id}
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
