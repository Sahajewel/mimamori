"use client";

import { useRouter, useParams } from "next/navigation";
import { useState, useEffect, useRef } from "react";
import { BackButton } from "@/app/components/BackButton";
import Image from "next/image";
import Link from "next/link";
import { SeniorBackLink } from "@/app/components/SeniorBackLink";

export default function EditSeniorPage() {
  const router = useRouter();
  const params = useParams();
  const id = params.id as string;

  const [name, setName] = useState("");
  const [age, setAge] = useState("");
  const [notes, setNotes] = useState("");
  const [photoUrl, setPhotoUrl] = useState("");
  const [photoUploading, setPhotoUploading] = useState(false);
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);
  const [error, setError] = useState("");
  const fileRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    async function fetchSenior() {
      const res = await fetch(`/api/seniors/${id}`);
      const data = await res.json();
      if (res.ok) {
        setName(data.name);
        setAge(data.age?.toString() || "");
        setNotes(data.notes || "");
        setPhotoUrl(data.photoUrl || "");
      }
      setFetching(false);
    }
    fetchSenior();
  }, [id]);

  async function handlePhotoUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setPhotoUploading(true);
    const formData = new FormData();
    formData.append("file", file);
    const res = await fetch("/api/upload", { method: "POST", body: formData });
    if (res.ok) {
      const { url } = await res.json();
      setPhotoUrl(url);
    }
    setPhotoUploading(false);
    if (fileRef.current) fileRef.current.value = "";
  }

  async function handleSubmit() {
    if (!name.trim()) {
      setError("お名前を入力してください");
      return;
    }
    setLoading(true);
    setError("");
    const res = await fetch(`/api/seniors/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name,
        age: age ? Number(age) : undefined,
        notes: notes || undefined,
        photoUrl: photoUrl || undefined,
      }),
    });
    const data = await res.json();
    if (!res.ok) {
      setError(data.error || "エラーが発生しました");
      setLoading(false);
      return;
    }
    router.push(`/seniors/${id}`);
    router.refresh();
  }

  if (fetching) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-10 h-10 border-2 border-indigo-600 border-t-transparent rounded-full animate-spin mx-auto mb-3" />
          <p className="text-base text-gray-400">読み込み中...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white border-b border-gray-100 px-4 py-4 sticky top-0 z-10 pl-16">
        <div className="max-w-2xl mx-auto flex items-center gap-3">
          <SeniorBackLink seniorId={id}></SeniorBackLink>
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-indigo-600 flex items-center justify-center">
              <span className="text-white text-sm">♡</span>
            </div>
            <p className="font-semibold text-gray-900">家族情報を編集</p>
          </div>
        </div>
      </nav>

      <div className="flex items-center justify-center px-4 py-10">
        <div className="w-full max-w-md">
          {/* Photo section */}
          <div className="bg-white border border-gray-100 rounded-2xl p-6 mb-4 shadow-sm text-center">
            <div
              className="relative w-24 h-24 rounded-full bg-indigo-100 flex items-center justify-center overflow-hidden mx-auto mb-4 cursor-pointer hover:opacity-80 transition-opacity"
              onClick={() => fileRef.current?.click()}
            >
              {photoUrl ? (
                <Image
                  src={photoUrl}
                  alt="photo"
                  fill
                  className="object-cover"
                />
              ) : (
                <span className="text-indigo-600 font-semibold text-3xl">
                  {name.charAt(0) || "?"}
                </span>
              )}
            </div>
            <button
              onClick={() => fileRef.current?.click()}
              disabled={photoUploading}
              className="px-5 py-2 border border-indigo-200 text-indigo-600 text-base font-medium rounded-xl hover:bg-indigo-50 disabled:opacity-50 transition-colors"
            >
              {photoUploading ? "アップロード中..." : "📷 写真を変更する"}
            </button>
            {photoUrl && (
              <button
                onClick={() => setPhotoUrl("")}
                className="block mx-auto mt-2 text-sm text-red-400 hover:text-red-600 transition-colors"
              >
                写真を削除
              </button>
            )}
            <input
              ref={fileRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handlePhotoUpload}
            />
          </div>

          {/* Form */}
          <div className="bg-white border border-gray-100 rounded-2xl p-6 shadow-sm">
            <h1 className="text-2xl font-semibold text-gray-900 mb-5">
              基本情報
            </h1>

            <div className="space-y-5">
              <div>
                <label className="block text-base font-medium text-gray-700 mb-1.5">
                  お名前 <span className="text-red-400">*</span>
                </label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="例：田中花子"
                  className="w-full border border-gray-200 rounded-xl px-4 py-3 text-base focus:outline-none focus:ring-2 focus:ring-indigo-400"
                />
              </div>

              <div>
                <label className="block text-base font-medium text-gray-700 mb-1.5">
                  年齢
                </label>
                <input
                  type="number"
                  value={age}
                  onChange={(e) => setAge(e.target.value)}
                  min={1}
                  max={120}
                  placeholder="例：75"
                  className="w-full border border-gray-200 rounded-xl px-4 py-3 text-base focus:outline-none focus:ring-2 focus:ring-indigo-400"
                />
              </div>

              <div>
                <label className="block text-base font-medium text-gray-700 mb-1.5">
                  メモ <span className="text-sm text-gray-400 ml-1">任意</span>
                </label>
                <textarea
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  rows={3}
                  placeholder="例：高血圧、糖尿病あり"
                  className="w-full border border-gray-200 rounded-xl px-4 py-3 text-base focus:outline-none focus:ring-2 focus:ring-indigo-400 resize-none"
                />
              </div>
            </div>

            {error && (
              <div className="bg-red-50 border border-red-100 rounded-xl px-4 py-3 mt-4">
                <p className="text-base text-red-600">{error}</p>
              </div>
            )}

            <div className="flex gap-3 mt-6">
              <button
                onClick={() => router.back()}
                className="flex-1 py-3 border border-gray-200 text-gray-600 text-base font-medium rounded-xl hover:bg-gray-50 transition-colors"
              >
                キャンセル
              </button>
              <button
                onClick={handleSubmit}
                disabled={loading || !name.trim()}
                className="flex-1 py-3 bg-indigo-600 text-white text-base font-semibold rounded-xl hover:bg-indigo-700 disabled:opacity-50 transition-colors shadow-sm"
              >
                {loading ? "保存中..." : "保存する"}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
