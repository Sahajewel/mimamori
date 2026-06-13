"use client";

import { useState } from "react";

export function QuickLinkButton({
  seniorId,
  seniorName,
}: {
  seniorId: string;
  seniorName: string;
}) {
  const [quickUrl, setQuickUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);
  const [showQR, setShowQR] = useState(false);
  const [showRegenerate, setShowRegenerate] = useState(false);
  const [regenerating, setRegenerating] = useState(false);
  async function regenerateLink() {
    setRegenerating(true);
    const res = await fetch(`/api/seniors/${seniorId}/quick-token`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ regenerate: true }),
    });
    const data = await res.json();
    setQuickUrl(data.quickUrl);
    setRegenerating(false);
    setShowRegenerate(false);
    setShowQR(false);
  }
  async function generateLink() {
    setLoading(true);
    const res = await fetch(`/api/seniors/${seniorId}/quick-token`, {
      method: "POST",
    });
    const data = await res.json();
    setQuickUrl(data.quickUrl);
    setLoading(false);
  }

  async function copyLink() {
    await navigator.clipboard.writeText(quickUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  const qrUrl = quickUrl
    ? `https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=${encodeURIComponent(quickUrl)}`
    : "";

  function handlePrint() {
    const printWindow = window.open("", "_blank");
    if (!printWindow) return;

    printWindow.document.write(`
      <!DOCTYPE html>
      <html lang="ja">
      <head>
        <meta charset="UTF-8">
        <title>Mimamori QRコード - ${seniorName}さん</title>
        <style>
          * { margin: 0; padding: 0; box-sizing: border-box; }
          body {
            font-family: -apple-system, BlinkMacSystemFont, "Hiragino Sans", sans-serif;
            display: flex;
            align-items: center;
            justify-content: center;
            min-height: 100vh;
            background: #f8f9fa;
          }
          .card {
            background: white;
            border-radius: 24px;
            padding: 48px 40px;
            text-align: center;
            max-width: 400px;
            width: 100%;
            box-shadow: 0 4px 24px rgba(0,0,0,0.08);
          }
          .logo {
            width: 56px;
            height: 56px;
            background: #EEF2FF;
            border-radius: 16px;
            display: flex;
            align-items: center;
            justify-content: center;
            margin: 0 auto 16px;
            font-size: 24px;
            color: #4F46E5;
          }
          .app-name {
            font-size: 13px;
            color: #9CA3AF;
            margin-bottom: 24px;
            letter-spacing: 0.05em;
          }
          .name {
            font-size: 28px;
            font-weight: 600;
            color: #111827;
            margin-bottom: 8px;
          }
          .subtitle {
            font-size: 14px;
            color: #6B7280;
            margin-bottom: 32px;
            line-height: 1.6;
          }
          .qr-wrap {
            background: #F9FAFB;
            border-radius: 16px;
            padding: 24px;
            margin-bottom: 32px;
            display: inline-block;
          }
          .qr-wrap img {
            width: 200px;
            height: 200px;
            display: block;
          }
          .steps {
            text-align: left;
            background: #EEF2FF;
            border-radius: 12px;
            padding: 16px 20px;
            margin-bottom: 24px;
          }
          .steps-title {
            font-size: 12px;
            font-weight: 600;
            color: #4F46E5;
            margin-bottom: 10px;
          }
          .step {
            display: flex;
            align-items: center;
            gap: 10px;
            margin-bottom: 8px;
            font-size: 13px;
            color: #374151;
          }
          .step:last-child { margin-bottom: 0; }
          .step-num {
            width: 22px;
            height: 22px;
            background: #4F46E5;
            color: white;
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 11px;
            font-weight: 600;
            flex-shrink: 0;
          }
          .footer {
            font-size: 11px;
            color: #D1D5DB;
          }
          @media print {
            body { background: white; }
            .card { box-shadow: none; }
          }
        </style>
      </head>
      <body>
        <div class="card">
          <div class="logo">♡</div>
          <p class="app-name">Mimamori</p>
          <p class="name">${seniorName}さんへ</p>
          <p class="subtitle">
            毎日の体調とお薬を記録するための<br>
            あなた専用のページです
          </p>
          <div class="qr-wrap">
            <img src="${qrUrl}" alt="QR Code" />
          </div>
          <div class="steps">
            <p class="steps-title">📱 使い方</p>
            <div class="step">
              <span class="step-num">1</span>
              <span>スマホのカメラを開く</span>
            </div>
            <div class="step">
              <span class="step-num">2</span>
              <span>QRコードにカメラを向ける</span>
            </div>
            <div class="step">
              <span class="step-num">3</span>
              <span>表示されたリンクをタップ</span>
            </div>
            <div class="step">
              <span class="step-num">4</span>
              <span>毎日ボタンを押すだけ！</span>
            </div>
          </div>
          <p class="footer">© 2026 Mimamori — ご家族をつなぐ</p>
        </div>
        <script>
          window.onload = function() { window.print(); }
        </script>
      </body>
      </html>
    `);
    printWindow.document.close();
  }

  return (
    <div className="bg-indigo-50 border border-indigo-100 rounded-xl p-4">
      <p className="text-sm font-medium text-indigo-700 mb-1">
        ご本人用クイックリンク
      </p>
      <p className="text-xs text-indigo-500 mb-3">
        QRコードを印刷してご本人に渡すと、ログインなしで体調・お薬を記録できます
      </p>

      {!quickUrl ? (
        <button
          onClick={generateLink}
          disabled={loading}
          className="w-full py-2 bg-indigo-600 text-white text-sm font-medium rounded-lg hover:bg-indigo-700 disabled:opacity-50 transition-colors"
        >
          {loading ? "生成中..." : "リンクを生成する"}
        </button>
      ) : (
        <div className="space-y-3">
          {/* QR preview */}
          {showQR && (
            <div className="bg-white rounded-xl p-4 text-center">
              <p className="text-xs text-gray-400 mb-3">
                QRコードをスマホで読み取れます
              </p>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={qrUrl} alt="QR Code" className="mx-auto w-36 h-36" />
            </div>
          )}

          {/* URL */}
          <p className="text-xs text-gray-500 bg-white rounded-lg p-2 break-all">
            {quickUrl}
          </p>

          {/* Buttons */}
          <div className="grid grid-cols-3 gap-2">
            <button
              onClick={copyLink}
              className="py-2 bg-indigo-600 text-white text-xs font-medium rounded-lg hover:bg-indigo-700 transition-colors"
            >
              {copied ? "✓ コピー" : "コピー"}
            </button>
            <button
              onClick={() => setShowQR(!showQR)}
              className="py-2 bg-white border border-indigo-200 text-indigo-600 text-xs font-medium rounded-lg hover:bg-indigo-50 transition-colors"
            >
              {showQR ? "QRを隠す" : "QR表示"}
            </button>
            <button
              onClick={handlePrint}
              className="py-2 bg-white border border-indigo-200 text-indigo-600 text-xs font-medium rounded-lg hover:bg-indigo-50 transition-colors"
            >
              🖨️ 印刷
            </button>
          </div>
          {/* এই অংশ — Buttons (コピー/QR/印刷) এর নিচে, safe zone */}
          <div className="mt-3 pt-3 border-t border-indigo-100">
            <button
              onClick={() => setShowRegenerate(true)}
              className="w-full py-1.5 text-xs text-gray-400 hover:text-red-500 transition-colors"
            >
              🔄 新しいリンクを作り直す
            </button>
          </div>
          {showRegenerate && (
            <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
              <div className="bg-white rounded-2xl w-full max-w-sm p-6">
                <p className="text-lg font-semibold text-gray-900 mb-3 text-center">
                  ⚠️ 新しいリンクを作り直しますか？
                </p>
                <p className="text-sm text-gray-500 text-center mb-5 leading-relaxed">
                  今のQRコードやホーム画面のアイコンは、使えなくなります。
                  ご本人に新しいQRコードを渡して、もう一度ホーム画面に追加してもらってください。
                </p>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    onClick={() => setShowRegenerate(false)}
                    disabled={regenerating}
                    className="py-3 border border-gray-200 rounded-xl text-sm font-medium text-gray-600 hover:bg-gray-50 disabled:opacity-50"
                  >
                    キャンセル
                  </button>
                  <button
                    onClick={regenerateLink}
                    disabled={regenerating}
                    className="py-3 bg-red-500 text-white rounded-xl text-sm font-semibold hover:bg-red-600 disabled:opacity-50"
                  >
                    {regenerating ? "作成中..." : "作り直す"}
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
