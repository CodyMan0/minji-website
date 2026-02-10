import Link from "next/link";

export default function SubNavigation() {
  return (
    <div
      className="fixed bottom-4 left-8 flex items-center gap-3 z-50"
      style={{ marginLeft: "60px" }}
    >
      <div className="flex bg-zinc-900/80 backdrop-blur-sm rounded-md px-0.5 py-0.5 gap-0.5 text-[10px] uppercase tracking-widest font-light">
        <Link
          href="/exhibition"
          className="px-3 py-1.5 bg-white/10 text-white rounded-sm transition-colors"
        >
          Overview
        </Link>
        <Link
          href="/gallery"
          className="px-3 py-1.5 text-zinc-500 hover:text-zinc-300 rounded-sm transition-colors"
        >
          Index
        </Link>
      </div>
    </div>
  );
}
