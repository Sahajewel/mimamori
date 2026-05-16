"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { signIn } from "next-auth/react"; // 👈 এটি অবশ্যই ইম্পোর্ট করবেন

export default function LoginPage() {
  const router = useRouter();
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setError("");

    const formData = new FormData(e.currentTarget);
    const email = formData.get("email") as string;
    const password = formData.get("password") as string;

    try {
      // 🛑 পুরানো ২টা স্টেপের (CSRF & manual fetch) বদলে শুধু এইটুকু কোড লিখুন:
      const res = await signIn("credentials", {
        redirect: false, // স্বয়ংক্রিয় রিডাইরেক্ট বন্ধ রাখলাম যেন আমরা নিজেরা হ্যান্ডেল করতে পারি
        email,
        password,
      });

      if (res?.error) {
        console.log("Login error:", res.error);
        setError("Email বা password ভুল");
        setLoading(false);
      } else {
        // সেশন কুকি সেট হওয়া নিশ্চিত করে ড্যাশবোর্ডে পাঠানো
        router.push("/dashboard");
        router.refresh();
      }
    } catch (err) {
      console.error(err);
      setError("エラーが発生しました");
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="w-full max-w-md bg-white rounded-2xl shadow p-8">
        <h1 className="text-2xl font-semibold text-center mb-6">
          Mimamori へようこそ
        </h1>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">
              メールアドレス
            </label>
            <input
              name="email"
              type="email"
              required
              className="w-full border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-400"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">パスワード</label>
            <input
              name="password"
              type="password"
              required
              className="w-full border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-400"
            />
          </div>
          {error && <p className="text-red-500 text-sm">{error}</p>}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-indigo-600 text-white py-2 rounded-lg font-medium hover:bg-indigo-700 disabled:opacity-50"
          >
            {loading ? "ログイン中..." : "ログイン"}
          </button>
        </form>
        <p className="text-center text-sm mt-4 text-gray-500">
          アカウントをお持ちでない方は{" "}
          <a href="/register" className="text-indigo-600 hover:underline">
            新規登録
          </a>
        </p>
      </div>
    </div>
  );
}
