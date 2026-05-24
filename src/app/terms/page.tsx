import Link from "next/link";
import { BackButton } from "../components/BackButton";

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white border-b border-gray-100 px-4 py-4">
        <div className="max-w-2xl mx-auto flex items-center gap-3">
          <BackButton></BackButton>
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

      <div className="max-w-2xl mx-auto px-4 py-10">
        <div className="mb-6">
          <h1 className="text-2xl font-semibold text-gray-900">利用規約</h1>
          <p className="text-base text-gray-400 mt-1">
            最終更新日: 2026年5月24日
          </p>
        </div>

        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
          {[
            {
              title: "1. サービスの利用",
              content:
                "Mimamoriは、離れて暮らすご家族の見守りを目的としたサービスです。本サービスは個人利用を前提としています。",
            },
            {
              title: "2. アカウントの管理",
              content:
                "ユーザーは自身のアカウント情報を適切に管理する責任があります。パスワードの管理はユーザー自身の責任となります。不正利用が発覚した場合、アカウントを停止することがあります。",
            },
            {
              title: "3. 禁止事項",
              content:
                "他者への迷惑行為、不正アクセス、虚偽情報の登録、および当サービスの無断での商業利用は禁止します。",
            },
            {
              title: "4. 免責事項",
              content:
                "本サービスは医療サービスではありません。緊急時は必ず119番または医療機関にご連絡ください。サービスの利用により生じた損害について、開発者は責任を負いません。",
            },
            {
              title: "5. サービスの変更・終了",
              content:
                "開発者はサービスの内容を変更、または終了することがあります。重要な変更がある場合は、可能な限り事前にお知らせします。",
            },
          ].map((item, i, arr) => (
            <div
              key={item.title}
              className={`px-6 py-5 ${i !== arr.length - 1 ? "border-b border-gray-50" : ""}`}
            >
              <h2 className="text-base font-semibold text-gray-900 mb-2">
                {item.title}
              </h2>
              <p className="text-base text-gray-500 leading-relaxed">
                {item.content}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
