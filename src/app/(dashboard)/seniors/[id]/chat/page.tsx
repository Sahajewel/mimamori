/* eslint-disable react-hooks/immutability */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable react-hooks/set-state-in-effect */
/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @next/next/no-img-element */
"use client";

import { useParams, useRouter } from "next/navigation";
import { useState, useEffect, useRef, useCallback } from "react";
import EmojiPicker, { EmojiClickData } from "emoji-picker-react";
import Pusher from "pusher-js";

type Message = {
  id: string;
  content: string;
  imageUrl: string | null;
  createdAt: string;
  seen: boolean;
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
  const [myName, setMyName] = useState("");
  const [seniorName, setSeniorName] = useState("");
  const [showEmoji, setShowEmoji] = useState(false);
  const [imageUploading, setImageUploading] = useState(false);
  const [zoomImage, setZoomImage] = useState<string | null>(null);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [isTyping, setIsTyping] = useState(false);
  const [typingUser, setTypingUser] = useState<string | null>(null);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [autoScroll, setAutoScroll] = useState(true);
  const [unreadCount, setUnreadCount] = useState(0);

  const bottomRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const fileRef = useRef<HTMLInputElement>(null);
  const longPressTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const messagesContainerRef = useRef<HTMLDivElement>(null);
  const typingTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const pusherRef = useRef<any>(null);

  // WebSocket connection for real-time
  useEffect(() => {
    if (!myId) return;

    // Initialize Pusher
    const pusher = new Pusher(process.env.NEXT_PUBLIC_PUSHER_KEY!, {
      cluster: process.env.NEXT_PUBLIC_PUSHER_CLUSTER!,
    });

    const channel = pusher.subscribe(`chat-${id}`);

    // Listen for new messages
    channel.bind("new-message", (data: Message) => {
      setMessages((prev) => {
        // Check if message already exists
        if (prev.some((m) => m.id === data.id)) return prev;
        return [...prev, data];
      });

      // Mark as seen if window is visible
      if (document.visibilityState === "visible") {
        markAsSeen(data.id);
      } else {
        setUnreadCount((prev) => prev + 1);
      }
    });

    // Listen for typing indicators
    channel.bind("typing", (data: { userId: string; userName: string }) => {
      if (data.userId !== myId) {
        setTypingUser(data.userName);
        if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current);
        typingTimeoutRef.current = setTimeout(() => setTypingUser(null), 2000);
      }
    });

    // Listen for message seen
    channel.bind("message-seen", (data: { messageId: string }) => {
      setMessages((prev) =>
        prev.map((m) => (m.id === data.messageId ? { ...m, seen: true } : m)),
      );
    });

    // Listen for message deletion
    channel.bind("message-deleted", (data: { messageId: string }) => {
      setMessages((prev) => prev.filter((m) => m.id !== data.messageId));
    });

    pusherRef.current = pusher;

    return () => {
      channel.unbind_all();
      channel.unsubscribe();
      pusher.disconnect();
    };
  }, [id, myId]);

  // Auto-scroll logic
  useEffect(() => {
    if (autoScroll) {
      bottomRef.current?.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages, autoScroll]);

  // Detect manual scroll
  const handleScroll = useCallback(() => {
    if (!messagesContainerRef.current) return;
    const { scrollTop, scrollHeight, clientHeight } =
      messagesContainerRef.current;
    const isNearBottom = scrollHeight - scrollTop - clientHeight < 100;
    setAutoScroll(isNearBottom);
  }, []);

  // Mark message as seen
  const markAsSeen = async (messageId: string) => {
    await fetch(`/api/seniors/${id}/messages/${messageId}/seen`, {
      method: "POST",
    });
  };

  // Typing indicator
  const handleTyping = useCallback(() => {
    if (!myId) return;

    const channel = pusherRef.current?.channel(`chat-${id}`);
    if (channel) {
      channel.trigger("client-typing", {
        userId: myId,
        userName: myName,
      });
    }
  }, [id, myId, myName]);

  async function fetchMessages() {
    const res = await fetch(`/api/seniors/${id}/messages`);
    if (res.ok) {
      const data = await res.json();
      setMessages(data);
    }
  }

  useEffect(() => {
    fetch("/api/auth/session")
      .then((r) => r.json())
      .then((d) => {
        if (d?.user?.id) {
          setMyId(d.user.id);
          setMyName(d.user.name);
        }
      });

    fetch(`/api/seniors/${id}`)
      .then((r) => r.json())
      .then((d) => {
        if (d?.name) setSeniorName(d.name);
      });
  }, [id]);

  useEffect(() => {
    fetchMessages();
    // Polling as fallback (every 30 seconds)
    const interval = setInterval(fetchMessages, 30000);
    return () => clearInterval(interval);
  }, [id]);

  function handlePressStart(msgId: string, isMe: boolean) {
    if (!isMe) return;
    longPressTimer.current = setTimeout(() => {
      setDeleteId(msgId);
    }, 500);
  }

  function handlePressEnd() {
    if (longPressTimer.current) {
      clearTimeout(longPressTimer.current);
    }
  }

  async function handleDelete() {
    if (!deleteId) return;
    await fetch(`/api/seniors/${id}/messages/${deleteId}`, {
      method: "DELETE",
    });
    setDeleteId(null);

    // Trigger real-time deletion
    const channel = pusherRef.current?.channel(`chat-${id}`);
    if (channel) {
      channel.trigger("client-message-deleted", { messageId: deleteId });
    }

    await fetchMessages();
  }

  async function copyMessage(content: string, msgId: string) {
    await navigator.clipboard.writeText(content);
    setCopiedId(msgId);
    setTimeout(() => setCopiedId(null), 2000);
  }

  async function handleSend() {
    if (!input.trim() || loading) return;
    setLoading(true);

    const tempMsg: Message = {
      id: `temp-${Date.now()}`,
      content: input.trim(),
      imageUrl: null,
      createdAt: new Date().toISOString(),
      seen: false,
      user: { name: myName || "あなた", id: myId },
    };
    setMessages((prev) => [...prev, tempMsg]);
    const sentContent = input.trim();
    setInput("");

    const res = await fetch(`/api/seniors/${id}/messages`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ content: sentContent }),
    });

    if (res.ok) {
      await fetchMessages();
    }
    setLoading(false);
    inputRef.current?.focus();

    // Reset textarea height
    if (inputRef.current) {
      inputRef.current.style.height = "38px";
    }
  }

  async function handleImageUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    setImageUploading(true);
    const formData = new FormData();
    formData.append("file", file);

    const res = await fetch("/api/upload", {
      method: "POST",
      body: formData,
    });

    if (res.ok) {
      const { url } = await res.json();
      const msgRes = await fetch(`/api/seniors/${id}/messages`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ content: "", imageUrl: url }),
      });
      if (msgRes.ok) await fetchMessages();
    }
    setImageUploading(false);
    if (fileRef.current) fileRef.current.value = "";
  }

  async function handleKeyDown(e: React.KeyboardEvent) {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      await handleSend();
    }
    if (e.key !== "Enter") {
      handleTyping();
    }
  }

  // Document visibility to mark messages as seen
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.visibilityState === "visible" && unreadCount > 0) {
        setUnreadCount(0);
        // Mark latest messages as seen
        messages.forEach((msg) => {
          if (!msg.seen && msg.user.id !== myId) {
            markAsSeen(msg.id);
          }
        });
      }
    };

    document.addEventListener("visibilitychange", handleVisibilityChange);
    return () =>
      document.removeEventListener("visibilitychange", handleVisibilityChange);
  }, [messages, myId, unreadCount]);

  return (
    <div className="flex flex-col bg-gray-50" style={{ height: "100dvh" }}>
      {/* Image Zoom Modal */}
      {zoomImage && (
        <div
          className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4"
          onClick={() => setZoomImage(null)}
        >
          <div className="relative max-w-full max-h-full">
            <img
              src={zoomImage}
              alt="zoom"
              className="max-w-full max-h-screen rounded-xl object-contain"
            />
            <div className="absolute top-2 right-2 flex gap-2">
              <a
                href={zoomImage}
                download
                target="_blank"
                rel="noopener noreferrer"
                onClick={(e) => e.stopPropagation()}
                className="bg-white text-gray-700 text-xs px-3 py-1.5 rounded-full font-medium shadow"
              >
                💾 保存
              </a>
              <button
                onClick={() => setZoomImage(null)}
                className="bg-white text-gray-700 text-xs px-3 py-1.5 rounded-full font-medium shadow"
              >
                ✕ 閉じる
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Modal */}
      {deleteId && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-end justify-center p-4">
          <div className="bg-white rounded-2xl p-6 w-full max-w-sm mb-4">
            <p className="text-sm font-medium text-gray-900 mb-1 text-center">
              メッセージを削除しますか？
            </p>
            <p className="text-xs text-gray-400 text-center mb-4">
              この操作は取り消せません
            </p>
            <div className="grid grid-cols-2 gap-3">
              <button
                onClick={() => setDeleteId(null)}
                className="py-2.5 border border-gray-200 rounded-xl text-sm text-gray-600"
              >
                キャンセル
              </button>
              <button
                onClick={handleDelete}
                className="py-2.5 bg-red-500 text-white rounded-xl text-sm font-medium"
              >
                削除する
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Navbar */}
      <nav className="bg-white border-b border-gray-100 px-4 py-3 flex items-center gap-3 shrink-0">
        <button
          onClick={() => router.back()}
          className="text-gray-400 hover:text-gray-600 text-lg"
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
              {unreadCount > 0 && (
                <span className="ml-2 bg-indigo-500 text-white px-1.5 py-0.5 rounded-full text-xs">
                  {unreadCount} new
                </span>
              )}
            </p>
          </div>
        </div>
      </nav>

      {/* Typing Indicator */}
      {typingUser && (
        <div className="px-4 py-2 text-xs text-gray-400 italic">
          {typingUser}が入力中...
        </div>
      )}

      {/* Messages */}
      <div
        ref={messagesContainerRef}
        onScroll={handleScroll}
        className="flex-1 overflow-y-auto px-4 py-4 max-w-2xl mx-auto w-full"
      >
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
              const isTemp = msg.id.startsWith("temp-");
              const isCopied = copiedId === msg.id;

              return (
                <div key={msg.id}>
                  {showDate && <DateSeparator date={msg.createdAt} />}
                  <div
                    className={`flex ${isMe ? "justify-end" : "justify-start"} mb-1 w-full group`}
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
                          <div className="flex flex-col items-end">
                            <p className="text-xs text-gray-300 mb-0.5">
                              {isTemp
                                ? "送信中..."
                                : new Date(msg.createdAt).toLocaleTimeString(
                                    "ja-JP",
                                    {
                                      timeZone: "Asia/Tokyo",
                                      hour: "2-digit",
                                      minute: "2-digit",
                                    },
                                  )}
                            </p>
                            {!isTemp && msg.seen && (
                              <p className="text-[10px] text-gray-300">
                                既読 ✓✓
                              </p>
                            )}
                          </div>
                        )}
                        <div
                          className={`px-4 py-2.5 rounded-2xl text-sm leading-relaxed select-none relative ${
                            isMe
                              ? `bg-indigo-600 text-white rounded-tr-sm ${isTemp ? "opacity-70" : ""}`
                              : "bg-white border border-gray-100 text-gray-800 rounded-tl-sm shadow-sm"
                          }`}
                          onMouseDown={() => handlePressStart(msg.id, isMe)}
                          onMouseUp={handlePressEnd}
                          onMouseLeave={handlePressEnd}
                          onTouchStart={() => handlePressStart(msg.id, isMe)}
                          onTouchEnd={handlePressEnd}
                        >
                          {msg.imageUrl && (
                            <img
                              src={msg.imageUrl}
                              alt="image"
                              className="rounded-xl max-w-full max-h-48 object-cover mb-1 cursor-pointer"
                              onClick={() => setZoomImage(msg.imageUrl)}
                            />
                          )}
                          {msg.content && <p>{msg.content}</p>}

                          {/* Copy button on hover */}
                          {!isMe && (
                            <button
                              onClick={() => copyMessage(msg.content, msg.id)}
                              className="absolute -top-2 -right-2 bg-gray-800 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                              title="コピー"
                            >
                              {isCopied ? "✓" : "📋"}
                            </button>
                          )}
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

      {/* Emoji Picker */}
      {showEmoji && (
        <div className="shrink-0 max-w-2xl mx-auto w-full">
          <EmojiPicker
            onEmojiClick={(emoji: EmojiClickData) => {
              setInput((prev) => prev + emoji.emoji);
              setShowEmoji(false);
              inputRef.current?.focus();
            }}
            width="100%"
            height={300}
          />
        </div>
      )}

      {/* Input */}
      <div
        className="bg-white border-t border-gray-100 px-3 py-2 shrink-0"
        style={{ paddingBottom: "max(8px, env(safe-area-inset-bottom))" }}
      >
        <div className="max-w-2xl mx-auto flex items-end gap-2">
          <button
            onClick={() => setShowEmoji(!showEmoji)}
            className="w-9 h-9 shrink-0 flex items-center justify-center text-xl hover:bg-gray-100 rounded-full transition-colors"
          >
            😊
          </button>
          <button
            onClick={() => fileRef.current?.click()}
            disabled={imageUploading}
            className="w-9 h-9 shrink-0 flex items-center justify-center text-xl hover:bg-gray-100 rounded-full transition-colors disabled:opacity-50"
          >
            {imageUploading ? "⏳" : "📷"}
          </button>
          <input
            ref={fileRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={handleImageUpload}
          />
          <textarea
            ref={inputRef}
            value={input}
            onChange={(e) => {
              setInput(e.target.value);
              e.target.style.height = "auto";
              e.target.style.height = `${Math.min(e.target.scrollHeight, 100)}px`;
              handleTyping();
            }}
            onKeyDown={handleKeyDown}
            placeholder="メッセージを入力..."
            rows={1}
            className="flex-1 min-w-0 border border-gray-200 rounded-2xl px-3 py-2 text-base focus:outline-none focus:ring-2 focus:ring-indigo-400 resize-none"
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
