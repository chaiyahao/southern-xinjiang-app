import type { Metadata } from "next";
import { Inter, Outfit, Noto_Sans_Thai } from "next/font/google";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const outfit = Outfit({
  subsets: ["latin"],
  variable: "--font-outfit",
  display: "swap",
});

const notoThai = Noto_Sans_Thai({
  subsets: ["thai"],
  variable: "--font-noto-thai",
  display: "swap",
});

export const metadata: Metadata = {
  title: "SOUTHERN XINJIANG (CHINA) — Luxury Travel Dashboard",
  description: "Legendary Route & Luxury Travel through Southern Xinjiang (China). Track active segments, luxury hotels, live telemetry, flights, and expenses from 29 Oct to 7 Nov 2026.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`h-full antialiased dark ${inter.variable} ${outfit.variable} ${notoThai.variable}`}
    >
      <body className="min-h-full flex flex-col bg-brand-bg-primary text-gray-100 font-sans">
        {children}
      </body>
    </html>
  );
}
