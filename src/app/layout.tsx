import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

import { LandingNav } from "@/app/components/Landingnav";
import { auth } from "@/lib/auth";
import { Footer } from "@/app/components/Footer";

import { IOSInstallBanner } from "@/app/components/IOSInstallBanner";

import { PushSubscriber } from "@/app/components/PushSubscriber";
import { InitialLoaderRemover } from "./components/InitialLoaderRemover";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Mimamori",
  description: "ご家族をつなぐ見守りアプリ",
  manifest: "/manifest.json",
  icons: {
    icon: "/icon.svg",
    shortcut: "/icon.svg",
    apple: "/icon.svg",
  },
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "Mimamori",
  },
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const session = await auth();

  return (
    <html
      lang="ja"
      translate="no"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <head>
        <meta name="google" content="notranslate"></meta>
        <meta
          name="viewport"
          content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no, viewport-fit=cover"
        />
      </head>
      <body className="min-h-full flex flex-col">
        <div
          id="initial-loader"
          className="fixed inset-0 bg-white z-99999 flex flex-col items-center justify-center"
        >
          <div className="loader-logo">♡</div>
          <p className="loader-text">Mimamori</p>
          <div className="loader-dots">
            <span></span>
            <span></span>
            <span></span>
          </div>
        </div>
        <InitialLoaderRemover></InitialLoaderRemover>
        <PushSubscriber isLoggedIn={!!session?.user?.id} />
        <IOSInstallBanner />
        <LandingNav
          isLoggedIn={!!session?.user?.id}
          userName={session?.user?.name}
          userImage={session?.user?.image}
        />
        {children}
        <Footer />
      </body>
    </html>
  );
}
