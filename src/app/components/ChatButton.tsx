"use client";

import Link from "next/link";
import { useState, useEffect } from "react";

export function ChatButton({ seniorId }: { seniorId: string }) {
  const [unreadCount, setUnreadCount] = useState(0);

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
      className="bg-white border border-gray-100 rounded-xl p-4 text-center hover:border-indigo-200 transition-colors relative"
    >
      <p className="text-lg mb-1">💬</p>
      <p className="text-sm font-medium text-gray-700">チャット</p>
      {unreadCount > 0 && (
        <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center font-medium">
          {unreadCount > 9 ? "9+" : unreadCount}
        </span>
      )}
    </Link>
  );
}
