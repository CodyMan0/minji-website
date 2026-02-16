"use client";

import { useState, useRef, useEffect, useCallback, useSyncExternalStore } from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import { photos } from "@/lib/photos";
import type { Photo } from "@/lib/photos";
import PhotoViewer from "@/components/gallery/PhotoViewer";
import { padTwo } from "@/lib/format";

/** Layout: photos arranged diagonally bottom-left → top-right */
const DIAGONAL_X_STEP = 8;
const DIAGONAL_Y_STEP = -5.5;
const PHOTO_ROTATE_Y = -18;
const EDGE_THICKNESS = 5;
const SCROLL_SENSITIVITY = 0.6;
const LERP_FACTOR = 0.07;
const X_OFFSET = 5;
const Y_OFFSET = 32;

/** Base size for the longer side of each card */
const CARD_BASE_VW = 28;

/** Calculate card dimensions from actual image aspect ratio */
function getCardSize(w: number, h: number): { width: string; height: string } {
  const ratio = w / h;
  if (ratio >= 1) {
    // landscape or square
    const hVw = CARD_BASE_VW / ratio;
    return {
      width: `${CARD_BASE_VW}vw`,
      height: `${hVw}vw`,
    };
  }
  // portrait
  const wVw = CARD_BASE_VW * ratio;
  return {
    width: `${wVw}vw`,
    height: `${CARD_BASE_VW}vw`,
  };
}

/** Calculate the scroll progress needed to center a photo by index */
function getProgressForIndex(index: number): number {
  const targetX = index * DIAGONAL_X_STEP + X_OFFSET;
  const centerOffset = 20; // vw to center in viewport
  return Math.max(0, targetX - centerOffset);
}

