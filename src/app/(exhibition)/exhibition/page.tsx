"use client";

import {
  useState,
  useRef,
  useEffect,
  useCallback,
  useSyncExternalStore,
} from "react";
import Image from "next/image";
import { photos } from "@/lib/photos";
import type { Photo } from "@/lib/photos";
import PhotoViewer from "@/components/gallery/PhotoViewer";
import { padTwo } from "@/lib/format";

const DIAGONAL_X_STEP = 8;
const DIAGONAL_Y_STEP = -5.5;
const PHOTO_ROTATE_X = 2;
const PHOTO_ROTATE_Y = -18;
const PHOTO_ROTATE_Z = 1;
const EDGE_THICKNESS = 10;
const SCROLL_SENSITIVITY = 0.6;
const LERP_FACTOR_MIN = 0.04;
const LERP_FACTOR_MAX = 0.15;
const X_OFFSET = 5;

const CARD_BASE_VW = 28;
const CARD_BASE_VW_MOBILE = 44;

const ENTRANCE_TARGET = 25;
const ENTRANCE_OVERSHOOT = 2;

function getCardSize(w: number, h: number, base: number): { width: string; height: string } {
  const ratio = w / h;
  if (ratio >= 1) {
    const hVw = base / ratio;
    return { width: `${base}vw`, height: `${hVw}vw` };
  }
  const wVw = base * ratio;
  return { width: `${wVw}vw`, height: `${base}vw` };
}

function getProgressForIndex(index: number): number {
  const targetX = index * DIAGONAL_X_STEP + X_OFFSET;
  const centerOffset = 20;
  return Math.max(0, targetX - centerOffset);
}

