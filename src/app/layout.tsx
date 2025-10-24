import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/toaster";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "VidCrafter - AI-Powered Video Creation Platform",
  description: "Transform your ideas into stunning videos with cutting-edge AI technology. Create professional videos and cartoons in seconds.",
  keywords: ["VidCrafter", "AI video", "video generation", "cartoon maker", "AI animation", "video creation"],
  authors: [{ name: "VidCrafter Team" }],
  icons: {
    icon: "/favicon.ico",
  },
  openGraph: {
    title: "VidCrafter - AI-Powered Video Creation",
    description: "Transform your ideas into stunning videos with cutting-edge AI technology",
    url: "https://vidcrafter.ai",
    siteName: "VidCrafter",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "VidCrafter - AI-Powered Video Creation",
    description: "Transform your ideas into stunning videos with cutting-edge AI technology",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-background text-foreground`}
      >
        {children}
        <Toaster />
      </body>
    </html>
  );
}
