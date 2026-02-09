"use client";

import Navigation from "@/components/layout/Navigation";
import SideNav from "@/components/layout/SideNav";
import BottomBar from "@/components/layout/BottomBar";

export default function ExhibitionLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <Navigation />
      <SideNav />
      <main className="pt-20">{children}</main>
      <BottomBar />
    </>
  );
}
