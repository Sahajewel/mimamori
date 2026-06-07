import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { PushSubscriber } from "./components/PushSubscriber";
import { LandingNav } from "./components/Landingnav";
import { auth } from "@/lib/auth";
import { Footer } from "./components/Footer";
import { AppLoader } from "./components/Apploader";
import { IOSInstallBanner } from "./components/IOSInstallBanner";

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
        <meta name="google" content="notranslate" />
        <meta
          name="viewport"
          content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no, viewport-fit=cover"
        />
        {/* একদম শুরুতে (JS load হওয়ার আগেই) loader দেখানোর জন্য — inline CSS */}
        <style
          dangerouslySetInnerHTML={{
            __html: `
              #initial-loader {
                position: fixed;
                inset: 0;
                z-index: 99999;
                display: flex;
                flex-direction: column;
                align-items: center;
                justify-content: center;
                background: #ffffff;
                transition: opacity 0.3s ease;
              }
              #initial-loader .il-box {
                width: 64px;
                height: 64px;
                border-radius: 16px;
                background: #4F46E5;
                display: flex;
                align-items: center;
                justify-content: center;
                margin-bottom: 20px;
                box-shadow: 0 10px 25px rgba(79,70,229,0.3);
                animation: il-beat 1.4s ease-in-out infinite;
              }
              #initial-loader .il-heart {
                color: #ffffff;
                font-size: 30px;
                line-height: 1;
              }
              #initial-loader .il-name {
                font-size: 18px;
                font-weight: 600;
                color: #111827;
                margin-bottom: 16px;
                font-family: sans-serif;
              }
              #initial-loader .il-dots {
                display: flex;
                gap: 6px;
              }
              #initial-loader .il-dot {
                width: 8px;
                height: 8px;
                border-radius: 9999px;
                background: #4F46E5;
                animation: il-bounce 1.2s ease-in-out infinite;
              }
              #initial-loader .il-dot:nth-child(2) { animation-delay: 0.2s; }
              #initial-loader .il-dot:nth-child(3) { animation-delay: 0.4s; }
              @keyframes il-beat {
                0% { transform: scale(1); }
                15% { transform: scale(1.15); }
                30% { transform: scale(1); }
                45% { transform: scale(1.1); }
                60% { transform: scale(1); }
                100% { transform: scale(1); }
              }
              @keyframes il-bounce {
                0%, 100% { transform: translateY(0); opacity: 0.4; }
                50% { transform: translateY(-6px); opacity: 1; }
              }
            `,
          }}
        />
      </head>
      <body className="min-h-full flex flex-col">
        {/* JS load হওয়ার আগেই ব্রাউজার এটা দেখায় (HTML-এর অংশ) */}
        <div id="initial-loader">
          <div className="il-box">
            <span className="il-heart">&#9825;</span>
          </div>
          <p className="il-name">Mimamori</p>
          <div className="il-dots">
            <span className="il-dot"></span>
            <span className="il-dot"></span>
            <span className="il-dot"></span>
          </div>
        </div>
        {/* app ready হলে initial-loader সরাও */}
        <script
          dangerouslySetInnerHTML={{
            __html: `
              window.addEventListener('load', function () {
                var el = document.getElementById('initial-loader');
                if (el) {
                  el.style.opacity = '0';
                  setTimeout(function () { el.remove(); }, 350);
                }
              });
            `,
          }}
        />

        <AppLoader>
          <PushSubscriber isLoggedIn={!!session?.user?.id} />
          <IOSInstallBanner />
          <LandingNav
            isLoggedIn={!!session?.user?.id}
            userName={session?.user?.name}
            userImage={session?.user?.image}
          />
          {children}
          <Footer />
        </AppLoader>
      </body>
    </html>
  );
}
