"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useState, Suspense } from "react";
import { signIn } from "next-auth/react";
import Link from "next/link";

type FieldErrors = {
  email?: string;
  password?: string;
};

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const verified = searchParams.get("verified");
  const error = searchParams.get("error");

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
        if (res.error === "EMAIL_NOT_VERIFIED") {
          setServerError(
            "メールアドレスの確認が完了していません。確認メールをご確認ください。",
          );
        } else {
          setServerError("メールアドレスまたはパスワードが間違っています");
        }
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
    <div className="w-full max-w-md">
      <div className="text-center mb-8">
        <h1 className="text-2xl font-semibold text-gray-900">おかえりなさい</h1>
        <p className="text-base text-gray-400 mt-1">
          ログインしてご家族を見守りましょう
        </p>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
        {/* Verified message */}
        {verified && (
          <div className="bg-green-50 border border-green-100 rounded-xl px-4 py-3 mb-5">
            <p className="text-base text-green-600">
              ✓ メールアドレスを確認しました！ログインしてください。
            </p>
          </div>
        )}

        {/* Error messages */}
        {error === "expired" && (
          <div className="bg-red-50 border border-red-100 rounded-xl px-4 py-3 mb-5">
            <p className="text-base text-red-600">
              リンクの有効期限が切れました。再度登録してください。
            </p>
          </div>
        )}
        {error === "invalid" && (
          <div className="bg-red-50 border border-red-100 rounded-xl px-4 py-3 mb-5">
            <p className="text-base text-red-600">
              無効なリンクです。再度登録してください。
            </p>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-base font-medium text-gray-700 mb-1.5">
              メールアドレス
            </label>
            <input
              name="email"
              type="email"
              placeholder="例：tanaka@example.com"
              autoComplete="email"
              className={`w-full border rounded-xl px-4 py-3 text-base focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:border-transparent transition-colors ${
                errors.email ? "border-red-300 bg-red-50" : "border-gray-200"
              }`}
            />
            {errors.email && (
              <p className="text-sm text-red-500 mt-1.5">{errors.email}</p>
            )}
          </div>

          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="block text-base font-medium text-gray-700">
                パスワード
              </label>
              <Link
                href="/forgot-password"
                className="text-sm text-indigo-600 hover:underline"
              >
                お忘れですか？
              </Link>
            </div>
            <div className="relative">
              <input
                name="password"
                type={showPassword ? "text" : "password"}
                placeholder="パスワードを入力"
                autoComplete="current-password"
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
              <p className="text-sm text-red-500 mt-1.5">{errors.password}</p>
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
            {loading ? "ログイン中..." : "ログイン →"}
          </button>
        </form>

        <div className="mt-6 pt-6 border-t border-gray-100 text-center">
          <p className="text-base text-gray-400">
            アカウントをお持ちでない方は{" "}
            <Link
              href="/register"
              className="text-indigo-600 font-medium hover:underline"
            >
              新規登録
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}

export default function LoginFormUI() {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <div className="flex-1 flex items-center justify-center px-4 py-12">
        <Suspense
          fallback={<p className="text-base text-gray-400">読み込み中...</p>}
        >
          <LoginForm />
        </Suspense>
      </div>
    </div>
  );
}
