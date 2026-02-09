"use client";

import { useState, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion, useInView } from "framer-motion";
import { PHOTOS } from "@/lib/constants";
import PhotoViewer from "@/components/gallery/PhotoViewer";
import { useTypewriter } from "@/hooks/useTypewriter";

function getPhotoSrc(index: number): string {
  if (index >= 6) return `/images/photo${index - 6 + 1}.jpg`;
  return `/images/photo${index + 1}.jpg`;
}

const photos = PHOTOS.map((p, i) => ({ ...p, src: getPhotoSrc(i) }));

function PhotoCard({
  photo,
  index,
  rowDelay,
  onClick,
}: {
  photo: (typeof photos)[number];
  index: number;
  rowDelay: number;
  onClick: () => void;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-50px" });
  const isPortrait = index % 2 === 0;

  return (
    <motion.div
      ref={ref}
      className="cursor-pointer group relative overflow-hidden"
      initial={{ y: 100, opacity: 0 }}
      animate={isInView ? { y: 0, opacity: 1 } : { y: 100, opacity: 0 }}
      transition={{
        type: "spring",
        stiffness: 100,
        damping: 20,
        delay: rowDelay,
      }}
      onClick={onClick}
    >
      <div
        className={`relative w-full ${isPortrait ? "aspect-[2/3]" : "aspect-[3/2]"} overflow-hidden`}
      >
        <Image
          src={photo.src}
          alt={photo.alt}
          fill
          className="object-cover transition-transform duration-500 group-hover:scale-105"
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
        />
      </div>
      <p className="absolute bottom-3 left-3 text-xs uppercase tracking-widest text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300">
        {photo.id}
      </p>
    </motion.div>
  );
}

function TypingSection() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(sectionRef, { once: true, margin: "-100px" });

  const { displayText: line1, isComplete: line1Complete } = useTypewriter(
    isInView ? "WHAT DO YOU THINK IT WAS SHOT ON?" : "",
    60
  );

  const { displayText: line2 } = useTypewriter(
    line1Complete ? "WAIT FOR THE FINAL REVEAL" : "",
    50,
    1000
  );

  return (
    <section
      ref={sectionRef}
      className="min-h-screen bg-black flex flex-col items-center justify-center px-8"
    >
      <p className="text-2xl md:text-4xl font-light italic text-zinc-300 tracking-tight text-center min-h-[2.5em]">
        {line1}
        {!line1Complete && line1.length > 0 && (
          <span className="inline-block w-[2px] h-[1em] bg-zinc-300 ml-1 animate-pulse align-middle" />
        )}
      </p>
      {line1Complete && (
        <p className="text-lg md:text-xl text-zinc-500 uppercase tracking-[0.2em] text-center mt-8 min-h-[1.5em]">
          {line2}
          {line2.length > 0 && line2.length < "WAIT FOR THE FINAL REVEAL".length && (
            <span className="inline-block w-[2px] h-[1em] bg-zinc-500 ml-1 animate-pulse align-middle" />
          )}
        </p>
      )}
    </section>
  );
}

export default function GalleryPage() {
  const [selectedPhoto, setSelectedPhoto] = useState<(typeof photos)[number] | null>(null);

  const getRowDelay = (index: number, columns: number) => {
    const row = Math.floor(index / columns);
    return row * 0.2;
  };

  return (
    <>
      <section className="py-24 px-8 md:px-16">
        <p className="text-xs uppercase tracking-[0.3em] text-zinc-500 text-center mb-16">
          INDEX
        </p>
        <div className="max-w-7xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
          {photos.map((photo, i) => (
            <PhotoCard
              key={photo.id}
              photo={photo}
              index={i}
              rowDelay={getRowDelay(i, 3)}
              onClick={() => setSelectedPhoto(photo)}
            />
          ))}
        </div>
      </section>

      <TypingSection />

      <section className="min-h-screen bg-black flex flex-col items-center justify-center px-8">
        <button
          onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
          className="text-xl uppercase tracking-[0.3em] text-white bg-transparent border border-zinc-700 px-12 py-6 transition-all duration-300 hover:bg-white hover:text-black cursor-pointer"
        >
          BACK TO TOP
        </button>
        <Link
          href="/countdown"
          className="mt-8 text-sm text-zinc-500 uppercase tracking-[0.2em] hover:text-zinc-300 transition-colors"
        >
          &rarr; THE FINAL REVEAL
        </Link>
      </section>

      <PhotoViewer
        photo={selectedPhoto}
        onClose={() => setSelectedPhoto(null)}
      />
    </>
  );
}
