export const LAUNCH_DATE = new Date("2026-02-23T18:00:00+09:00");

export const PHOTOS = Array.from({ length: 10 }, (_, i) => ({
  id: `JDZ-${String(i + 1).padStart(2, "0")}`,
  src: `/images/photo${i + 1}.jpg`,
  alt: `JDZ CHUNG - Photo ${i + 1}`,
}));

export const NAV_LINKS = [
  { label: "OVERVIEW", href: "/gallery" },
  { label: "MASTER PHOTOGRAPHER JDZ", href: "/master" },
] as const;

export const ARTIST = {
  name: "JDZ CHUNG",
  collaboration: "xiaomi Korea x Jdz chung",
  theme: "THE ART OF LIGHT",
  keywords: ["Light", "Moment", "Reality"],
  bio: "서울을 기반으로 활동하며, 에디토리얼과 상업 사진, 개인 작업까지 폭넓은 영역에서 사진 작업을 이어가고 있다.\n주요 사진 작품들은 에스콰이어 코리아, GQ 코리아, 얼루어 코리아 등에 소개되었다.\nJDZ는 직관에 따라 순간의 진솔한 표정을 담아내며, 시적인 감수성이 깃든 독창적인 세계관으로 평가 받고 있다.",
  about:
    "안녕하세요. 포토그래퍼 JDZ입니다.\n어릴 때부터 사진이 취미였고, 사람을 담는 과정이 재미있어서 자연스럽게 사진을 시작했습니다. 친구들을 찍어주다가 점점 작업으로 확장됐고,\n2012년부터 본격적으로 스튜디오를 운영하며 매거진 화보와 스트리트 포토그래피 작업을 이어오고 있습니다.",
  philosophy:
    "사진은 결국 빛을 가지고 노는 작업이라고 생각합니다. 빛을 어떻게 읽고, 특히 반사되는 빛을 어떻게 살리느냐가 중요합니다.\n의도적으로 만들기보다는 찍다 보면 자연스럽게 만들어지는 빛의 결을 좋아합니다.",
} as const;
