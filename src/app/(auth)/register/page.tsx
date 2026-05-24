"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import Link from "next/link";

type FieldErrors = {
  name?: string;
  email?: string;
  password?: string;
  confirmPassword?: string;
};

export default function RegisterPage() {
  const router = useRouter();
  const [errors, setErrors] = useState<FieldErrors>({});
  const [serverError, setServerError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  function validate(
    name: string,
    email: string,
    password: string,
    confirmPassword: string,
  ): FieldErrors {
    const errs: FieldErrors = {};
    if (!name.trim() || name.length < 2)
      errs.name = "名前は2文字以上入力してください";
    if (!email.trim()) errs.email = "メールアドレスを入力してください";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email))
      errs.email = "有効なメールアドレスを入力してください";
    if (!password) errs.password = "パスワードを入力してください";
    else if (password.length < 8)
      errs.password = "パスワードは8文字以上必要です";
    else if (!/[A-Z]/.test(password))
      errs.password = "大文字を1文字以上含めてください";
    else if (!/[0-9]/.test(password))
      errs.password = "数字を1文字以上含めてください";
    if (password !== confirmPassword)
      errs.confirmPassword = "パスワードが一致しません";
    return errs;
  }

  async function handleSubmit(e: React.SyntheticEvent<HTMLFormElement>) {
    e.preventDefault();
    setServerError("");

    const formData = new FormData(e.currentTarget);
    const name = formData.get("name") as string;
    const email = formData.get("email") as string;
    const password = formData.get("password") as string;
    const confirmPassword = formData.get("confirmPassword") as string;

    const errs = validate(name, email, password, confirmPassword);
    if (Object.keys(errs).length > 0) {
      setErrors(errs);
      return;
    }

    setErrors({});
    setLoading(true);

    const res = await fetch("/api/auth/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, email, password, confirmPassword }),
    });

    const data = await res.json();

    if (!res.ok) {
      setServerError(data.error || "エラーが発生しました");
      setLoading(false);
      return;
    }

    router.push("/login");
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Navbar */}
      <nav className="bg-white border-b border-gray-100 px-4 py-4">
        <div className="max-w-md mx-auto flex items-center">
          <Link href="/" className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-indigo-600 flex items-center justify-center">
              <span className="text-white text-sm">♡</span>
            </div>
            <p className="font-semibold text-gray-900">Mimamori</p>
          </Link>
        </div>
      </nav>

      <div className="flex-1 flex items-center justify-center px-4 py-12">
        <div className="w-full max-w-md">
          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-2xl font-semibold text-gray-900">
              アカウントを作成
            </h1>
            <p className="text-base text-gray-400 mt-1">
              アカウントを作成 今すぐ始めましょう。
            </p>
          </div>

          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
            <form onSubmit={handleSubmit} className="space-y-5">
              {/* Name */}
              <div>
                <label className="block text-base font-medium text-gray-700 mb-1.5">
                  お名前 <span className="text-red-400">*</span>
                </label>
                <input
                  name="name"
                  type="text"
                  placeholder="例：田中 花子"
                  className={`w-full border rounded-xl px-4 py-3 text-base focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:border-transparent transition-colors ${
                    errors.name ? "border-red-300 bg-red-50" : "border-gray-200"
                  }`}
                />
                {errors.name && (
                  <p className="text-sm text-red-500 mt-1.5">{errors.name}</p>
                )}
              </div>

              {/* Email */}
              <div>
                <label className="block text-base font-medium text-gray-700 mb-1.5">
                  メールアドレス <span className="text-red-400">*</span>
                </label>
                <input
                  name="email"
                  type="email"
                  placeholder="例：hanako@example.com"
                  className={`w-full border rounded-xl px-4 py-3 text-base focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:border-transparent transition-colors ${
                    errors.email
                      ? "border-red-300 bg-red-50"
                      : "border-gray-200"
                  }`}
                />
                {errors.email && (
                  <p className="text-sm text-red-500 mt-1.5">{errors.email}</p>
                )}
              </div>

              {/* Password */}
              <div>
                <label className="block text-base font-medium text-gray-700 mb-1.5">
                  パスワード <span className="text-red-400">*</span>
                </label>
                <div className="relative">
                  <input
                    name="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="8文字以上、大文字・数字を含む"
                    autoComplete="new-password"
                    className={`w-full border rounded-xl px-4 py-3 text-base focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:border-transparent pr-16 transition-colors ${
                      errors.password
                        ? "border-red-300 bg-red-50"
                        : "border-gray-200"
                    }`}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-sm text-gray-400 hover:text-gray-600 font-medium"
                  >
                    {showPassword ? "非表示" : "表示"}
                  </button>
                </div>
                {errors.password && (
                  <p className="text-sm text-red-500 mt-1.5">
                    {errors.password}
                  </p>
                )}
                {!errors.password && (
                  <p className="text-sm text-gray-400 mt-1.5">
                    8文字以上・大文字・数字を含めてください
                  </p>
                )}
              </div>

              {/* Confirm Password */}
              <div>
                <label className="block text-base font-medium text-gray-700 mb-1.5">
                  パスワード確認 <span className="text-red-400">*</span>
                </label>
                <div className="relative">
                  <input
                    name="confirmPassword"
                    type={showConfirm ? "text" : "password"}
                    placeholder="パスワードを再入力"
                    autoComplete="new-password"
                    className={`w-full border rounded-xl px-4 py-3 text-base focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:border-transparent pr-16 transition-colors ${
                      errors.confirmPassword
                        ? "border-red-300 bg-red-50"
                        : "border-gray-200"
                    }`}
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirm(!showConfirm)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-sm text-gray-400 hover:text-gray-600 font-medium"
                  >
                    {showConfirm ? "非表示" : "表示"}
                  </button>
                </div>
                {errors.confirmPassword && (
                  <p className="text-sm text-red-500 mt-1.5">
                    {errors.confirmPassword}
                  </p>
                )}
              </div>

              {serverError && (
                <div className="bg-red-50 border border-red-100 rounded-xl px-4 py-3">
                  <p className="text-base text-red-600">{serverError}</p>
                </div>
              )}

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 bg-indigo-600 text-white text-base font-semibold rounded-xl hover:bg-indigo-700 disabled:opacity-50 transition-colors shadow-sm"
              >
                {loading ? "登録中..." : "無料で登録する →"}
              </button>
            </form>

            <div className="mt-6 pt-6 border-t border-gray-100 text-center">
              <p className="text-base text-gray-400">
                すでにアカウントをお持ちの方は{" "}
                <Link
                  href="/login"
                  className="text-indigo-600 font-medium hover:underline"
                >
                  ログイン
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
