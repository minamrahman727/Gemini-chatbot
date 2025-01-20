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
  title: "Gemini powered chat-bot by SMRehman",
  description: "Experience the future of conversational AI with our chatbot powered by Gemini Pro, developed by Syed Minam Ur Rehman. Engage in seamless and intelligent conversations. Development is still in progress.",
  keywords: [
    "chat",
    "ai",
    "gemini",
    "pro",
    "syed",
    "minam",
    "ur",
    "rehman",
    "google",
    "generative",
    "assistant",
    "chatbot",
  ],
  referrer: "no-referrer",
  viewport: "width=device-width, initial-scale=1",
  robots: "noindex, nofollow",
  authors: [{ name: "Syed Minam Ur Rehman" }],
  publisher: "ZEX software solutions",
  icons: {
    icon: "/next.svg",
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
