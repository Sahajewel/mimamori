/* eslint-disable react-hooks/set-state-in-effect */
"use client";

import { useState, useEffect } from "react";

export function AppLoader({ children }: { children: React.ReactNode }) {
  const [ready, setReady] = useState(false);

  useEffect(() => {
    // অ্যাপ mount হলো — loader সরাও
    setReady(true);
  }, []);

  return (
    <>
      {!ready && (
        <div className="fixed inset-0 z-9999 flex flex-col items-center justify-center bg-white mimamori-loader">
          {/* Mimamori logo — heartbeat animation */}
          <div className="mimamori-logo-box w-16 h-16 rounded-2xl bg-indigo-600 flex items-center justify-center mb-5 shadow-lg">
            <span className="text-white text-3xl">♡</span>
          </div>
          <p className="mimamori-logo-text text-lg font-semibold text-gray-900 mb-4">
            Mimamori
          </p>
          {/* soft loading dots */}
          <div className="flex gap-1.5">
            <span className="mimamori-dot w-2 h-2 rounded-full bg-indigo-600" />
            <span className="mimamori-dot mimamori-dot-2 w-2 h-2 rounded-full bg-indigo-600" />
            <span className="mimamori-dot mimamori-dot-3 w-2 h-2 rounded-full bg-indigo-600" />
          </div>

          <style jsx>{`
            .mimamori-logo-box {
              animation: heartbeat 1.4s ease-in-out infinite;
            }
            @keyframes heartbeat {
              0% {
                transform: scale(1);
              }
              15% {
                transform: scale(1.15);
              }
              30% {
                transform: scale(1);
              }
              45% {
                transform: scale(1.1);
              }
              60% {
                transform: scale(1);
              }
              100% {
                transform: scale(1);
              }
            }
            .mimamori-loader {
              animation: fadeIn 0.4s ease-out;
            }
            @keyframes fadeIn {
              from {
                opacity: 0;
              }
              to {
                opacity: 1;
              }
            }
            .mimamori-logo-text {
              animation: rise 0.6s ease-out;
            }
            @keyframes rise {
              from {
                opacity: 0;
                transform: translateY(6px);
              }
              to {
                opacity: 1;
                transform: translateY(0);
              }
            }
            .mimamori-dot {
              animation: bounce 1.2s ease-in-out infinite;
            }
            .mimamori-dot-2 {
              animation-delay: 0.2s;
            }
            .mimamori-dot-3 {
              animation-delay: 0.4s;
            }
            @keyframes bounce {
              0%,
              100% {
                transform: translateY(0);
                opacity: 0.4;
              }
              50% {
                transform: translateY(-6px);
                opacity: 1;
              }
            }
          `}</style>
        </div>
      )}
      {children}
    </>
  );
}
