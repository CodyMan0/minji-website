"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import type { Photo } from "@/lib/photos";

const CARD_EASE: [number, number, number, number] = [0.32, 0.72, 0, 1];
const ANIMATION_DURATION = 0.6;

interface PhotoCardProps {
  photo: Photo;
  offset: number;
  isGone: boolean;
  isHovered: boolean;
  totalCount: number;
  index: number;
  onHover: (index: number | null) => void;
  onClick: () => void;
}

const BASE_X = -22; // vw from center
const BASE_Y = 15; // vh from center
const SPREAD_X = 75; // px per card horizontal
const SPREAD_Y = 60; // px per card vertical
const MAX_VISIBLE_OFFSET = 7;
const HOVER_SHIFT = 30; // px shift on hover

export default function PhotoCard({
  photo,
  offset,
  isGone,
  isHovered,
  totalCount,
  index,
  onHover,
  onClick,
}: PhotoCardProps) {
  const hoverShift = isHovered && !isGone ? HOVER_SHIFT : 0;
  const isVisible = !isGone && offset <= MAX_VISIBLE_OFFSET;

  return (
    <motion.div
      className="absolute cursor-pointer"
      style={{
        zIndex: totalCount - index,
        transformOrigin: "center center",
      }}
      initial={false}
      animate={{
        x: isGone
          ? "-120vw"
          : `calc(50vw + ${BASE_X}vw + ${offset * SPREAD_X + hoverShift}px)`,
        y: isGone
          ? "50vh"
          : `calc(50vh + ${BASE_Y}vh + ${-offset * SPREAD_Y}px)`,
        scale: isGone ? 0.8 : 1,
        opacity: isGone ? 0 : offset > MAX_VISIBLE_OFFSET ? 0 : 1,
      }}
      transition={{
        duration: isHovered ? 0.3 : ANIMATION_DURATION,
        ease: CARD_EASE,
      }}
      onMouseEnter={() => onHover(index)}
      onMouseLeave={() => onHover(null)}
      onClick={(e) => {
        e.stopPropagation();
        if (isVisible) onClick();
      }}
    >
      <div
        className="relative overflow-hidden shadow-2xl"
        style={{
          width: "clamp(300px, 30vw, 500px)",
          height: "clamp(375px, 37vw, 625px)",
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
          priority={index < 3}
        />
      </div>
    </motion.div>
  );
}
