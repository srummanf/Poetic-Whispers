import type React from "react";
import type { Metadata } from "next";
import { Nunito, PT_Sans, Playfair_Display } from "next/font/google";
import "./globals.css";

const nunito = Nunito({
  subsets: ["latin"],
  variable: "--font-nunito",
});

const playFair = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-serif",
});

const ptSans = PT_Sans({
  weight: ["400", "700"],
  subsets: ["latin"],
  variable: "--font-pt-sans",
});

export const metadata: Metadata = {
  title: "Poetic Whispers - Studio Ghibli Poetry Collection",
  description:
    "",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${nunito.variable} ${ptSans.variable} ${playFair.variable} font-nunito relative`}>
        
          <div className="texture"  />
          {children}
        
      </body>
    </html>
  );
}

