"use client";

import Link from "next/link";
import { useState } from "react";

function Spinner() {
  return (
    <svg
      className="animate-spin h-3.5 w-3.5"
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
    >
      <circle
        className="opacity-25"
        cx="12"
        cy="12"
        r="10"
        stroke="currentColor"
        strokeWidth="4"
      />
      <path
        className="opacity-75"
        fill="currentColor"
        d="M4 12a8 8 0 018-8v8H4z"
      />
    </svg>
  );
}

type Props = {
  seniorId: string;
  role: string;
};

export function NavActions({ seniorId, role }: Props) {
  const [clickedHref, setClickedHref] = useState<string | null>(null);

  const inviteHref = `/seniors/${seniorId}/invite`;
  const editHref = `/seniors/${seniorId}/edit`;

  if (role !== "OWNER") return null;

  return (
    <div className="flex items-center gap-2">
      <Link
        href={inviteHref}
        onClick={() => setClickedHref(inviteHref)}
        className="flex items-center gap-1.5 text-sm text-indigo-600 border border-indigo-200 px-3 py-1.5 rounded-lg hover:bg-indigo-50 transition-colors"
      >
        {clickedHref === inviteHref ? <Spinner /> : null}
        招待する
      </Link>
      <Link
        href={editHref}
        onClick={() => setClickedHref(editHref)}
        className="flex items-center gap-1.5 text-sm text-gray-500 border border-gray-200 px-3 py-1.5 rounded-lg hover:bg-gray-50 transition-colors"
      >
        {clickedHref === editHref ? <Spinner /> : null}
        編集
      </Link>
    </div>
  );
}
