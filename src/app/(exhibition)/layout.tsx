"use client";

import Navigation from "@/components/layout/Navigation";
import BottomBar from "@/components/layout/BottomBar";

export default function ExhibitionLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <Navigation />
      <main className="pt-20">{children}</main>
      <BottomBar />
    </>
  );
}
