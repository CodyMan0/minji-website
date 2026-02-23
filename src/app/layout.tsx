import type { Metadata } from "next";
import { IBM_Plex_Sans_Condensed, IBM_Plex_Mono } from "next/font/google";
import "./globals.css";

const ibmPlex = IBM_Plex_Sans_Condensed({
  subsets: ["latin"],
  weight: ["300", "400", "500", "700"],
  variable: "--font-ibm-plex",
});

const ibmPlexMono = IBM_Plex_Mono({
  subsets: ["latin"],
  weight: ["400"],
  variable: "--font-ibm-plex-mono",
});

export const viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover" as const,
};

export const metadata: Metadata = {
  title: "The Art of Light | XIAOMI KOREA x JDZ CHUNG",
  description: "빛이 머문 순간, JDZ의 방식으로. An online photography exhibition by JDZ CHUNG.",
  icons: {
    icon: "/icon.svg",
  },
  openGraph: {
    title: "The Art of Light | XIAOMI KOREA x JDZ CHUNG",
    description: "빛이 머문 순간, JDZ의 방식으로. An online photography exhibition by JDZ CHUNG.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko">
      <body
        className={`${ibmPlex.variable} ${ibmPlexMono.variable} ${ibmPlex.className} antialiased bg-black`}
      >
        {children}
      </body>
    </html>
  );
}
