"use client";

import { useState } from "react";
import Image from "next/image";
import { photos } from "@/lib/photos";
import type { Photo } from "@/lib/photos";
import PhotoViewer from "@/components/gallery/PhotoViewer";

/** Each photo's aspect ratio matching the design layout */
const PHOTO_ASPECTS: string[] = [
  "aspect-[4/3]",
  "aspect-[4/3]",
  "aspect-square",
  "aspect-[3/4]",
  "aspect-[3/4]",
  "aspect-square",
  "aspect-square",
  "aspect-[4/3]",
  "aspect-[3/4]",
  "aspect-[3/4]",
];

function BackToTopButton() {
  return (
    <section className="pb-32 flex flex-col items-center justify-center gap-6">
      <button
        onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
        className="flex flex-col items-center gap-6 cursor-pointer group"
      >
        <div className="w-14 h-14 rounded-sm bg-zinc-800/80 flex items-center justify-center transition-colors group-hover:bg-white">
          <svg
            width="36"
            height="36"
            viewBox="0 0 24 24"
            fill="none"
            className="text-white group-hover:text-black transition-colors"
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
        <span className="text-md uppercase tracking-[0.2em] text-white font-light">
          BACK TO TOP
        </span>
      </button>
    </section>
  );
}

export default function GalleryPage() {
  const [selectedPhoto, setSelectedPhoto] = useState<Photo | null>(null);

  return (
    <>
      <section className="min-h-screen px-6 md:px-10 lg:px-12 pt-20 pb-16 flex items-start">
        <div className="w-full grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-x-4 gap-y-6 md:gap-x-5 md:gap-y-8 items-start">
          {photos.map((photo, i) => (
            <div
              key={photo.id}
              className="cursor-pointer group"
              onClick={() => setSelectedPhoto(photo)}
            >
              <div
                className={`relative ${PHOTO_ASPECTS[i]} overflow-hidden bg-zinc-900`}
              >
                <Image
                  src={photo.src}
                  alt={photo.alt}
                  fill
                  className="object-cover transition-transform duration-500 group-hover:scale-105"
                  sizes="(max-width: 640px) 50vw, (max-width: 768px) 33vw, 20vw"
                />
              </div>
              <p className="mt-2 text-[10px] uppercase tracking-widest text-zinc-600 group-hover:text-zinc-400 transition-colors">
                {photo.id}
              </p>
            </div>
          ))}
        </div>
      </section>

      <section className="py-32 flex flex-col items-center justify-center gap-4 px-8">
        <p className="text-sm md:text-base uppercase tracking-[0.3em] text-center">
          WHAT DO YOU THINK IT WAS SHOT ON?
          <span className="inline-block w-2.5 h-4 bg-white ml-2 align-middle animate-pulse" />
        </p>
        <p className="text-sm md:text-base uppercase tracking-[0.3em] text-center">
          WAIT FOR THE FINAL REVEAL
          <span className="inline-block w-2.5 h-4 bg-white ml-2 align-middle animate-pulse" />
        </p>
      </section>

      <BackToTopButton />

      <PhotoViewer
        photo={selectedPhoto}
        onClose={() => setSelectedPhoto(null)}
      />
    </>
  );
}
