// app/components/ContactFeedbackForm.tsx
"use client";

import { useState } from "react";
import {
  Star,
  Send,
  User,
  Mail,
  MessageCircle,
  CheckCircle,
} from "lucide-react";

export function ContactFeedbackForm() {
  const [rating, setRating] = useState(0);
  const [hover, setHover] = useState(0);
  const [comment, setComment] = useState("");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (rating === 0) {
      setError("評価を選択してください");
      return;
    }
    setLoading(true);
    setError("");

    const res = await fetch("/api/feedback", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ rating, comment, name, email }),
    });

    if (res.ok) {
      setDone(true);
    } else {
      setError("エラーが発生しました。もう一度お試しください。");
    }
    setLoading(false);
  }

  if (done) {
    return (
      <div className="bg-linear-to-br from-green-50 to-emerald-50 rounded-2xl border border-green-100 shadow-sm p-10 text-center">
        <div className="w-20 h-20 bg-linear-to-br from-green-500 to-emerald-500 rounded-full flex items-center justify-center mx-auto mb-5 shadow-lg">
          <CheckCircle className="w-10 h-10 text-white" />
        </div>
        <h3 className="text-2xl font-bold text-gray-900 mb-2">
          ありがとうございました！
        </h3>
        <p className="text-gray-500">
          フィードバックを受け取りました。今後の改善に役立てます。
        </p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-lg p-8 transition-all duration-300 hover:shadow-xl">
      <div className="text-center mb-8">
        <div className="inline-flex items-center gap-2 bg-indigo-50 text-indigo-600 px-4 py-2 rounded-full text-sm font-medium mb-4">
          <MessageCircle className="w-4 h-4" />
          ご意見をお聞かせください
        </div>
        <h2 className="text-2xl font-bold text-gray-900">
          フィードバックを送る
        </h2>
        <p className="text-gray-500 mt-2">
          サービス改善のため、率直なご意見をお待ちしています
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Star rating */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-3">
            評価 <span className="text-red-400">*</span>
          </label>
          <div className="flex gap-2">
            {[1, 2, 3, 4, 5].map((star) => (
              <button
                key={star}
                type="button"
                onClick={() => setRating(star)}
                onMouseEnter={() => setHover(star)}
                onMouseLeave={() => setHover(0)}
                className="focus:outline-none transition-transform hover:scale-110"
                aria-label={`${star}星評価`}
              >
                <Star
                  className={`w-8 h-8 ${
                    star <= (hover || rating)
                      ? "fill-yellow-400 text-yellow-400"
                      : "text-gray-300"
                  } transition-colors duration-150`}
                />
              </button>
            ))}
          </div>
          <p className="text-sm text-gray-400 mt-2">
            {rating > 0 && (
              <span className="text-indigo-500">
                {rating === 5 && "最高です！"}
                {rating === 4 && "とても良いです"}
                {rating === 3 && "普通です"}
                {rating === 2 && "もう少し改善が必要"}
                {rating === 1 && "改善が必要です"}
              </span>
            )}
          </p>
        </div>

        {/* Comment */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            ご意見・ご要望
          </label>
          <textarea
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            rows={4}
            placeholder="使ってみた感想、改善してほしい点など、どんなことでもお聞かせください..."
            className="w-full border border-gray-200 rounded-xl px-5 py-3 text-gray-700 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:border-transparent transition-all resize-none"
          />
        </div>

        {/* Name & Email */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <User className="w-4 h-4 inline mr-1" />
              お名前 <span className="text-gray-400 text-xs">任意</span>
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="田中 太郎"
              className="w-full border border-gray-200 rounded-xl px-5 py-3 text-gray-700 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:border-transparent transition-all"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <Mail className="w-4 h-4 inline mr-1" />
              メールアドレス <span className="text-gray-400 text-xs">任意</span>
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="tanaka@example.com"
              className="w-full border border-gray-200 rounded-xl px-5 py-3 text-gray-700 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:border-transparent transition-all"
            />
          </div>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-100 rounded-xl px-5 py-3">
            <p className="text-red-600 text-sm">{error}</p>
          </div>
        )}

        <button
          type="submit"
          disabled={loading}
          className="w-full py-3.5 bg-linear-to-r from-indigo-600 to-indigo-500 text-white text-base font-semibold rounded-xl hover:from-indigo-700 hover:to-indigo-600 disabled:opacity-50 transition-all duration-300 shadow-md hover:shadow-lg flex items-center justify-center gap-2 group"
        >
          {loading ? (
            <>
              <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
              送信中...
            </>
          ) : (
            <>
              フィードバックを送る
              <Send className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </>
          )}
        </button>
      </form>
    </div>
  );
}
