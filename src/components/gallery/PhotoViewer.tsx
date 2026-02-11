"use client";

import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { useCallback, useEffect, useRef, useState } from "react";
import { Photo } from "@/lib/photos";

interface PhotoViewerProps {
  photo: Photo | null;
  onClose: () => void;
  onNavigate?: (direction: 1 | -1) => void;
}

const WHEEL_COOLDOWN_MS = 400;
const SLIDE_OFFSET = "100vw";

export default function PhotoViewer({
  photo,
  onClose,
  onNavigate,
}: PhotoViewerProps) {
  const wheelCooldown = useRef(false);
  const [direction, setDirection] = useState<1 | -1>(1);

  const navigateWithDirection = useCallback(
    (dir: 1 | -1) => {
      setDirection(dir);
      onNavigate?.(dir);
    },
    [onNavigate]
  );

  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowRight" || e.key === "ArrowDown") navigateWithDirection(1);
      if (e.key === "ArrowLeft" || e.key === "ArrowUp") navigateWithDirection(-1);
    },
    [onClose, navigateWithDirection]
  );

  const handleWheel = useCallback(
    (e: WheelEvent) => {
      e.preventDefault();
      if (wheelCooldown.current || !onNavigate) return;

      const delta =
        Math.abs(e.deltaY) > Math.abs(e.deltaX) ? e.deltaY : e.deltaX;
      if (Math.abs(delta) < 10) return;

      const dir = delta > 0 ? 1 : -1;
      navigateWithDirection(dir);

      wheelCooldown.current = true;
      setTimeout(() => {
        wheelCooldown.current = false;
      }, WHEEL_COOLDOWN_MS);
    },
    [onNavigate, navigateWithDirection]
  );

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

  return (
    <>
      {/* Backdrop — persists while any photo is open, no flicker */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            key="backdrop"
            className="fixed inset-0 z-60 bg-black/90 cursor-pointer"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            onClick={onClose}
          />
        )}
      </AnimatePresence>

      {/* Photo — slides directionally, backdrop stays */}
      <AnimatePresence mode="popLayout" custom={direction}>
        {photo && (
          <motion.div
            key={photo.id}
            custom={direction}
            className="fixed inset-0 z-60 flex items-center justify-center pointer-events-none"
            initial={{ x: direction === 1 ? SLIDE_OFFSET : `-${SLIDE_OFFSET}`, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: direction === 1 ? `-${SLIDE_OFFSET}` : SLIDE_OFFSET, opacity: 0 }}
            transition={{ duration: 0.4, ease: [0.25, 0.1, 0.25, 1] }}
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
                sizes="(max-width: 896px) 90vw, 56rem"
                priority
              />
              <p className="mt-3 text-xs uppercase tracking-widest text-zinc-500">
                {photo.id}
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
