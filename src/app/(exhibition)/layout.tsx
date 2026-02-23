"use client";

import Navigation from "@/components/layout/Navigation";
import BottomBar from "@/components/layout/BottomBar";
import { DebugDateProvider } from "@/contexts/DebugDateContext";

export default function ExhibitionLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <DebugDateProvider>
      <Navigation />
      <main className="pt-14 md:pt-20">{children}</main>
      <BottomBar />
    </DebugDateProvider>
  );
}
