/* eslint-disable react-hooks/set-state-in-effect */
/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @next/next/no-img-element */
"use client";

import { useParams, useRouter } from "next/navigation";
import { useState, useEffect, useRef } from "react";
import EmojiPicker, { EmojiClickData } from "emoji-picker-react";
import { BackButton } from "@/app/components/BackButton";

type Message = {
  id: string;
  content: string;
  imageUrl: string | null;
  createdAt: string;
  deleted: boolean;
  editedAt: string | null;
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
  const [showEmoji, setShowEmoji] = useState(false);
  const [imageUploading, setImageUploading] = useState(false);
  const [zoomImage, setZoomImage] = useState<string | null>(null);
  const [actionMsg, setActionMsg] = useState<Message | null>(null);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editInput, setEditInput] = useState("");

  const bottomRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const fileRef = useRef<HTMLInputElement>(null);
  const longPressTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

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
        if (d?.user?.id) setMyId(d.user.id);
      });

    fetch(`/api/seniors/${id}`)
      .then((r) => r.json())
      .then((d) => {
        if (d?.name) setSeniorName(d.name);
      });

    // Mark as read
    fetch(`/api/seniors/${id}/messages/unread`, { method: "POST" });
  }, [id]);

  useEffect(() => {
    fetchMessages();
    const interval = setInterval(fetchMessages, 5000);
    return () => clearInterval(interval);
  }, [id]);

  const prevMessageCount = useRef(0);

  useEffect(() => {
    // শুধু নতুন message আসলে scroll করো
    if (messages.length > prevMessageCount.current) {
      bottomRef.current?.scrollIntoView({ behavior: "smooth" });
    }
    prevMessageCount.current = messages.length;
  }, [messages]);

  function handlePressStart(msg: Message, isMe: boolean) {
    if (!isMe || msg.deleted) return;
    longPressTimer.current = setTimeout(() => {
      setActionMsg(msg);
    }, 500);
  }

  function handlePressEnd() {
    if (longPressTimer.current) {
      clearTimeout(longPressTimer.current);
    }
  }

  async function handleDelete() {
    if (!actionMsg) return;
    await fetch(`/api/seniors/${id}/messages/${actionMsg.id}`, {
      method: "DELETE",
    });
    setActionMsg(null);
    await fetchMessages();
  }

  function handleEditStart() {
    if (!actionMsg) return;
    setEditingId(actionMsg.id);
    setEditInput(actionMsg.content);
    setActionMsg(null);
  }

  async function handleEditSave() {
    if (!editingId || !editInput.trim()) return;
    await fetch(`/api/seniors/${id}/messages/${editingId}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ content: editInput.trim() }),
    });
    setEditingId(null);
    setEditInput("");
    await fetchMessages();
  }

  async function handleSend() {
    if (!input.trim() || loading) return;
    setLoading(true);

    const tempMsg: Message = {
      id: `temp-${Date.now()}`,
      content: input.trim(),
      imageUrl: null,
      deleted: false,
      editedAt: null,
      createdAt: new Date().toISOString(),
      user: { name: "あなた", id: myId },
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
  }

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

      {/* Action Modal (Edit/Delete) */}
      {actionMsg && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-end justify-center p-4">
          <div className="bg-white rounded-2xl w-full max-w-sm mb-4 overflow-hidden">
            <div className="px-4 py-3 border-b border-gray-50">
              <p className="text-xs text-gray-400 text-center truncate">
                {actionMsg.content || "画像"}
              </p>
            </div>
            {!actionMsg.imageUrl && (
              <button
                onClick={handleEditStart}
                className="w-full py-3.5 text-sm font-medium text-indigo-600 border-b border-gray-50 hover:bg-gray-50"
              >
                ✏️ 編集する
              </button>
            )}
            <button
              onClick={handleDelete}
              className="w-full py-3.5 text-sm font-medium text-red-500 border-b border-gray-50 hover:bg-gray-50"
            >
              🗑️ 削除する
            </button>
            <button
              onClick={() => setActionMsg(null)}
              className="w-full py-3.5 text-sm text-gray-400 hover:bg-gray-50"
            >
              キャンセル
            </button>
          </div>
        </div>
      )}

      {/* Edit Modal */}
      {editingId && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-end justify-center p-4">
          <div className="bg-white rounded-2xl w-full max-w-sm mb-4 p-4">
            <p className="text-sm font-medium text-gray-900 mb-3">
              メッセージを編集
            </p>
            <textarea
              value={editInput}
              onChange={(e) => setEditInput(e.target.value)}
              rows={3}
              className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400 resize-none mb-3"
            />
            <div className="grid grid-cols-2 gap-3">
              <button
                onClick={() => {
                  setEditingId(null);
                  setEditInput("");
                }}
                className="py-2.5 border border-gray-200 rounded-xl text-sm text-gray-600"
              >
                キャンセル
              </button>
              <button
                onClick={handleEditSave}
                className="py-2.5 bg-indigo-600 text-white rounded-xl text-sm font-medium"
              >
                保存する
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Navbar */}
      {/* Navbar */}
      <nav className="bg-white border-b border-gray-100 px-4 py-3 flex items-center gap-3 shrink-0 pl-16">
        <BackButton />
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
              const isTemp = msg.id.startsWith("temp-");

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
                          <div className="flex flex-col items-end gap-0.5">
                            {msg.editedAt && !msg.deleted && (
                              <p className="text-xs text-gray-300">編集済み</p>
                            )}
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
                          </div>
                        )}
                        <div
                          className={`px-4 py-2.5 rounded-2xl text-sm leading-relaxed cursor-pointer select-none ${
                            isMe
                              ? `bg-indigo-600 text-white rounded-tr-sm ${isTemp ? "opacity-70" : ""}`
                              : "bg-white border border-gray-100 text-gray-800 rounded-tl-sm shadow-sm"
                          }`}
                          onMouseDown={() => handlePressStart(msg, isMe)}
                          onMouseUp={handlePressEnd}
                          onMouseLeave={handlePressEnd}
                          onTouchStart={() => handlePressStart(msg, isMe)}
                          onTouchEnd={handlePressEnd}
                        >
                          {msg.deleted ? (
                            <p
                              className={`text-xs italic ${isMe ? "text-indigo-200" : "text-gray-400"}`}
                            >
                              このメッセージは削除されました
                            </p>
                          ) : (
                            <>
                              {msg.imageUrl && (
                                <img
                                  src={msg.imageUrl}
                                  alt="image"
                                  className="rounded-xl max-w-full max-h-48 object-cover mb-1 cursor-pointer"
                                  onClick={() => setZoomImage(msg.imageUrl)}
                                />
                              )}
                              {msg.content && <p>{msg.content}</p>}
                            </>
                          )}
                        </div>
                        {!isMe && (
                          <div className="flex flex-col gap-0.5">
                            {msg.editedAt && !msg.deleted && (
                              <p className="text-xs text-gray-300">編集済み</p>
                            )}
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
                          </div>
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
            className="w-9 h-9 shrink-0 flex items-center justify-center text-xl"
          >
            😊
          </button>
          <button
            onClick={() => fileRef.current?.click()}
            disabled={imageUploading}
            className="w-9 h-9 shrink-0 flex items-center justify-center text-xl disabled:opacity-50"
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
