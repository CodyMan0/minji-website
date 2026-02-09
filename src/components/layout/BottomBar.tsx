"use client";

import { useKoreanTime } from "@/hooks/useKoreanTime";

export default function BottomBar() {
  const time = useKoreanTime();

  return (
    <footer className="fixed bottom-0 left-0 right-0 z-50 px-8 py-4 bg-black/80 backdrop-blur-sm">
      <div className="flex items-center justify-between text-xs text-zinc-500">
        <div>{time}</div>
        <div className="flex gap-6 items-center text-zinc-600">
          <span>xiaomi Korea x Jdz chung</span>
          <span>online exhibition</span>
        </div>
        <div>© 2026</div>
      </div>
    </footer>
  );
}
