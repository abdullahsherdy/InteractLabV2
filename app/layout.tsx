import type { Metadata } from "next";
import { DM_Sans, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";

const dmSans = DM_Sans({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-sans",
});

const jetBrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  weight: ["400", "500"],
  variable: "--font-mono",
});

export const metadata: Metadata = {
  title: "InteractLab — Interactive Programming Tutorials",
  description:
    "InteractLab — free interactive programming tutorials. Learn linked lists, bitwise ops, recursion, Big-O, and sorting algorithms with step-by-step visualizers.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className={`${dmSans.variable} ${jetBrainsMono.variable}`}>
        <div className="home-wrap">
          <Header />
          {children}
          <Footer />
        </div>
      </body>
    </html>
  );
}
