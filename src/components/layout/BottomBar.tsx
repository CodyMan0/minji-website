"use client";

export default function BottomBar() {
  return (
    <footer className="fixed bottom-0 left-0 right-0 z-50 px-4 py-3 pb-[max(0.75rem,env(safe-area-inset-bottom))]">
      <div className="flex items-center justify-between text-xs uppercase tracking-widest text-white">
        <div className="hidden md:block">&copy; 2026 Xiaomi Korea. All rights reserved.</div>
        <div className="text-center flex-1 md:flex-none">XIAOMI KOREA X JDZ CHUNG</div>
        <div className="hidden md:block">ONLINE EXHIBITION</div>
      </div>
    </footer>
  );
}
