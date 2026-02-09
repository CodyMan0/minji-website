"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { PHOTOS } from "@/lib/constants";
import PhotoViewer from "@/components/gallery/PhotoViewer";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

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

/** Reveal gallery uses first 6 photos in an asymmetric layout */
const revealPhotos = photos.slice(0, 6);

/** Horizontal gallery uses all 10 */
const horizontalPhotos = photos;

/** Layout config for the asymmetric reveal grid */
const revealLayout: { colSpan: string; aspectRatio: string }[] = [
  { colSpan: "col-span-8 col-start-1", aspectRatio: "aspect-[4/3]" },
  { colSpan: "col-span-5 col-start-7", aspectRatio: "aspect-[3/4]" },
  { colSpan: "col-span-6 col-start-2", aspectRatio: "aspect-[16/9]" },
  { colSpan: "col-span-5 col-start-6", aspectRatio: "aspect-[3/2]" },
  { colSpan: "col-span-7 col-start-1", aspectRatio: "aspect-[3/4]" },
  { colSpan: "col-span-6 col-start-5", aspectRatio: "aspect-[4/3]" },
];

export default function ExhibitionPage() {
  const revealSectionRef = useRef<HTMLDivElement>(null);
  const revealItemRefs = useRef<(HTMLDivElement | null)[]>([]);
  const horizontalSectionRef = useRef<HTMLDivElement>(null);
  const horizontalContainerRef = useRef<HTMLDivElement>(null);
  const [selectedPhoto, setSelectedPhoto] = useState<
    (typeof photos)[number] | null
  >(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Section 2: Blur-to-sharp reveal for each photo
      revealItemRefs.current.forEach((el) => {
        if (!el) return;
        gsap.fromTo(
          el,
          { opacity: 0, filter: "blur(20px)" },
          {
            opacity: 1,
            filter: "blur(0px)",
            duration: 1,
            ease: "power2.out",
            scrollTrigger: {
              trigger: el,
              start: "top 85%",
              end: "top 40%",
              scrub: 1,
            },
          }
        );
      });

      // Section 3: Horizontal scroll pinned gallery
      const container = horizontalContainerRef.current;
      const section = horizontalSectionRef.current;
      if (container && section) {
        const getScrollAmount = () =>
          -(container.scrollWidth - window.innerWidth);

        gsap.to(container, {
          x: getScrollAmount,
          ease: "none",
          scrollTrigger: {
            trigger: section,
            pin: true,
            pinSpacing: true,
            pinReparent: false,
            scrub: 1,
            end: () => "+=" + container.scrollWidth,
            invalidateOnRefresh: true,
          },
        });
      }
    });

    return () => {
      ScrollTrigger.getAll().forEach((t) => t.kill());
      ctx.revert();
    };
  }, []);

  return (
    <>
      {/* ===== Section 1: Hero Title ===== */}
      <section className="h-[calc(100vh-5rem)] flex flex-col items-center justify-center relative px-8">
        <div className="text-center">
          <motion.p
            className="text-sm uppercase tracking-[0.3em] text-zinc-500 mb-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.2 }}
          >
            JDZ CHUNG
          </motion.p>
          <motion.h1
            className="text-6xl md:text-8xl lg:text-9xl font-light tracking-tight leading-none"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.2, delay: 0.4 }}
          >
            The ART OF
          </motion.h1>
          <motion.h1
            className="text-7xl md:text-[10rem] lg:text-[14rem] font-extralight tracking-tighter leading-none mt-2"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.2, delay: 0.6 }}
          >
            LIGHT
          </motion.h1>
        </div>
        <motion.p
          className="absolute bottom-12 text-xs uppercase tracking-[0.2em] text-zinc-600"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 1.2 }}
        >
          online exhibition
        </motion.p>
      </section>

      {/* ===== Section 2: Photo Reveal Gallery ===== */}
      <section ref={revealSectionRef} className="py-32 px-8 md:px-16">
        <div className="max-w-7xl mx-auto grid grid-cols-12 gap-y-24 md:gap-y-40">
          {revealPhotos.map((photo, i) => (
            <div
              key={photo.id}
              ref={(el) => {
                revealItemRefs.current[i] = el;
              }}
              className={`${revealLayout[i].colSpan} opacity-0`}
            >
              <div className={`relative ${revealLayout[i].aspectRatio} overflow-hidden`}>
                <Image
                  src={photo.src}
                  alt={photo.alt}
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 100vw, 60vw"
                />
              </div>
              <p className="mt-3 text-[10px] uppercase tracking-widest text-zinc-600">
                {photo.id}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* ===== Section 3: Horizontal Scroll Gallery ===== */}
      <section
        ref={horizontalSectionRef}
        className="relative overflow-hidden"
      >
        <div
          ref={horizontalContainerRef}
          className="flex items-center gap-8 px-[10vw] h-screen"
        >
          {horizontalPhotos.map((photo) => (
            <div
              key={photo.id}
              className="shrink-0 cursor-pointer group"
              onClick={() => setSelectedPhoto(photo)}
            >
              <div className="relative h-[70vh] w-auto aspect-[3/4] overflow-hidden">
                <Image
                  src={photo.src}
                  alt={photo.alt}
                  fill
                  className="object-cover transition-transform duration-500 group-hover:scale-105"
                  sizes="(max-width: 768px) 80vw, 40vw"
                />
              </div>
              <p className="mt-3 text-[10px] uppercase tracking-widest text-zinc-600 group-hover:text-zinc-400 transition-colors">
                {photo.id}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* Spacer after pinned section so the page doesn't end abruptly */}
      <div className="h-[20vh]" />

      {/* ===== Photo Viewer Overlay ===== */}
      <PhotoViewer
        photo={selectedPhoto}
        onClose={() => setSelectedPhoto(null)}
      />
    </>
  );
}
