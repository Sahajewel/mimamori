"use client";

import Link from "next/link";
import { useState } from "react";

export function DashboardLogo() {
  const [clicked, setClicked] = useState(false);

  return (
    <Link
      href="/"
      onClick={() => setClicked(true)}
      className="flex items-center gap-2.5"
    >
      <div className="w-9 h-9 rounded-xl bg-indigo-600 flex items-center justify-center shadow-sm">
        <span className="text-white text-base">♡</span>
      </div>
      <p
        className={`font-semibold text-base transition-colors ${clicked ? "text-gray-300" : "text-gray-900"}`}
      >
        Mimamori
      </p>
    </Link>
  );
}
