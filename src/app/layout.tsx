import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/toaster";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Aura Audio — Silence the World. Awaken the Sound.",
  description: "Experience luxury smart headphones with Adaptive ANC, 40-hour battery, and immersive Spatial Audio. Crafted for those who demand perfection.",
  keywords: ["Aura Audio", "smart headphones", "ANC", "noise cancelling", "spatial audio", "luxury headphones"],
  authors: [{ name: "Aura Audio" }],
  icons: {
    icon: "/logo.svg",
  },
  openGraph: {
    title: "Aura Audio — Silence the World. Awaken the Sound.",
    description: "Luxury smart headphones with Adaptive ANC, 40-hour battery, and Spatial Audio.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark" suppressHydrationWarning>
      <body
        className={`${inter.variable} antialiased`}
      >
        {children}
        <Toaster />
      </body>
    </html>
  );
}
