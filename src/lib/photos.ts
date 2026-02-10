import { PHOTOS } from "./constants";

export interface Photo {
  id: string;
  src: string;
  alt: string;
}

/**
 * Maps photo index to actual file path.
 * Photos 7-10 fall back to photos 1-4 (placeholder mapping).
 */
const FALLBACK_THRESHOLD = 6;

export function getPhotoSrc(index: number): string {
  if (index >= FALLBACK_THRESHOLD) {
    return `/images/photo${index - FALLBACK_THRESHOLD + 1}.jpg`;
  }
  return `/images/photo${index + 1}.jpg`;
}

export const photos: Photo[] = PHOTOS.map((p, i) => ({
  ...p,
  src: getPhotoSrc(i),
}));
