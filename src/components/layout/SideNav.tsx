"use client";

import Link from "next/link";

export default function SideNav() {
  return (
    <nav className="fixed left-8 top-1/2 -translate-y-1/2 z-40 flex flex-col gap-8">
      <Link
        href="/gallery"
        className="text-xs uppercase tracking-wide text-zinc-500 hover:text-white transition-colors"
        style={{ writingMode: "vertical-rl", transform: "rotate(180deg)" }}
      >
        INDEX
      </Link>
      <Link
        href="/master"
        className="text-xs uppercase tracking-wide text-zinc-500 hover:text-white transition-colors"
        style={{ writingMode: "vertical-rl", transform: "rotate(180deg)" }}
      >
        Master JDZ
      </Link>
    </nav>
  );
}
