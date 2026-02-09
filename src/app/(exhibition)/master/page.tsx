"use client";

import { ARTIST } from "@/lib/constants";

export default function MasterPage() {
  return (
    <div className="min-h-[calc(100vh-5rem)] bg-black text-white flex items-center">
      {/* Content area */}
      <div className="w-full px-8 md:px-12 lg:px-24">
        {/* 01 ABOUT */}
        <div className="mb-24">
          <div className="flex items-end gap-40 mb-10">
            <div>
              <span className="inline-block w-2.5 h-2.5 bg-white mb-3" />
              <p className="text-3xl md:text-4xl font-light">01</p>
            </div>
            <div>
              <span className="inline-block w-2.5 h-2.5 bg-white mb-3" />
              <p className="text-3xl md:text-4xl font-light uppercase tracking-wider">
                ABOUT
              </p>
            </div>
            <span className="inline-block w-2.5 h-2.5 bg-white ml-auto mb-3" />
          </div>
          <p className="text-base md:text-lg text-white leading-relaxed max-w-5xl">
            {ARTIST.about}
          </p>
        </div>

        {/* 02 PHILOSOPHY */}
        <div>
          <div className="flex items-end gap-40 mb-10">
            <div>
              <p className="text-3xl md:text-4xl font-light">02</p>
            </div>
            <div>
              <p className="text-3xl md:text-4xl font-light uppercase tracking-wider">
                PHILOSOPHY
              </p>
            </div>
          </div>
          <p className="text-base md:text-lg text-white leading-relaxed max-w-5xl">
            {ARTIST.philosophy}
          </p>
        </div>
      </div>
    </div>
  );
}
