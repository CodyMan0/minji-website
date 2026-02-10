"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { photos } from "@/lib/photos";
import type { Photo } from "@/lib/photos";
import PhotoViewer from "@/components/gallery/PhotoViewer";
import PhotoCard from "./_components/PhotoCard";
import SubNavigation from "./_components/SubNavigation";
import CardCounter from "./_components/CardCounter";
import { useWheelNavigation } from "./_hooks/useWheelNavigation";

export default function ExhibitionPage() {
  const router = useRouter();
  const { currentIndex, containerRef } = useWheelNavigation(photos.length - 1);
  const [selectedPhoto, setSelectedPhoto] = useState<Photo | null>(null);
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  const handleBackgroundClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) router.back();
  };

  return (
    <>
      <div
        ref={containerRef}
        className="fixed inset-0 bg-black overflow-hidden cursor-default"
        onClick={handleBackgroundClick}
        style={{ zIndex: 1 }}
      >
        {photos.map((photo, i) => {
          const offset = i - currentIndex;
          return (
            <PhotoCard
              key={photo.id}
              photo={photo}
              offset={offset}
              isGone={offset < 0}
              isHovered={hoveredIndex === i}
              totalCount={photos.length}
              index={i}
              onHover={setHoveredIndex}
              onClick={() => setSelectedPhoto(photo)}
            />
          );
        })}

        <SubNavigation />
        <CardCounter current={currentIndex} total={photos.length} />
      </div>

      <PhotoViewer
        photo={selectedPhoto}
        onClose={() => setSelectedPhoto(null)}
      />
    </>
  );
}
