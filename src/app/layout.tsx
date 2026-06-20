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
        {/* loader CSS — inline, যাতে globals.css-এর অপেক্ষা ছাড়াই সাথে সাথে দেখায় */}
        <style
          dangerouslySetInnerHTML={{
            __html: `
        #initial-loader {
          position: fixed;
          inset: 0;
          background: ##4F46E5;
          display: flex;
          flex-direction: column;
          justify-content: center;
          align-items: center;
          z-index: 99999;
        }
        #initial-loader .loader-logo {
          width: 64px;
          height: 64px;
          background: #4f46e5;
          color: white;
          font-size: 32px;
          border-radius: 16px;
          display: flex;
          justify-content: center;
          align-items: center;
        }
        #initial-loader .loader-text {
          margin-top: 16px;
          font-size: 18px;
          font-weight: 600;
          color: #111827;
        }
        #initial-loader .loader-dots {
          margin-top: 12px;
        }
        #initial-loader .loader-dots span {
          width: 6px;
          height: 6px;
          background: #4f46e5;
          border-radius: 50%;
          display: inline-block;
          margin: 0 3px;
        }
      `,
          }}
        />
      </head>
      <body className="min-h-full flex flex-col">
        <div id="initial-loader">
          {" "}
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
