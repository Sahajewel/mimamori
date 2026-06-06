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
        <div className="fixed inset-0 z-9999 flex flex-col items-center justify-center bg-white">
          {/* Mimamori logo */}
          <div className="w-16 h-16 rounded-2xl bg-indigo-600 flex items-center justify-center mb-5 shadow-lg">
            <span className="text-white text-3xl">♡</span>
          </div>
          <p className="text-lg font-semibold text-gray-900 mb-4">Mimamori</p>
          {/* spinner */}
          <div className="w-8 h-8 border-[3px] border-indigo-600 border-t-transparent rounded-full animate-spin" />
        </div>
      )}
      {children}
    </>
  );
}
