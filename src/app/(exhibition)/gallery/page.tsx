"use client";

import { useState, useCallback, useRef } from "react";
import Image from "next/image";
import { motion, useInView } from "framer-motion";
import { photos } from "@/lib/photos";
import type { Photo } from "@/lib/photos";
import PhotoViewer from "@/components/gallery/PhotoViewer";
import { useTypewriter } from "@/hooks/useTypewriter";

// Repeating aspect ratio pattern for visual variety
const ASPECT_PATTERNS = [
  [
    "aspect-[4/3]",
    "aspect-[3/4]",
    "aspect-square",
    "aspect-[3/4]",
    "aspect-[4/3]",
  ],
  [
    "aspect-square",
    "aspect-[4/3]",
    "aspect-[2/3]",
    "aspect-[4/3]",
    "aspect-square",
  ],
];

const COLUMNS = 5;

function TypingTextSection() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(sectionRef, { once: true, amount: 0.5 });

  const { displayText: line1, isComplete: line1Done } = useTypewriter(
    "WHAT DO YOU THINK IT WAS SHOT ON?",
    60,
    isInView ? 0 : 999999,
  );
  const { displayText: line2 } = useTypewriter(
    "WAIT FOR THE FINAL REVEAL",
    60,
    line1Done ? 400 : 999999,
  );

  return (
    <section
      ref={sectionRef}
      className="relative h-dvh flex flex-col items-center justify-center gap-3 px-8"
    >
      <p
        className="uppercase text-center text-white flex items-center justify-center"
        style={{
          fontSize: "clamp(0.75rem, 1.49vw, 1.1rem)",
          letterSpacing: "-0.02em",
          minHeight: "1.5em",
        }}
      >
        {line1}
        {isInView && !line1Done && (
          <span className="inline-block w-[0.5em] h-[0.7em] bg-white ml-[0.1em] animate-blink" />
        )}
      </p>
      <p
        className="uppercase text-center text-white flex items-center justify-center"
        style={{
          fontSize: "clamp(0.75rem, 1.49vw, 1.1rem)",
          letterSpacing: "-0.02em",
          minHeight: "1.5em",
        }}
      >
        {line2}
        {line1Done && (
          <span className="inline-block w-[0.5em] h-[0.7em] bg-white ml-[0.1em] animate-blink" />
        )}
      </p>

      {/* Back to top — absolute bottom */}
      <button
        onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
        className="absolute bottom-[25%] left-1/2 -translate-x-1/2 flex flex-col items-center gap-3 cursor-pointer group"
      >
        <div
          className="flex items-center justify-center bg-white/10 transition-colors group-hover:bg-white"
          style={{
            width: "clamp(2rem, 3.6vw, 2.6rem)",
            height: "clamp(2rem, 3.6vw, 2.6rem)",
            borderRadius: "clamp(4px, 0.16vw, 6px)",
          }}
        >
          <svg
            viewBox="0 0 24 24"
            fill="none"
            className="text-white group-hover:text-black transition-colors"
            style={{
              width: "clamp(1rem, 1.5vw, 1.3rem)",
              height: "clamp(1rem, 1.5vw, 1.3rem)",
            }}
          >
            <path
              d="M12 20V4M12 4L5 11M12 4L19 11"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </div>
        <span
          className="uppercase text-white tracking-[-0.02em]"
          style={{ fontSize: "clamp(0.6rem, 1.05vw, 0.85rem)" }}
        >
          BACK TO TOP
        </span>
      </button>
    </section>
  );
}

export default function GalleryPage() {
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);

  const selectedPhoto: Photo | null =
    selectedIndex !== null ? photos[selectedIndex] : null;

  const handleNavigate = useCallback(
    (direction: 1 | -1) => {
      if (selectedIndex === null) return;
      const nextIndex = selectedIndex + direction;
      if (nextIndex < 0 || nextIndex >= photos.length) return;
      setSelectedIndex(nextIndex);
    },
    [selectedIndex],
  );

  const handleClose = useCallback(() => {
    setSelectedIndex(null);
  }, []);

  return (
    <>
      <section className="min-h-screen px-4 md:px-6 lg:px-8 pt-24 pb-16">
        <div className="w-full grid grid-cols-2 md:grid-cols-5 gap-3 md:gap-4 items-start">
          {photos.map((photo, i) => {
            const rowIndex = Math.floor(i / COLUMNS);
            const colIndex = i % COLUMNS;
            const patternRow =
              ASPECT_PATTERNS[rowIndex % ASPECT_PATTERNS.length];
            const aspectClass = patternRow[colIndex] || "aspect-square";

            return (
              <motion.div
                key={photo.id}
                className="cursor-pointer group"
                initial={{ opacity: 0, y: 100 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.15 }}
                transition={{
                  delay: colIndex * 0.02,
                  type: "spring",
                  stiffness: 20,
                  damping: 10,
                }}
                onClick={() => setSelectedIndex(i)}
              >
                <div
                  className={`relative ${aspectClass} overflow-hidden bg-zinc-900 border border-white/8`}
                  style={{ boxShadow: "0 4px 20px rgba(0,0,0,0.4)" }}
                >
                  <Image
                    src={photo.src}
                    alt={photo.alt}
                    fill
                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                    sizes="(max-width: 768px) 50vw, 20vw"
                  />
                </div>
                <p className="mt-2 text-[10px] md:text-[11px] uppercase tracking-[0.07em] text-[#52525d] group-hover:text-zinc-400 transition-colors">
                  {photo.id}
                </p>
              </motion.div>
            );
          })}
        </div>
      </section>

      {/* Text Section */}
      <TypingTextSection />

      <PhotoViewer
        photo={selectedPhoto}
        onClose={handleClose}
        onNavigate={handleNavigate}
      />
    </>
  );
}
