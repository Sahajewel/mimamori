// link pathanor por user jokhon link open korbe tokhon ei page open hobe
"use client";

import { useRouter, useParams } from "next/navigation";
import { useEffect, useState } from "react";

export default function AcceptInvitePage() {
  const router = useRouter();
  const params = useParams();
  const token = params.token as string;

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleAccept() {
    setLoading(true);
    setError("");

    const res = await fetch(`/api/invitations/${token}`, {
      method: "POST",
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
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-sm border border-gray-100 p-8 text-center">
        <div className="w-16 h-16 bg-indigo-100 rounded-full flex items-center justify-center mx-auto mb-4 text-3xl">
          ♡
        </div>

        <h1 className="text-xl font-medium text-gray-900 mb-2">
          Mimamoriへの招待
        </h1>
        <p className="text-sm text-gray-400 mb-8">
          ご家族の見守りに参加しましょう
        </p>

        {error && <p className="text-sm text-red-500 mb-4">{error}</p>}

        <button
          onClick={handleAccept}
          disabled={loading}
          className="w-full py-3 bg-indigo-600 text-white text-sm font-medium rounded-lg hover:bg-indigo-700 disabled:opacity-50 transition-colors mb-3"
        >
          {loading ? "参加中..." : "参加する"}
        </button>

        <button
          onClick={() => router.push("/login")}
          className="w-full py-3 border border-gray-200 text-gray-600 text-sm font-medium rounded-lg hover:bg-gray-50 transition-colors"
        >
          ログインページへ
        </button>
      </div>
    </div>
  );
}
