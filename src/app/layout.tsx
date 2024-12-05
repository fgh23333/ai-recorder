import type { Metadata } from "next";
import "./globals.css";
import { ReactNode } from "react";
import { Inter as FontSans } from "next/font/google";
const fontSans = FontSans({
  subsets: ["latin"],
  variable: "--font-sans",
});
export const metadata: Metadata = {
  title: "Recorder / Whisper + Voice Activity Detector",
  description: "Recorder / Whisper + Voice Activity Detector",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`antialiased ${fontSans.className}`}>{children}</body>
    </html>
  );
}
