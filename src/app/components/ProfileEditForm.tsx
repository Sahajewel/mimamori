"use client";

import { useState, useRef } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";

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

type Props = {
  initialName: string;
  initialImage: string | null;
};

export function ProfileEditForm({ initialName, initialImage }: Props) {
  const router = useRouter();
  const [name, setName] = useState(initialName);
  const [image, setImage] = useState<string | null>(initialImage);
  const [uploading, setUploading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  async function handleImageUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];

    if (!file) return;
    setUploading(true);
    const formData = new FormData();
    formData.append("file", file);
    const res = await fetch("/api/upload", { method: "POST", body: formData });
    if (res.ok) {
      const { url } = await res.json();
      setImage(url);
    }
    setUploading(false);
    if (fileRef.current) fileRef.current.value = "";
  }

  async function handleSave() {
    if (!name.trim()) {
      setError("お名前を入力してください");
      return;
    }
    setSaving(true);
    setError("");
    const res = await fetch("/api/user", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name: name.trim(), image }),
    });

    if (res.ok) {
      setSuccess(true);
      setTimeout(() => {
        router.push("/settings");
        router.refresh();
      }, 800);
    } else {
      const data = await res.json();
      setError(data.error || "エラーが発生しました");
    }
    setSaving(false);
  }

  return (
    <div className="space-y-6">
      {/* 画像 */}
      <div className="flex flex-col items-center gap-4">
        <div className="relative">
          <div className="relative w-28 h-28 bg-indigo-100 rounded-full overflow-hidden flex items-center justify-center text-indigo-600 font-bold text-4xl">
            {image ? (
              <Image src={image} alt="profile" fill className="object-cover" />
            ) : (
              name.charAt(0).toUpperCase()
            )}
          </div>
          <button
            onClick={() => fileRef.current?.click()}
            disabled={uploading}
            className="absolute bottom-0 right-0 w-9 h-9 bg-indigo-600 text-white rounded-full flex items-center justify-center shadow-md hover:bg-indigo-700 transition-colors disabled:opacity-60"
          >
            {uploading ? <Spinner /> : "📷"}
          </button>
        </div>
        <input
          ref={fileRef}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={handleImageUpload}
        />
        {image && (
          <button
            onClick={() => setImage(null)}
            className="text-sm text-red-400 hover:text-red-500"
          >
            写真を削除する
          </button>
        )}
      </div>

      {/* 名前 */}
      <div>
        <label className="block text-base font-medium text-gray-700 mb-1.5">
          お名前 <span className="text-red-400">*</span>
        </label>
        <input
          value={name}
          onChange={(e) => setName(e.target.value)}
          type="text"
          placeholder="お名前を入力"
          className="w-full border border-gray-200 rounded-xl px-4 py-3 text-base focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:border-transparent"
        />
      </div>

      {error && <p className="text-base text-red-500">{error}</p>}
      {success && <p className="text-base text-green-500">✓ 保存しました</p>}

      <div className="flex gap-3 pt-2">
        <button
          onClick={() => router.back()}
          className="flex-1 py-3 border border-gray-200 text-gray-600 text-base font-medium rounded-xl hover:bg-gray-50 transition-colors"
        >
          キャンセル
        </button>
        <button
          onClick={handleSave}
          disabled={saving || uploading}
          className="flex-1 py-3 bg-indigo-600 text-white text-base font-semibold rounded-xl hover:bg-indigo-700 disabled:opacity-50 transition-colors flex items-center justify-center gap-2"
        >
          {saving ? (
            <>
              <Spinner />
              保存中...
            </>
          ) : (
            "保存する"
          )}
        </button>
      </div>
    </div>
  );
}