export default function ExhibitionPage() {
  const [scrollProgress, setScrollProgress] = useState(0);
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const animationRef = useRef<number | null>(null);
  const targetProgress = useRef(0);

  // SSR-safe mounted check without setState in useEffect
  const mounted = useSyncExternalStore(
    () => () => {},
    () => true,
    () => false
  );

  const maxProgress = (photos.length - 3) * DIAGONAL_X_STEP;

  const selectedPhoto: Photo | null =
    selectedIndex !== null ? photos[selectedIndex] : null;

  // Smooth diagonal scroll with lerp
  useEffect(() => {
    const animate = () => {
      setScrollProgress((prev) => {
        const diff = targetProgress.current - prev;
        if (Math.abs(diff) < 0.01) return targetProgress.current;
        return prev + diff * LERP_FACTOR;
      });
      animationRef.current = requestAnimationFrame(animate);
    };

    animationRef.current = requestAnimationFrame(animate);
    return () => {
      if (animationRef.current) cancelAnimationFrame(animationRef.current);
    };
  }, []);

  // Wheel: scroll along the diagonal axis (only when viewer is closed)
  useEffect(() => {
    const el = containerRef.current;
    if (!el || selectedIndex !== null) return;

    const handleWheel = (e: WheelEvent) => {
      e.preventDefault();
      const delta =
        (Math.abs(e.deltaY) > Math.abs(e.deltaX) ? e.deltaY : e.deltaX) *
        SCROLL_SENSITIVITY;
      const vw = window.innerWidth / 100;
      const deltaVw = delta / vw;
      targetProgress.current = Math.max(
        0,
        Math.min(maxProgress, targetProgress.current + deltaVw)
      );
    };

    el.addEventListener("wheel", handleWheel, { passive: false });
    return () => el.removeEventListener("wheel", handleWheel);
  }, [maxProgress, selectedIndex]);

  // When a photo is selected, scroll background to center it
  const scrollToPhoto = useCallback(
    (index: number) => {
      const progress = getProgressForIndex(index);
      targetProgress.current = Math.min(progress, maxProgress);
    },
    [maxProgress]
  );

  // Open viewer and center background on the photo
  const handlePhotoClick = useCallback(
    (index: number) => {
      setSelectedIndex(index);
      scrollToPhoto(index);
    },
    [scrollToPhoto]
  );

  // Navigate between photos in the viewer
  const handleNavigate = useCallback(
    (direction: 1 | -1) => {
      if (selectedIndex === null) return;

      const nextIndex = selectedIndex + direction;
      if (nextIndex < 0 || nextIndex >= photos.length) return;

      setSelectedIndex(nextIndex);
      scrollToPhoto(nextIndex);
    },
    [selectedIndex, scrollToPhoto]
  );

  const handleClose = useCallback(() => {
    setSelectedIndex(null);
  }, []);

  const yRatio = DIAGONAL_Y_STEP / DIAGONAL_X_STEP;

  const currentIndex = Math.min(
    Math.floor(scrollProgress / DIAGONAL_X_STEP),
    photos.length - 1
  );

  return (
    <>
      {/* Fixed viewport container */}
      <div
        ref={containerRef}
        className="fixed inset-0 bg-black overflow-hidden"
        style={{ perspective: "1200px", zIndex: 1 }}
      >
        {/* Diagonal photo strip — moves diagonally within fixed viewport */}
        <motion.div
          className="absolute w-full h-full"
          style={{
            transformStyle: "preserve-3d",
            transform: `translate(${-scrollProgress}vw, ${-scrollProgress * yRatio}vw)`,
            willChange: "transform",
          }}
          initial={{ scale: 0.9, opacity: 0, y: 20 }}
          animate={mounted ? { scale: 1, opacity: 1, y: 0 } : {}}
          transition={{
            duration: 1.5,
            ease: [0.22, 1, 0.36, 1],
          }}
        >
          {photos.map((photo, i) => {
            const x = i * DIAGONAL_X_STEP + X_OFFSET;
            const y = i * DIAGONAL_Y_STEP + Y_OFFSET;
            const { width: cardW, height: cardH } = getCardSize(photo.width, photo.height);

            return (
              <motion.div
                key={photo.id}
                className="absolute cursor-pointer"
                style={{
                  left: `${x}vw`,
                  top: `${y}vw`,
                  width: cardW,
                  height: cardH,
                  transformStyle: "preserve-3d",
                  transform: `rotateY(${PHOTO_ROTATE_Y}deg)`,
                }}
                whileHover={{ scale: 1.03 }}
                transition={{ duration: 0.3, ease: "easeOut" }}
                onClick={() => handlePhotoClick(i)}
              >
                {/* Front face */}
                <div
                  className="absolute inset-0 overflow-hidden bg-zinc-900 transition-all duration-300 hover:brightness-110"
                  style={{
                    backfaceVisibility: "hidden",
                    boxShadow:
                      "0 25px 80px rgba(0,0,0,0.7), 0 10px 30px rgba(0,0,0,0.5)",
                  }}
                >
                  <Image
                    src={photo.src}
                    alt={photo.alt}
                    fill
                    className="object-cover"
                    sizes="(max-width: 768px) 70vw, 32vw"
                    priority={i < 6}
                  />
                </div>

                {/* Right edge — 3D thickness */}
                <div
                  className="absolute top-0"
                  style={{
                    width: EDGE_THICKNESS,
                    height: "100%",
                    right: 0,
                    transform: `translateX(${EDGE_THICKNESS}px) rotateY(90deg)`,
                    transformOrigin: "left center",
                    background: "linear-gradient(to right, #aaa, #666)",
                  }}
                />

                {/* Bottom edge — 3D thickness */}
                <div
                  className="absolute left-0"
                  style={{
                    width: "100%",
                    height: EDGE_THICKNESS,
                    bottom: 0,
                    transform: `translateY(${EDGE_THICKNESS}px) rotateX(-90deg)`,
                    transformOrigin: "top center",
                    background: "linear-gradient(to bottom, #999, #444)",
                  }}
                />
              </motion.div>
            );
          })}
        </motion.div>

        {/* Card counter — fixed in viewport */}
        <div className="fixed bottom-4 right-8 z-50 text-[10px] uppercase tracking-widest text-zinc-600 font-light">
          {padTwo(currentIndex + 1)} / {padTwo(photos.length)}
        </div>
      </div>

      <PhotoViewer
        photo={selectedPhoto}
        onClose={handleClose}
        onNavigate={handleNavigate}
      />
    </>
  );
}
