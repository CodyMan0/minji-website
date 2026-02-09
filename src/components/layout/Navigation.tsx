"use client";

export default function Navigation() {
  return (
    <nav className="fixed top-0 left-0 right-0 z-50 h-20 bg-black flex items-center justify-between px-8">
      <div className="text-white text-2xl font-bold">The Art of Light</div>
      <div className="flex gap-8 items-center">
        <span className="text-xs uppercase tracking-wide text-zinc-500">
          Master Photographer JDZ CHUNG
        </span>
        <span className="text-xs uppercase tracking-wide text-zinc-500">
          Theme THE ART OF LIGHT
        </span>
        <span className="text-xs uppercase tracking-wide text-zinc-500">
          Keyword Light · Moment · Reality
        </span>
      </div>
    </nav>
  );
}
