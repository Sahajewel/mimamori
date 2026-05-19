/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable react-hooks/exhaustive-deps */
"use client";

import { useParams, useRouter } from "next/navigation";
import { useState, useEffect, useRef } from "react";

type Message = {
  id: string;
  content: string;
  createdAt: string;
  user: { name: string; id: string };
};

export default function ChatPage() {
  const params = useParams();
  const router = useRouter();
  const id = params.id as string;

  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [myId, setMyId] = useState("");
  const bottomRef = useRef<HTMLDivElement>(null);

  async function fetchMessages() {
    const res = await fetch(`/api/seniors/${id}/messages`);
    const data = await res.json();
    setMessages(data);
  }

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    fetchMessages();
    const interval = setInterval(fetchMessages, 30000);
    return () => clearInterval(interval);
  }, [id]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  async function handleSend() {
    if (!input.trim()) return;
    setLoading(true);

    const res = await fetch(`/api/seniors/${id}/messages`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ content: input }),
    });

    if (res.ok) {
      setInput("");
      await fetchMessages();
    }
    setLoading(false);
  }

  async function handleKeyDown(e: React.KeyboardEvent) {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      await handleSend();
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Navbar */}
      <nav className="bg-white border-b border-gray-100 px-4 py-4 flex items-center gap-3">
        <button
          onClick={() => router.back()}
          className="text-sm text-gray-400 hover:text-gray-600 transition-colors"
        >
          ← 戻る
        </button>
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg bg-indigo-100 flex items-center justify-center">
            <span className="text-indigo-600 text-xs">♡</span>
          </div>
          <p className="font-medium text-gray-900">家族チャット</p>
        </div>
      </nav>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-4 py-4 space-y-3 max-w-2xl mx-auto w-full">
        {messages.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-3xl mb-3">💬</p>
            <p className="text-sm text-gray-400">まだメッセージがありません</p>
            <p className="text-xs text-gray-300 mt-1">
              家族みんなで話しましょう
            </p>
          </div>
        ) : (
          messages.map((msg) => {
            const isMe = msg.user.id === myId;
            return (
              <div
                key={msg.id}
                className={`flex ${isMe ? "justify-end" : "justify-start"}`}
              >
                <div
                  className={`max-w-xs md:max-w-md ${isMe ? "items-end" : "items-start"} flex flex-col gap-1`}
                >
                  {!isMe && (
                    <p className="text-xs text-gray-400 ml-1">
                      {msg.user.name}
                    </p>
                  )}
                  <div
                    className={`px-4 py-2.5 rounded-2xl text-sm ${
                      isMe
                        ? "bg-indigo-600 text-white rounded-tr-sm"
                        : "bg-white border border-gray-100 text-gray-800 rounded-tl-sm"
                    }`}
                  >
                    {msg.content}
                  </div>
                  <p className="text-xs text-gray-300 mx-1">
                    {new Date(msg.createdAt).toLocaleTimeString("ja-JP", {
                      timeZone: "Asia/Tokyo",
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </p>
                </div>
              </div>
            );
          })
        )}
        <div ref={bottomRef} />
      </div>

      {/* Input */}
      <div className="bg-white border-t border-gray-100 px-4 py-3">
        <div className="max-w-2xl mx-auto flex gap-2">
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="メッセージを入力..."
            rows={1}
            className="flex-1 border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400 resize-none"
          />
          <button
            onClick={handleSend}
            disabled={loading || !input.trim()}
            className="px-4 py-2.5 bg-indigo-600 text-white text-sm font-medium rounded-xl hover:bg-indigo-700 disabled:opacity-50 transition-colors"
          >
            送信
          </button>
        </div>
        <p className="text-xs text-gray-300 text-center mt-1">Enterで送信</p>
      </div>
    </div>
  );
}
