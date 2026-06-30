import type { Metadata } from "next";
import "./globals.css";

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
      className="h-full antialiased dark"
    >
      <body className="min-h-full flex flex-col bg-brand-bg-primary text-gray-100 font-sans">
        {children}
      </body>
    </html>
  );
}
