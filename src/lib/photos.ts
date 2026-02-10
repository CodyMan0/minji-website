export interface Photo {
  id: string;
  src: string;
  alt: string;
}

const AVAILABLE_IMAGES = 6;

export function getPhotoSrc(index: number): string {
  const imageIndex = (index % AVAILABLE_IMAGES) + 1;
  return `/images/photo${imageIndex}.jpg`;
}

const TOTAL_PHOTOS = 50;

export const photos: Photo[] = Array.from({ length: TOTAL_PHOTOS }, (_, i) => ({
  id: `JDZ-${String(i + 1).padStart(2, "0")}`,
  src: getPhotoSrc(i),
  alt: `JDZ CHUNG - Photo ${i + 1}`,
}));
