import type { Metadata } from "next";
import { IBM_Plex_Sans_Condensed } from "next/font/google";
import "./globals.css";

const ibmPlex = IBM_Plex_Sans_Condensed({
  subsets: ["latin"],
  weight: ["300", "400", "500", "700"],
  variable: "--font-ibm-plex",
});

export const metadata: Metadata = {
  title: "The Art of Light | XIAOMI KOREA x JDZ CHUNG",
  description: "빛이 머문 순간, JDZ의 방식으로. An online photography exhibition by JDZ CHUNG.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko">
      <body
        className={`${ibmPlex.variable} ${ibmPlex.className} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
