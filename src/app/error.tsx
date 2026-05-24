"use client";

import Link from "next/link";
import { useEffect } from "react";
import { BackButton } from "./components/BackButton";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center px-4">
      <div className="text-center max-w-md">
        <div className="w-24 h-24 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-6">
          <span className="text-5xl">⚠️</span>
        </div>
        <h1 className="text-2xl font-semibold text-gray-900 mb-3">
          エラーが発生しました
        </h1>
        <p className="text-base text-gray-400 mb-8 leading-relaxed">
          申し訳ありません。予期しないエラーが発生しました。もう一度お試しください。
        </p>
        <div className="flex gap-3 justify-center">
          <button
            onClick={reset}
            className="px-6 py-3 bg-indigo-600 text-white text-base font-semibold rounded-xl hover:bg-indigo-700 transition-colors shadow-sm"
          >
            もう一度試す
          </button>
          <BackButton></BackButton>
        </div>
      </div>
    </div>
  );
}
