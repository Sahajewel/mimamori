"use client";

import Link from "next/link";
import { useState } from "react";

export function SeniorBackLink({ seniorId }: { seniorId: string }) {
  const [clicked, setClicked] = useState(false);

  return (
    <Link
      href={`/seniors/${seniorId}`}
      onClick={() => setClicked(true)}
      className={`flex items-center gap-1.5 text-sm font-medium transition-colors ${
        clicked ? "text-indigo-300" : "text-indigo-600 hover:underline"
      }`}
    >
      <span className="text-lg">←</span>
      <span>戻る</span>
    </Link>
  );
}
