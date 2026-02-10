"use client";

import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { useCallback, useEffect, useRef } from "react";
import { Photo } from "@/lib/photos";

interface PhotoViewerProps {
  photo: Photo | null;
  onClose: () => void;
  onNavigate?: (direction: 1 | -1) => void;
}

const WHEEL_COOLDOWN_MS = 400;

export default function PhotoViewer({
  photo,
  onClose,
  onNavigate,
}: PhotoViewerProps) {
  const wheelCooldown = useRef(false);

  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowRight" || e.key === "ArrowDown") onNavigate?.(1);
      if (e.key === "ArrowLeft" || e.key === "ArrowUp") onNavigate?.(-1);
    },
    [onClose, onNavigate]
  );

  // Wheel navigation with cooldown
  const handleWheel = useCallback(
    (e: WheelEvent) => {
      e.preventDefault();
      if (wheelCooldown.current || !onNavigate) return;

      const delta =
        Math.abs(e.deltaY) > Math.abs(e.deltaX) ? e.deltaY : e.deltaX;
      if (Math.abs(delta) < 10) return;

      const direction = delta > 0 ? 1 : -1;
      onNavigate(direction);

      wheelCooldown.current = true;
      setTimeout(() => {
        wheelCooldown.current = false;
      }, WHEEL_COOLDOWN_MS);
    },
    [onNavigate]
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

  return (
    <AnimatePresence mode="wait">
      {photo && (
        <motion.div
          key={photo.id}
          className="fixed inset-0 z-60 flex items-center justify-center bg-black/90 cursor-pointer"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
          onClick={onClose}
        >
          <motion.div
            className="relative max-w-4xl w-full mx-8 aspect-3/2 cursor-default"
            initial={{ opacity: 0, x: 60 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -60 }}
            transition={{ duration: 0.3, ease: "easeOut" }}
            onClick={(e) => e.stopPropagation()}
          >
            <Image
              src={photo.src}
              alt={photo.alt}
              fill
              className="object-contain"
              sizes="(max-width: 896px) 100vw, 896px"
              priority
            />
            <p className="absolute -bottom-10 left-0 text-xs uppercase tracking-widest text-zinc-500">
              {photo.id}
            </p>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
