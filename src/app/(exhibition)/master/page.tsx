"use client";

import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import Link from "next/link";
import { ARTIST } from "@/lib/constants";

function Section({
  number,
  label,
  content,
}: {
  number: string;
  label: string;
  content: string;
}) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section ref={ref} className="min-h-screen flex items-center px-6 md:px-12">
      <div className="max-w-7xl mx-auto w-full grid grid-cols-1 md:grid-cols-12 gap-8">
        <div className="md:col-span-3">
          <div className="text-8xl font-light text-zinc-800">{number}</div>
        </div>
        <motion.div
          className="md:col-span-9"
          initial={{ opacity: 0, y: 40 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 40 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
        >
          <div className="text-sm uppercase tracking-[0.3em] text-zinc-500 mb-6">
            {label}
          </div>
          <p className="text-lg md:text-xl text-zinc-300 leading-relaxed">
            {content}
          </p>
        </motion.div>
      </div>
    </section>
  );
}

export default function MasterPage() {
  return (
    <div className="bg-black text-white">
      {/* Hero Section */}
      <section
        className="relative flex items-center justify-center px-6 md:px-12"
        style={{ height: "calc(100vh - 5rem)" }}
      >
        {/* Background Image with Low Opacity */}
        <div
          className="absolute inset-0 bg-cover bg-center opacity-5"
          style={{ backgroundImage: "url(/images/photo1.jpg)" }}
        />

        {/* Hero Text */}
        <div className="relative z-10">
          <h1 className="text-6xl md:text-8xl lg:text-9xl font-light text-center">
            Master JDZ
          </h1>
        </div>
      </section>

      {/* About Section */}
      <Section number="01" label="ABOUT" content={ARTIST.about} />

      {/* Philosophy Section */}
      <Section number="02" label="PHILOSOPHY" content={ARTIST.philosophy} />

      {/* Footer Section */}
      <section className="min-h-[50vh] flex flex-col items-center justify-center px-6 md:px-12 gap-8">
        <p className="text-xl italic text-zinc-500 text-center">
          The story continues.
        </p>
        <Link
          href="/exhibition"
          className="text-zinc-400 hover:text-white transition-colors duration-300"
        >
          ← Back to Exhibition
        </Link>
      </section>
    </div>
  );
}
