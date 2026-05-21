"use client";

import { useState } from "react";

export function FeedbackSection() {
  const [rating, setRating] = useState(0);
  const [hover, setHover] = useState(0);
  const [comment, setComment] = useState("");
  const [featureRequest, setFeatureRequest] = useState("");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit() {
    if (!rating) {
      setError("評価を選択してください");
      return;
    }

    setLoading(true);
    setError("");

    const res = await fetch("/api/feedback", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ rating, comment, featureRequest, name, email }),
    });

    if (res.ok) {
      setSent(true);
    } else {
      setError("エラーが発生しました");
    }
    setLoading(false);
  }

  return (
    <section className="py-20 px-4 bg-indigo-50">
      <div className="max-w-xl mx-auto">
        <div className="text-center mb-10">
          <p className="text-xs font-medium text-indigo-400 tracking-widest uppercase mb-3">
            Feedback
          </p>
          <h2 className="text-2xl md:text-3xl font-medium text-gray-900 mb-3">
            ご意見・ご要望をお聞かせください
          </h2>
          <p className="text-gray-500 text-sm">
            Mimamoriをより良くするために、皆様のご意見をお待ちしております
          </p>
        </div>

        {sent ? (
          <div className="bg-white rounded-2xl p-8 text-center shadow-sm">
            <p className="text-4xl mb-4">🌸</p>
            <p className="text-lg font-medium text-gray-900 mb-2">
              ありがとうございます！
            </p>
            <p className="text-sm text-gray-400">
              フィードバックを受け取りました。より良いサービスのために活用させていただきます。
            </p>
          </div>
        ) : (
          <div className="bg-white rounded-2xl p-8 shadow-sm">
            {/* Rating */}
            <div className="mb-6">
              <p className="text-sm font-medium text-gray-700 mb-3 text-center">
                Mimamoriの評価をお聞かせください
              </p>
              <div className="flex justify-center gap-2">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    onClick={() => setRating(star)}
                    onMouseEnter={() => setHover(star)}
                    onMouseLeave={() => setHover(0)}
                    className="text-4xl transition-transform hover:scale-110"
                  >
                    {star <= (hover || rating) ? "⭐" : "☆"}
                  </button>
                ))}
              </div>
              {rating > 0 && (
                <p className="text-center text-sm text-indigo-500 mt-2">
                  {rating === 1
                    ? "改善が必要です"
                    : rating === 2
                      ? "もう少し改善できます"
                      : rating === 3
                        ? "普通です"
                        : rating === 4
                          ? "良いです！"
                          : "とても良いです！"}
                </p>
              )}
            </div>

            {/* Comment */}
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1.5">
                感想・ご意見
                <span className="text-xs text-gray-400 ml-2">任意</span>
              </label>
              <textarea
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                rows={3}
                placeholder="使ってみていかがでしたか？"
                className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400 resize-none"
              />
            </div>

            {/* Feature Request */}
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1.5">
                こんな機能がほしい
                <span className="text-xs text-gray-400 ml-2">任意</span>
              </label>
              <textarea
                value={featureRequest}
                onChange={(e) => setFeatureRequest(e.target.value)}
                rows={2}
                placeholder="例：カレンダー表示、複数言語対応..."
                className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400 resize-none"
              />
            </div>

            {/* Name + Email */}
            <div className="grid grid-cols-2 gap-3 mb-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">
                  お名前
                  <span className="text-xs text-gray-400 ml-2">任意</span>
                </label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="田中太郎"
                  className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">
                  メールアドレス
                  <span className="text-xs text-gray-400 ml-2">任意</span>
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="tanaka@example.com"
                  className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400"
                />
              </div>
            </div>

            {error && (
              <p className="text-sm text-red-500 mb-4 text-center">{error}</p>
            )}

            <button
              onClick={handleSubmit}
              disabled={loading || !rating}
              className="w-full py-3 bg-indigo-600 text-white text-sm font-medium rounded-xl hover:bg-indigo-700 disabled:opacity-50 transition-colors"
            >
              {loading ? "送信中..." : "フィードバックを送る"}
            </button>
          </div>
        )}
      </div>
    </section>
  );
}
