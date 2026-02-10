export const LAUNCH_DATE = new Date("2026-03-06T00:00:00+09:00");

export const PHOTOS = Array.from({ length: 10 }, (_, i) => ({
  id: `JDZ-${String(i + 1).padStart(2, "0")}`,
  src: `/images/photo${i + 1}.jpg`,
  alt: `JDZ CHUNG - Photo ${i + 1}`,
}));

export const NAV_LINKS = [
  { label: "INDEX", href: "/gallery" },
  { label: "MASTER PHOTOGRAPHER JDZ", href: "/master" },
] as const;

export const ARTIST = {
  name: "JDZ CHUNG",
  collaboration: "xiaomi Korea x Jdz chung",
  theme: "THE ART OF LIGHT",
  keywords: ["Light", "Moment", "Reality"],
  about: "안녕하세요. 포토그래퍼 JDZ입니다. 어릴 때부터 사진이 취미였고, 사람을 담는 과정이 재미있어서 자연스럽게 사진을 시작했습니다. 친구들을 찍어주다가 점점 작업으로 확장됐고, 2012년부터 본격적으로 스튜디오를 운영하며 매거진 화보와 스트리트 포토그래피 작업을 이어오고 있습니다.",
  philosophy: "사진은 결국 빛을 가지고 노는 작업이라고 생각합니다. 빛을 어떻게 읽고, 특히 반사되는 빛을 어떻게 살리느냐가 중요합니다. 의도적으로 만들기보다는 찍다 보면 자연스럽게 만들어지는 빛의 결을 좋아합니다.",
} as const;
