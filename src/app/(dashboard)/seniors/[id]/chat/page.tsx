/* eslint-disable react-hooks/set-state-in-effect */
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

function DateSeparator({ date }: { date: string }) {
  const d = new Date(date);
  const today = new Date();
  const yesterday = new Date();
  yesterday.setDate(yesterday.getDate() - 1);

  const japanDate = new Date(
    d.toLocaleString("en-US", { timeZone: "Asia/Tokyo" }),
  );
  const todayJapan = new Date(
    today.toLocaleString("en-US", { timeZone: "Asia/Tokyo" }),
  );
  const yesterdayJapan = new Date(
    yesterday.toLocaleString("en-US", { timeZone: "Asia/Tokyo" }),
  );

  japanDate.setHours(0, 0, 0, 0);
  todayJapan.setHours(0, 0, 0, 0);
  yesterdayJapan.setHours(0, 0, 0, 0);

  let label = d.toLocaleDateString("ja-JP", { timeZone: "Asia/Tokyo" });
  if (japanDate.getTime() === todayJapan.getTime()) label = "今日";
  if (japanDate.getTime() === yesterdayJapan.getTime()) label = "昨日";

  return (
    <div className="flex items-center gap-3 my-4">
      <div className="flex-1 h-px bg-gray-100" />
      <span className="text-xs text-gray-400 bg-gray-50 px-3 py-1 rounded-full">
        {label}
      </span>
      <div className="flex-1 h-px bg-gray-100" />
    </div>
  );
}

function isSameDay(a: string, b: string) {
  const da = new Date(
    new Date(a).toLocaleString("en-US", { timeZone: "Asia/Tokyo" }),
  );
  const db = new Date(
    new Date(b).toLocaleString("en-US", { timeZone: "Asia/Tokyo" }),
  );
  return (
    da.getFullYear() === db.getFullYear() &&
    da.getMonth() === db.getMonth() &&
    da.getDate() === db.getDate()
  );
}

