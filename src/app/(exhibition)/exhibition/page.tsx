"use client";

import { useState, useCallback, useRef, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { PHOTOS } from "@/lib/constants";
import PhotoViewer from "@/components/gallery/PhotoViewer";

/** Map photo7-10 to photo1-4 since those files don't exist */
function getPhotoSrc(index: number): string {
  if (index >= 6) {
    return `/images/photo${index - 6 + 1}.jpg`;
  }
  return `/images/photo${index + 1}.jpg`;
}

const photos = PHOTOS.map((p, i) => ({
  ...p,
  src: getPhotoSrc(i),
}));

/** Ease curve for card animations - smooth deceleration */
const CARD_EASE: [number, number, number, number] = [0.32, 0.72, 0, 1];
const ANIMATION_DURATION = 0.6;
const COOLDOWN_MS = 600;

export default function ExhibitionPage() {
  const router = useRouter();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedPhoto, setSelectedPhoto] = useState<
    (typeof photos)[number] | null
  >(null);
  const isAnimating = useRef(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  /* ---- Wheel handler with cooldown ---- */
  const handleWheel = useCallback(
    (e: WheelEvent) => {
      e.preventDefault();
      if (isAnimating.current) return;

      if (e.deltaY > 0 && currentIndex < photos.length - 1) {
        isAnimating.current = true;
        setCurrentIndex((prev) => prev + 1);
        setTimeout(() => {
          isAnimating.current = false;
        }, COOLDOWN_MS);
      } else if (e.deltaY < 0 && currentIndex > 0) {
        isAnimating.current = true;
        setCurrentIndex((prev) => prev - 1);
        setTimeout(() => {
          isAnimating.current = false;
        }, COOLDOWN_MS);
      }
    },
    [currentIndex]
  );

  /* Attach wheel as non-passive so preventDefault works */
  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    el.addEventListener("wheel", handleWheel, { passive: false });
    return () => {
      el.removeEventListener("wheel", handleWheel);
    };
  }, [handleWheel]);

  /* ---- Background click -> go back ---- */
  const handleBackgroundClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      router.back();
    }
  };

  return (
    <>
      {/* Full-screen black canvas */}
      <div
        ref={containerRef}
        className="fixed inset-0 bg-black overflow-hidden cursor-default"
        onClick={handleBackgroundClick}
        style={{ zIndex: 1 }}
      >
        {/* ---- Stacked card deck ---- */}
        {photos.map((photo, i) => {
          const offset = i - currentIndex;
          const isGone = offset < 0;

          /*
           * Card positioning to match the screenshot:
           * - Front card (offset=0) sits at bottom-left area
           * - Each subsequent card offsets right (~100px) and up (~75px)
           * - Slight rotation increase per card for depth
           * - Cards beyond visible range (offset > 7) are hidden
           */
          const baseX = -22; // vw from center - starts further left
          const baseY = 15; // vh from center - pushes down more
          const spreadX = 75; // px offset per card to the right (tighter)
          const spreadY = 60; // px offset per card upward (tighter)
          const isHovered = hoveredIndex === i;
          const hoverShift = isHovered && !isGone ? 30 : 0; // px shift right on hover

          return (
            <motion.div
              key={photo.id}
              className="absolute cursor-pointer"
              style={{
                zIndex: photos.length - i,
                transformOrigin: "center center",
              }}
              initial={false}
              animate={{
                x: isGone
                  ? "-120vw"
                  : `calc(50vw + ${baseX}vw + ${offset * spreadX + hoverShift}px)`,
                y: isGone
                  ? "50vh"
                  : `calc(50vh + ${baseY}vh + ${-offset * spreadY}px)`,
                scale: isGone ? 0.8 : 1,
                opacity: isGone ? 0 : offset > 7 ? 0 : 1,
              }}
              transition={{
                duration: isHovered ? 0.3 : ANIMATION_DURATION,
                ease: CARD_EASE,
              }}
              onMouseEnter={() => setHoveredIndex(i)}
              onMouseLeave={() => setHoveredIndex(null)}
              onClick={(e) => {
                e.stopPropagation();
                if (!isGone && offset <= 7) {
                  setSelectedPhoto(photo);
                }
              }}
            >
              {/* Card frame with shadow for depth */}
              <div
                className="relative overflow-hidden shadow-2xl"
                style={{
                  width: "clamp(300px, 30vw, 500px)",
                  height: "clamp(375px, 37vw, 625px)",
                  /* Translate so the card's anchor is its center */
                  transform: "translate(-50%, -50%)",
                  boxShadow:
                    offset === 0
                      ? "0 25px 60px rgba(0,0,0,0.7), 0 10px 20px rgba(0,0,0,0.5)"
                      : "0 15px 40px rgba(0,0,0,0.5), 0 5px 15px rgba(0,0,0,0.3)",
                }}
              >
                <Image
                  src={photo.src}
                  alt={photo.alt}
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 260px, 400px"
                  priority={i < 3}
                />
              </div>
            </motion.div>
          );
        })}

        {/* ---- Bottom sub-navigation (OVERVIEW / INDEX tabs) ---- */}
        <div
          className="fixed bottom-4 left-8 flex items-center gap-3 z-50"
          style={{ marginLeft: "60px" }}
        >
          <div className="flex bg-zinc-900/80 backdrop-blur-sm rounded-md px-0.5 py-0.5 gap-0.5 text-[10px] uppercase tracking-widest font-light">
            <Link
              href="/exhibition"
              className="px-3 py-1.5 bg-white/10 text-white rounded-sm transition-colors"
            >
              Overview
            </Link>
            <Link
              href="/gallery"
              className="px-3 py-1.5 text-zinc-500 hover:text-zinc-300 rounded-sm transition-colors"
            >
              Index
            </Link>
          </div>
        </div>

        {/* ---- Card counter ---- */}
        <div className="fixed bottom-4 right-8 z-50 text-[10px] uppercase tracking-widest text-zinc-600 font-light">
          {String(currentIndex + 1).padStart(2, "0")} /{" "}
          {String(photos.length).padStart(2, "0")}
        </div>
      </div>

      {/* ---- Photo Viewer Overlay ---- */}
      <PhotoViewer
        photo={selectedPhoto}
        onClose={() => setSelectedPhoto(null)}
      />
    </>
  );
}
