"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { signIn } from "next-auth/react";
import Link from "next/link";

type FieldErrors = {
  email?: string;
  password?: string;
};

export default function LoginPage() {
  const router = useRouter();
  const [errors, setErrors] = useState<FieldErrors>({});
  const [serverError, setServerError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  function validate(email: string, password: string): FieldErrors {
    const errs: FieldErrors = {};
    if (!email.trim()) errs.email = "メールアドレスを入力してください";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email))
      errs.email = "有効なメールアドレスを入力してください";
    if (!password) errs.password = "パスワードを入力してください";
    return errs;
  }

  async function handleSubmit(e: React.SyntheticEvent<HTMLFormElement>) {
    e.preventDefault();
    setServerError("");

    const formData = new FormData(e.currentTarget);
    const email = formData.get("email") as string;
    const password = formData.get("password") as string;

    const errs = validate(email, password);
    if (Object.keys(errs).length > 0) {
      setErrors(errs);
      return;
    }

    setErrors({});
    setLoading(true);

    try {
      const res = await signIn("credentials", {
        redirect: false,
        email,
        password,
      });

      if (res?.error) {
        setServerError("メールアドレスまたはパスワードが間違っています");
        setLoading(false);
      } else {
        const urlParams = new URLSearchParams(window.location.search);
        const token = urlParams.get("token");
        const callbackUrl = urlParams.get("callbackUrl");
        if (token) {
          window.location.href = `/invite/${token}`;
        } else if (callbackUrl) {
          router.push(callbackUrl);
          router.refresh();
        } else {
          router.push("/dashboard");
          router.refresh();
        }
      }
    } catch {
      setServerError("エラーが発生しました");
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
        <div className="mb-8 text-center">
          <div className="w-10 h-10 bg-indigo-100 rounded-xl flex items-center justify-center mx-auto mb-3">
            <span className="text-indigo-600 text-lg">♡</span>
          </div>
          <h1 className="text-xl md:text-2xl font-medium text-gray-900">
            Mimamori へようこそ
          </h1>
          <p className="text-sm text-gray-400 mt-1">
            ログインしてご家族を見守りましょう
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">
              メールアドレス
            </label>
            <input
              name="email"
              type="email"
              placeholder="例：tanaka@example.com"
              autoComplete="email"
              className={`w-full border rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:border-transparent ${
                errors.email ? "border-red-300" : "border-gray-200"
              }`}
            />
            {errors.email && (
              <p className="text-xs text-red-500 mt-1">{errors.email}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">
              パスワード
            </label>
            <div className="relative">
              <input
                name="password"
                type={showPassword ? "text" : "password"}
                placeholder="パスワードを入力"
                autoComplete="current-password"
                className={`w-full border rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:border-transparent pr-12 ${
                  errors.password ? "border-red-300" : "border-gray-200"
                }`}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 text-xs font-medium"
              >
                {showPassword ? "非表示" : "表示"}
              </button>
            </div>
            {errors.password && (
              <p className="text-xs text-red-500 mt-1">{errors.password}</p>
            )}
          </div>

          {serverError && (
            <div className="bg-red-50 border border-red-100 rounded-lg px-4 py-3">
              <p className="text-sm text-red-600">{serverError}</p>
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full py-2.5 bg-indigo-600 text-white text-sm font-medium rounded-lg hover:bg-indigo-700 disabled:opacity-50 transition-colors"
          >
            {loading ? "ログイン中..." : "ログイン"}
          </button>
        </form>
        <p className="text-center text-sm mt-6 text-gray-400">
          <Link
            href="/forgot-password"
            className="text-indigo-600 hover:underline"
          >
            パスワードをお忘れですか？
          </Link>
        </p>

        <p className="text-center text-sm mt-2 text-gray-400">
          アカウントをお持ちでない方は{" "}
          <a href="/register" className="text-indigo-600 hover:underline">
            新規登録
          </a>
        </p>
      </div>
    </div>
  );
}
