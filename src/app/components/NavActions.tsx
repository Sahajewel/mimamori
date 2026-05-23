"use client";

import { useTransition, useState } from "react";
import { useRouter } from "next/navigation";

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
  const [pendingHref, setPendingHref] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  const navigate = (href: string) => {
    setPendingHref(href);
    startTransition(() => {
      router.push(href);
    });
  };

  const chatHref = `/seniors/${seniorId}/chat`;
  const inviteHref = `/seniors/${seniorId}/invite`;
  const editHref = `/seniors/${seniorId}/edit`;

  return (
    <div className="flex items-center gap-2">
      {/* 💬 Chat button — সবসময় দেখাবে */}
      <button
        onClick={() => navigate(chatHref)}
        disabled={isPending}
        className="flex items-center justify-center w-9 h-9 rounded-xl border border-gray-200 hover:bg-gray-50 disabled:opacity-60 transition-colors text-gray-500"
      >
        {pendingHref === chatHref && isPending ? <Spinner /> : "💬"}
      </button>

      {/* OWNER only */}
      {role === "OWNER" && (
        <>
          <button
            onClick={() => navigate(inviteHref)}
            disabled={isPending}
            className="flex items-center gap-1.5 text-sm text-indigo-600 border border-indigo-200 px-3 py-1.5 rounded-lg hover:bg-indigo-50 disabled:opacity-60 transition-colors"
          >
            {pendingHref === inviteHref && isPending ? <Spinner /> : null}
            招待する
          </button>
          <button
            onClick={() => navigate(editHref)}
            disabled={isPending}
            className="flex items-center gap-1.5 text-sm text-gray-500 border border-gray-200 px-3 py-1.5 rounded-lg hover:bg-gray-50 disabled:opacity-60 transition-colors"
          >
            {pendingHref === editHref && isPending ? <Spinner /> : null}
            編集
          </button>
        </>
      )}
    </div>
  );
}
