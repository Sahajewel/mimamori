/* eslint-disable react-hooks/set-state-in-effect */
"use client";

import { useState, useEffect } from "react";

export function IOSInstallBanner() {
  const [show, setShow] = useState(false);

  useEffect(() => {
    const ua = window.navigator.userAgent;
    // iOS device কিনা
    const isIOS =
      /iphone|ipad|ipod/i.test(ua) &&
      !(window as unknown as { MSStream?: unknown }).MSStream;
    // Safari কিনা (iOS-এ Chrome=CriOS, Firefox=FxiOS, Edge=EdgiOS — এগুলো বাদ)
    const isSafari =
      /safari/i.test(ua) && !/crios|fxios|edgios|chrome/i.test(ua);
    // অলরেডি PWA (হোম স্ক্রিন) হিসেবে খোলা কিনা
    const isStandalone =
      window.matchMedia("(display-mode: standalone)").matches ||
      (window.navigator as unknown as { standalone?: boolean }).standalone ===
        true;

    // iOS + browser (PWA না) হলেই দেখাও
    if (isIOS && isSafari && !isStandalone) {
      setShow(true);
    }
  }, []);

  if (!show) return null;

  return (
    <div className="fixed bottom-4 left-1/2 -translate-x-1/2 z-50 w-[calc(100%-2rem)] max-w-md">
      <div className="bg-white border border-gray-200 rounded-2xl shadow-lg p-4">
        <div className="flex items-start gap-3">
          <span className="text-2xl shrink-0">📲</span>
          <div className="flex-1">
            <p className="text-sm font-semibold text-gray-900">
              iPhoneをお使いの方へ
            </p>
            <p className="text-xs text-gray-500 mt-1 leading-relaxed">
              緊急通知を受け取るには、ホーム画面に追加してください。
              <br />
              下の「共有」ボタン
              <span className="inline-block mx-0.5">⬆️</span>
              →「ホーム画面に追加」を選んでください。
            </p>
            <button
              onClick={() => setShow(false)}
              className="mt-2 text-xs text-indigo-600 font-medium hover:underline active:opacity-60"
            >
              閉じる
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