export default function ExhibitionPage() {
  const [scrollProgress, setScrollProgress] = useState(0);
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const animationRef = useRef<number | null>(null);
  const targetProgress = useRef(ENTRANCE_TARGET + ENTRANCE_OVERSHOOT);
  const hasBounced = useRef(false);
  const touchStartX = useRef(0);
  const touchStartY = useRef(0);
  const isDragging = useRef(false);

  const isMobile = useSyncExternalStore(
    () => () => {},
    () => window.innerWidth < 768,
    () => false,
  );
  const cardBase = isMobile ? CARD_BASE_VW_MOBILE : CARD_BASE_VW;

  const mounted = useSyncExternalStore(
    () => () => {},
    () => true,
    () => false,
  );

  const maxProgress = (photos.length - 3) * DIAGONAL_X_STEP;
  const totalCycle = photos.length * DIAGONAL_X_STEP;

  const selectedPhoto: Photo | null =
    selectedIndex !== null ? photos[selectedIndex] : null;

  useEffect(() => {
    const animate = () => {
      setScrollProgress((prev) => {
        const diff = targetProgress.current - prev;

        if (
          !hasBounced.current &&
          prev >= ENTRANCE_TARGET &&
          targetProgress.current === ENTRANCE_TARGET + ENTRANCE_OVERSHOOT
        ) {
          hasBounced.current = true;
          targetProgress.current = ENTRANCE_TARGET - ENTRANCE_OVERSHOOT;
        }

        if (Math.abs(diff) < 0.01) return targetProgress.current;
        const t = Math.min(Math.abs(diff) / 20, 1);
        const factor =
          LERP_FACTOR_MIN + t * (LERP_FACTOR_MAX - LERP_FACTOR_MIN);
        return prev + diff * factor;
      });
      animationRef.current = requestAnimationFrame(animate);
    };

    animationRef.current = requestAnimationFrame(animate);
    return () => {
      if (animationRef.current) cancelAnimationFrame(animationRef.current);
    };
  }, []);

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
      targetProgress.current = targetProgress.current + deltaVw;
    };

    el.addEventListener("wheel", handleWheel, { passive: false });
    return () => el.removeEventListener("wheel", handleWheel);
  }, [maxProgress, selectedIndex]);

  useEffect(() => {
    const el = containerRef.current;
    if (!el || selectedIndex !== null) return;

    const handleTouchStart = (e: TouchEvent) => {
      touchStartX.current = e.touches[0].clientX;
      touchStartY.current = e.touches[0].clientY;
      isDragging.current = false;
    };

    const handleTouchMove = (e: TouchEvent) => {
      e.preventDefault();
      isDragging.current = true;
      const dx = touchStartX.current - e.touches[0].clientX;
      const dy = touchStartY.current - e.touches[0].clientY;
      const delta = (Math.abs(dy) > Math.abs(dx) ? dy : dx) * SCROLL_SENSITIVITY;
      const vw = window.innerWidth / 100;
      const deltaVw = delta / vw;
      targetProgress.current = targetProgress.current + deltaVw;
      touchStartX.current = e.touches[0].clientX;
      touchStartY.current = e.touches[0].clientY;
    };

    el.addEventListener("touchstart", handleTouchStart, { passive: true });
    el.addEventListener("touchmove", handleTouchMove, { passive: false });
    return () => {
      el.removeEventListener("touchstart", handleTouchStart);
      el.removeEventListener("touchmove", handleTouchMove);
    };
  }, [selectedIndex]);

  const scrollToPhoto = useCallback(
    (index: number) => {
      const progress = getProgressForIndex(index);
      const current = targetProgress.current;
      const cycle = Math.round((current - progress) / totalCycle);
      targetProgress.current = cycle * totalCycle + progress;
    },
    [totalCycle],
  );

  const handlePhotoClick = useCallback(
    (index: number) => {
      if (isDragging.current) return;
      setSelectedIndex(index);
      scrollToPhoto(index);
    },
    [scrollToPhoto],
  );

  const handleNavigate = useCallback(
    (direction: 1 | -1) => {
      setSelectedIndex((prev) => {
        if (prev === null) return null;
        const nextIndex = (prev + direction + photos.length) % photos.length;
        scrollToPhoto(nextIndex);
        return nextIndex;
      });
    },
    [scrollToPhoto],
  );

  const handleClose = useCallback(() => {
    setSelectedIndex(null);
  }, []);

  const yRatio = DIAGONAL_Y_STEP / DIAGONAL_X_STEP;

  const currentCycle = Math.floor(scrollProgress / totalCycle);

  const wrappedProgress =
    ((scrollProgress % totalCycle) + totalCycle) % totalCycle;
  const currentIndex = Math.min(
    Math.floor(wrappedProgress / DIAGONAL_X_STEP),
    photos.length - 1,
  );

  return (
    <>
      <div
        ref={containerRef}
        className="fixed inset-0 overflow-hidden"
        style={{ perspective: "1200px", zIndex: 1 }}
      >
        <div
          className="absolute w-full h-full"
          style={{
            transformStyle: "preserve-3d",
            transform: `translate(${-scrollProgress}vw, ${-scrollProgress * yRatio}vw)`,
            willChange: "transform",
            opacity: mounted ? 1 : 0,
          }}
        >
          {[currentCycle - 1, currentCycle, currentCycle + 1].flatMap((cycle) =>
            photos.map((photo, i) => {
              const x =
                (i + cycle * photos.length) * DIAGONAL_X_STEP + X_OFFSET;
              const y = (i + cycle * photos.length) * DIAGONAL_Y_STEP;
              const { width: cardW, height: cardH } = getCardSize(
                photo.width,
                photo.height,
                cardBase,
              );

              return (
                <div
                  key={`${cycle}-${photo.id}`}
                  className="absolute cursor-pointer"
                  style={{
                    left: `${x}vw`,
                    top: `calc(55dvh + ${y}vw)`,
                    width: cardW,
                    height: cardH,
                    transformStyle: "preserve-3d",
                    transform:
                      hoveredIndex === i
                        ? `rotateX(${PHOTO_ROTATE_X}deg) rotateY(${PHOTO_ROTATE_Y}deg) rotateZ(${PHOTO_ROTATE_Z}deg) translate(5vw, 1vw)`
                        : `rotateX(${PHOTO_ROTATE_X}deg) rotateY(${PHOTO_ROTATE_Y}deg) rotateZ(${PHOTO_ROTATE_Z}deg) translate(0, 0)`,
                    transition: "transform 0.25s ease-out",
                  }}
                  onMouseEnter={() => setHoveredIndex(i)}
                  onMouseLeave={() => setHoveredIndex(null)}
                  onClick={() => handlePhotoClick(i)}
                >
                  <div
                    className="absolute inset-0 overflow-hidden bg-zinc-900"
                    style={{
                      opacity: 0.92,
                      backfaceVisibility: "hidden",
                      boxShadow:
                        hoveredIndex === i
                          ? "0 35px 100px rgba(0,0,0,0.8), 0 15px 40px rgba(0,0,0,0.6), inset 0 0 30px rgba(255,255,255,0.05)"
                          : "0 25px 80px rgba(0,0,0,0.7), 0 10px 30px rgba(0,0,0,0.5)",
                      filter:
                        hoveredIndex === i
                          ? "brightness(1.1)"
                          : "brightness(1)",
                      transition: "filter 0.3s ease, box-shadow 0.4s ease",
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
                    <div
                      className="absolute inset-0 pointer-events-none"
                      style={{
                        background:
                          "linear-gradient(135deg, rgba(255,255,255,0.12) 0%, transparent 40%, transparent 60%, rgba(255,255,255,0.04) 100%)",
                      }}
                    />
                    <div
                      className="absolute inset-0 pointer-events-none"
                      style={{ border: "1px solid rgba(255,255,255,0.08)" }}
                    />
                  </div>

                  <div
                    className="absolute top-0"
                    style={{
                      width: EDGE_THICKNESS,
                      height: "100%",
                      right: 0,
                      transform: `translateX(${EDGE_THICKNESS}px) rotateY(90deg)`,
                      transformOrigin: "left center",
                      background:
                        "linear-gradient(to right, rgba(180,200,210,0.6), rgba(100,120,130,0.4))",
                    }}
                  />

                  <div
                    className="absolute left-0"
                    style={{
                      width: "100%",
                      height: EDGE_THICKNESS,
                      bottom: 0,
                      transform: `translateY(${EDGE_THICKNESS}px) rotateX(-90deg)`,
                      transformOrigin: "top center",
                      background:
                        "linear-gradient(to bottom, rgba(160,180,190,0.5), rgba(80,100,110,0.3))",
                    }}
                  />
                </div>
              );
            }),
          )}
        </div>

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