export default function ChatPage() {
  const params = useParams();
  const router = useRouter();
  const id = params.id as string;

  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [myId, setMyId] = useState("");
  const [seniorName, setSeniorName] = useState("");
  const bottomRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  // iOS-এর কিবোর্ড হাইট ডাইনামিকালি হ্যান্ডেল করার স্টেট
  const [visualHeight, setVisualHeight] = useState("100dvh");

  // iPhone-এর ভিউপোর্ট এবং কিবোর্ড বাগ ফিক্স (অ্যাসিঙ্ক স্টেট আপডেট সহ)
  useEffect(() => {
    if (!window.visualViewport) return;

    const handleResize = () => {
      // requestAnimationFrame ব্যবহার করায় সিনক্রোনাস ক্যাসকেডিং রেন্ডার এররটি আর আসবে না
      requestAnimationFrame(() => {
        if (window.visualViewport) {
          setVisualHeight(`${window.visualViewport.height}px`);
        }
      });

      setTimeout(() => {
        bottomRef.current?.scrollIntoView({ behavior: "smooth" });
      }, 100);
    };

    window.visualViewport.addEventListener("resize", handleResize);
    window.visualViewport.addEventListener("scroll", handleResize);

    // প্রথম রেন্ডারেও সাইজ সেট করে নেওয়া
    handleResize();

    return () => {
      window.visualViewport?.removeEventListener("resize", handleResize);
      window.visualViewport?.removeEventListener("scroll", handleResize);
    };
  }, []);

  // মেসেজ ফেচ করার ফাংশন
  async function fetchMessages() {
    try {
      const res = await fetch(`/api/seniors/${id}/messages`);
      if (res.ok) {
        const data = await res.json();
        setMessages(data);
      }
    } catch (error) {
      console.error("Failed to fetch messages:", error);
    }
  }

  // ডেটা লোড এবং পোলিং
  useEffect(() => {
    if (!id) return;

    fetch("/api/auth/session")
      .then((r) => r.json())
      .then((d) => {
        if (d?.user?.id) setMyId(d.user.id);
      });

    fetch(`/api/seniors/${id}`)
      .then((r) => r.json())
      .then((d) => {
        if (d?.name) setSeniorName(d.name);
      });

    fetchMessages();

    const interval = setInterval(() => {
      fetchMessages();
    }, 15000);

    return () => clearInterval(interval);
  }, [id]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  async function handleSend() {
    if (!input.trim() || loading) return;
    setLoading(true);

    const res = await fetch(`/api/seniors/${id}/messages`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ content: input.trim() }),
    });

    if (res.ok) {
      setInput("");
      if (inputRef.current) inputRef.current.style.height = "38px";
      await fetchMessages();
      inputRef.current?.focus();
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
    <div
      className="absolute inset-0 bg-gray-50 flex flex-col overflow-hidden"
      style={{ height: visualHeight }}
    >
      {/* Navbar */}
      <nav className="bg-white border-b border-gray-100 px-4 py-3 flex items-center gap-3 shrink-0">
        <button
          onClick={() => router.back()}
          className="text-sm text-gray-400 hover:text-gray-600 transition-colors"
        >
          ←
        </button>
        <div className="flex items-center gap-2 flex-1">
          <div className="w-9 h-9 bg-indigo-100 rounded-full flex items-center justify-center text-indigo-600 font-medium text-sm">
            {seniorName.charAt(0) || "♡"}
          </div>
          <div>
            <p className="font-medium text-gray-900 text-sm">
              {seniorName ? `${seniorName}さんの家族チャット` : "家族チャット"}
            </p>
            <p className="text-xs text-gray-400">
              {messages.length}件のメッセージ
            </p>
          </div>
        </div>
      </nav>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-4 py-4 max-w-2xl mx-auto w-full">
        {messages.length === 0 ? (
          <div className="text-center py-16">
            <p className="text-4xl mb-3">💬</p>
            <p className="text-sm font-medium text-gray-600 mb-1">
              まだメッセージがありません
            </p>
            <p className="text-xs text-gray-400">
              家族みんなで{seniorName}さんについて話しましょう
            </p>
          </div>
        ) : (
          <div className="space-y-1">
            {messages.map((msg, index) => {
              const isMe = msg.user.id === myId;
              const prevMsg = messages[index - 1];
              const showDate =
                !prevMsg || !isSameDay(prevMsg.createdAt, msg.createdAt);
              const showName =
                !isMe &&
                (!prevMsg || prevMsg.user.id !== msg.user.id || showDate);

              return (
                <div key={msg.id}>
                  {showDate && <DateSeparator date={msg.createdAt} />}
                  <div
                    className={`flex ${isMe ? "justify-end" : "justify-start"} mb-1 w-full`}
                  >
                    <div
                      className={`flex flex-col ${isMe ? "items-end" : "items-start"} max-w-[75%]`}
                    >
                      {showName && (
                        <p className="text-xs text-gray-400 mb-1 ml-1">
                          {msg.user.name}
                        </p>
                      )}
                      <div className="flex items-end gap-1.5">
                        {isMe && (
                          <p className="text-xs text-gray-300 mb-0.5">
                            {new Date(msg.createdAt).toLocaleTimeString(
                              "ja-JP",
                              {
                                timeZone: "Asia/Tokyo",
                                hour: "2-digit",
                                minute: "2-digit",
                              },
                            )}
                          </p>
                        )}
                        <div
                          className={`px-4 py-2.5 rounded-2xl text-sm leading-relaxed ${
                            isMe
                              ? "bg-indigo-600 text-white rounded-tr-sm"
                              : "bg-white border border-gray-100 text-gray-800 rounded-tl-sm shadow-sm"
                          }`}
                        >
                          {msg.content}
                        </div>
                        {!isMe && (
                          <p className="text-xs text-gray-300 mb-0.5">
                            {new Date(msg.createdAt).toLocaleTimeString(
                              "ja-JP",
                              {
                                timeZone: "Asia/Tokyo",
                                hour: "2-digit",
                                minute: "2-digit",
                              },
                            )}
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
        <div ref={bottomRef} />
      </div>

      {/* Input */}
      <div
        className="bg-white border-t border-gray-100 px-3 py-2 shrink-0"
        style={{ paddingBottom: "max(8px, env(safe-area-inset-bottom))" }}
      >
        <div className="flex items-end gap-2">
          <textarea
            ref={inputRef}
            value={input}
            onChange={(e) => {
              setInput(e.target.value);
              e.target.style.height = "auto";
              e.target.style.height = `${Math.min(e.target.scrollHeight, 100)}px`;
            }}
            onKeyDown={handleKeyDown}
            placeholder="メッセージを入力..."
            rows={1}
            className="flex-1 min-w-0 border border-gray-200 rounded-2xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400 resize-none"
            style={{ height: "38px", maxHeight: "100px" }}
          />
          <button
            onClick={handleSend}
            disabled={loading || !input.trim()}
            className="w-9 h-9 shrink-0 bg-indigo-600 text-white rounded-full flex items-center justify-center hover:bg-indigo-700 disabled:opacity-50 transition-colors"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
              <path
                d="M22 2L11 13"
                stroke="white"
                strokeWidth="2"
                strokeLinecap="round"
              />
              <path
                d="M22 2L15 22L11 13L2 9L22 2Z"
                stroke="white"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
}
