"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { BackButton } from "@/app/components/BackButton";

export default function NewSeniorPage() {
  const router = useRouter();
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setError("");

    const formData = new FormData(e.currentTarget);
    const age = formData.get("age");

    const res = await fetch("/api/seniors", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: formData.get("name"),
        age: age ? Number(age) : undefined,
        notes: formData.get("notes") || undefined,
      }),
    });

    const data = await res.json();

    if (!res.ok) {
      setError(data.error || "エラーが発生しました");
      setLoading(false);
      return;
    }

    router.push("/dashboard");
    router.refresh();
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navbar */}
      <nav className="bg-white border-b border-gray-100 px-4 py-4 sticky top-0 z-10 pl-16">
        <div className="max-w-3xl mx-auto flex items-center gap-3">
          <BackButton />
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-indigo-600 flex items-center justify-center">
              <span className="text-white text-sm">♡</span>
            </div>
            <p className="font-semibold text-gray-900 hidden sm:block">
              Mimamori
            </p>
          </div>
        </div>
      </nav>

      <div className="flex items-center justify-center px-4 py-12">
        <div className="w-full max-w-md bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
          <div className="mb-6">
            <h1 className="text-2xl font-semibold text-gray-900">
              家族を追加する
            </h1>
            <p className="text-base text-gray-400 mt-1">
              見守る家族の情報を入力してください
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-base font-medium text-gray-700 mb-1.5">
                お名前 <span className="text-red-400">*</span>
              </label>
              <input
                name="name"
                type="text"
                required
                placeholder="例：田中 太郎"
                className="w-full border border-gray-200 rounded-xl px-4 py-3 text-base focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-base font-medium text-gray-700 mb-1.5">
                年齢
              </label>
              <input
                name="age"
                type="number"
                min={1}
                max={120}
                placeholder="例：78"
                className="w-full border border-gray-200 rounded-xl px-4 py-3 text-base focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-base font-medium text-gray-700 mb-1.5">
                メモ
              </label>
              <textarea
                name="notes"
                rows={3}
                placeholder="例：持病、かかりつけ医など"
                className="w-full border border-gray-200 rounded-xl px-4 py-3 text-base focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:border-transparent resize-none"
              />
            </div>

            {error && <p className="text-base text-red-500">{error}</p>}

            <div className="flex gap-3 pt-2">
              <button
                type="button"
                onClick={() => router.back()}
                className="flex-1 py-3 border border-gray-200 text-gray-600 text-base font-medium rounded-xl hover:bg-gray-50 transition-colors"
              >
                キャンセル
              </button>
              <button
                type="submit"
                disabled={loading}
                className="flex-1 py-3 bg-indigo-600 text-white text-base font-semibold rounded-xl hover:bg-indigo-700 disabled:opacity-50 transition-colors"
              >
                {loading ? "登録中..." : "登録する"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
