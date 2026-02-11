export interface Photo {
  id: string;
  src: string;
  alt: string;
  width: number;
  height: number;
}

/** Actual pixel dimensions of each source image */
const IMAGE_DIMENSIONS: [number, number][] = [
  [800, 1200],  // photo1 — portrait
  [1200, 800],  // photo2 — landscape
  [900, 900],   // photo3 — square
  [1000, 1400], // photo4 — portrait
  [1400, 1000], // photo5 — landscape
  [850, 1100],  // photo6 — portrait
];

const AVAILABLE_IMAGES = IMAGE_DIMENSIONS.length;

export function getPhotoSrc(index: number): string {
  const imageIndex = (index % AVAILABLE_IMAGES) + 1;
  return `/images/photo${imageIndex}.jpg`;
}

const TOTAL_PHOTOS = 50;

export const photos: Photo[] = Array.from({ length: TOTAL_PHOTOS }, (_, i) => {
  const [width, height] = IMAGE_DIMENSIONS[i % AVAILABLE_IMAGES];
  return {
    id: `JDZ-${String(i + 1).padStart(2, "0")}`,
    src: getPhotoSrc(i),
    alt: `JDZ CHUNG - Photo ${i + 1}`,
    width,
    height,
  };
});
