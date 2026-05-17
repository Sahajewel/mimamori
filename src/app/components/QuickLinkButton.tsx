/* eslint-disable @next/next/no-img-element */
// "use client";

// import { useState } from "react";

// export function QuickLinkButton({ seniorId }: { seniorId: string }) {
//   const [quickUrl, setQuickUrl] = useState("");
//   const [loading, setLoading] = useState(false);
//   const [copied, setCopied] = useState(false);

//   async function generateLink() {
//     setLoading(true);
//     const res = await fetch(`/api/seniors/${seniorId}/quick-token`, {
//       method: "POST",
//     });
//     const data = await res.json();
//     setQuickUrl(data.quickUrl);
//     setLoading(false);
//   }

//   async function copyLink() {
//     await navigator.clipboard.writeText(quickUrl);
//     setCopied(true);
//     setTimeout(() => setCopied(false), 2000);
//   }

//   return (
//     <div className="bg-indigo-50 border border-indigo-100 rounded-xl p-4">
//       <p className="text-sm font-medium text-indigo-700 mb-1">
//         ご本人用クイックリンク
//       </p>
//       <p className="text-xs text-indigo-500 mb-3">
//         このリンクをご本人のスマホにブックマークしてもらうと、ログインなしで体調・お薬を記録できます
//       </p>
//       {!quickUrl ? (
//         <button
//           onClick={generateLink}
//           disabled={loading}
//           className="w-full py-2 bg-indigo-600 text-white text-sm font-medium rounded-lg hover:bg-indigo-700 disabled:opacity-50 transition-colors"
//         >
//           {loading ? "生成中..." : "リンクを生成する"}
//         </button>
//       ) : (
//         <div>
//           <p className="text-xs text-gray-500 bg-white rounded-lg p-2 mb-2 break-all">
//             {quickUrl}
//           </p>
//           <button
//             onClick={copyLink}
//             className="w-full py-2 bg-indigo-600 text-white text-sm font-medium rounded-lg hover:bg-indigo-700 transition-colors"
//           >
//             {copied ? "コピーしました！✓" : "リンクをコピー"}
//           </button>
//         </div>
//       )}
//     </div>
//   );
// }

// new qr code

"use client";

import { useState } from "react";

export function QuickLinkButton({ seniorId }: { seniorId: string }) {
  const [quickUrl, setQuickUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);
  const [showQR, setShowQR] = useState(false);

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

  // QR code → Google Charts API use করবো (free)
  const qrUrl = quickUrl
    ? `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(quickUrl)}`
    : "";

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
          {/* QR Code */}
          {showQR && (
            <div className="bg-white rounded-xl p-4 text-center">
              <p className="text-xs text-gray-400 mb-3">
                このQRコードを印刷してご本人に渡してください
              </p>

              <img src={qrUrl} alt="QR Code" className="mx-auto w-40 h-40" />
              <p className="text-xs text-gray-300 mt-3">
                スマホのカメラで読み取れます
              </p>
              <button
                onClick={() => window.print()}
                className="mt-3 px-4 py-2 bg-indigo-600 text-white text-xs font-medium rounded-lg hover:bg-indigo-700 transition-colors"
              >
                🖨️ 印刷する
              </button>
            </div>
          )}

          {/* URL */}
          <p className="text-xs text-gray-500 bg-white rounded-lg p-2 break-all">
            {quickUrl}
          </p>

          {/* Buttons */}
          <div className="grid grid-cols-2 gap-2">
            <button
              onClick={copyLink}
              className="py-2 bg-indigo-600 text-white text-xs font-medium rounded-lg hover:bg-indigo-700 transition-colors"
            >
              {copied ? "コピー済み ✓" : "リンクをコピー"}
            </button>
            <button
              onClick={() => setShowQR(!showQR)}
              className="py-2 bg-white border border-indigo-200 text-indigo-600 text-xs font-medium rounded-lg hover:bg-indigo-50 transition-colors"
            >
              {showQR ? "QRを隠す" : "QRコードを表示"}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
