import Link from "next/link";
import { BackButton } from "../components/BackButton";

export default function PrivacyPage() {
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
          <h1 className="text-2xl font-semibold text-gray-900">
            プライバシーポリシー
          </h1>
          <p className="text-base text-gray-400 mt-1">
            最終更新日: 2026年5月24日
          </p>
        </div>

        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
          {[
            {
              title: "1. 収集する情報",
              content:
                "当サービスは、アカウント登録時にメールアドレスとお名前を収集します。また、プロフィール画像、チェックイン記録、お薬情報、ケアノートなどの情報を保存します。",
            },
            {
              title: "2. 情報の利用目的",
              content:
                "収集した情報は、サービスの提供・改善、プッシュ通知およびメールでのご家族への通知送信のみに使用します。第三者への提供は行いません。",
            },
            {
              title: "3. 情報の管理",
              content:
                "お客様の情報は、適切なセキュリティ対策を講じたサーバーで管理します。不正アクセスや漏洩の防止に努めます。",
            },
            {
              title: "4. Cookieの使用",
              content:
                "当サービスは、ログイン状態の維持のためにCookieを使用します。",
            },
            {
              title: "5. お問い合わせ",
              content:
                "プライバシーに関するお問い合わせは、お問い合わせページよりご連絡ください。",
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
