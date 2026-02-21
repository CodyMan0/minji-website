export interface Photo {
  id: string;
  src: string;
  alt: string;
  width: number;
  height: number;
}

/** Actual pixel dimensions from Figma source [width, height] */
const PHOTO_DATA: [string, number, number][] = [
  ["photo01.jpg", 1085, 1440],
  ["photo02.jpg", 1081, 1440],
  ["photo03.jpg", 1085, 1440],
  ["photo04.jpg", 1085, 1440],
  ["photo05.jpg", 1081, 1440],
  ["photo06.jpg", 1085, 1440],
  ["photo07.jpg", 1440, 1085],
  ["photo08.jpg", 1085, 1440],
  ["photo09.jpg", 1440, 1080],
  ["photo10.jpg", 1440, 1080],
  ["photo11.jpg", 1081, 1440],
  ["photo12.jpg", 1085, 1440],
  ["photo13.jpg", 1085, 1440],
  ["photo14.jpg", 1085, 1440],
  ["photo15.jpg", 1085, 1440],
  ["photo16.jpg", 1085, 1440],
  ["photo17.jpg", 1081, 1440],
  ["photo18.jpg", 1081, 1440],
  ["photo19.jpg", 1081, 1440],
  ["photo20.jpg", 1081, 1440],
  ["photo21.jpg", 1081, 1440],
  ["photo22.jpg", 1081, 1440],
];

export const photos: Photo[] = PHOTO_DATA.map(([file, width, height], i) => ({
  id: `JDZ-${String(i + 1).padStart(2, "0")}`,
  src: `/images/${file}`,
  alt: `JDZ CHUNG - Photo ${i + 1}`,
  width,
  height,
}));
