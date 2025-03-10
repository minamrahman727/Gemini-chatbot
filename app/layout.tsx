import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Analytics } from "@vercel/analytics/react"

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Gemini 2.0 Chatbot",
  description: "Gemini 2.0 is a generative AI model that can assist you in your daily tasks. It is a chatbot that can help you with your queries. It is a next.js application built with React, TypeScript, Tailwind CSS, and Framer Motion. It uses Google's Generative AI model to generate responses. It is a project by Syed Minam Ur Rehman.",
  keywords: [
    "chat",
    "ai",
    "gemini",
    "gemin 2.0",
    "syed minam ur rehman",
    "next.js",
    "react",
    "typescript",
    "tailwindcss",
    "framer-motion",
    "google",
    "generative",
    "assistant",
    "chatbot",
  ],
  referrer: "no-referrer",
  viewport: "width=device-width, initial-scale=1",
  robots: "noindex, nofollow",
  authors: [{ name: "Syed Minam Ur Rehman" }
           ,{name: "M Ayan Israr}],
  publisher: "ZEX software solutions",
  icons: {
    icon: "/m.png",
    apple: "/m.png",
  }
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
    <Analytics/>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
