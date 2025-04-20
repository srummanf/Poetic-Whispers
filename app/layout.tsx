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
  title: "Poetic Whispers - Poetry Collection with Ghibli Theme",
  description:
    "Celebrate the enduring magic of history's greatest poets with our Ghibli-inspired poetry sanctuary. Timeless verses from Shakespeare, Edward Thomas, and more in an enchanting matsu-themed collection.",
  metadataBase: new URL("https://poetic-whispers.vercel.app/"),
  keywords: [
    "poetry collection",
    "ghibli theme",
    "matsu design",
    "classic poetry",
    "shakespeare",
    "edward thomas",
    "timeless verses",
    "literary sanctuary",
    "poetic brilliance",
    "classic literature"
  ],
  authors: [{ name: "Shaikh Rumman Fardeen" }],
  creator: "srummanf",
  publisher: "Poetic Whispers",
  icons: {
    icon: "/favicon.ico",
    shortcut: "/favicon.ico",
  },
  manifest: "/site.webmanifest",
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://poetic-whispers.vercel.app/",
    siteName: "Poetic Whispers",
    title: "Poetic Whispers - Where Classics Come to Life",
    description:
      "A Ghibli-inspired sanctuary of timeless poetry from literary masters like Shakespeare and Edward Thomas. Immerse yourself in elegantly preserved verses.",
    images: [
      {
        url: "/images/bg-1.jpg",
        width: 1200,
        height: 630,
        alt: "Poetic Whispers - Ghibli-Inspired Poetry Collection",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Poetic Whispers - Timeless Poetry in Ghibli Style",
    description:
      "Experience the magic of classic poetry through our enchanting Ghibli and matsu-themed literary sanctuary",
    images: ["/images/bg-2.jpg"],
    creator: "@poeticwhispers",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  viewport: {
    width: "device-width",
    initialScale: 1,
    maximumScale: 1,
  },
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

