"use client";

import Link from "next/link";
import { useState, useEffect } from "react";

function Spinner() {
  return (
    <svg
      className="animate-spin h-4 w-4"
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

export function ChatButton({ seniorId }: { seniorId: string }) {
  const [unreadCount, setUnreadCount] = useState(0);
  const [clicked, setClicked] = useState(false);

  useEffect(() => {
    async function fetchUnread() {
      const res = await fetch(`/api/seniors/${seniorId}/messages/unread`);
      if (res.ok) {
        const data = await res.json();
        setUnreadCount(data.count);
      }
    }

    fetchUnread();
    const interval = setInterval(fetchUnread, 10000);
    return () => clearInterval(interval);
  }, [seniorId]);

  return (
    <Link
      href={`/seniors/${seniorId}/chat`}
      onClick={() => setClicked(true)}
      className="bg-white border border-gray-100 rounded-xl p-4 text-center hover:border-indigo-200 transition-colors relative"
    >
      <p className="text-lg mb-1 flex items-center justify-center">
        {clicked ? <Spinner /> : "💬"}
      </p>
      <p className="text-sm font-medium text-gray-700">チャット</p>
      {unreadCount > 0 && !clicked && (
        <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center font-medium">
          {unreadCount > 9 ? "9+" : unreadCount}
        </span>
      )}
    </Link>
  );
}
