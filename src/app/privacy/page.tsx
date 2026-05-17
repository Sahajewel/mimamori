import Link from "next/link";

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white border-b border-gray-100 px-4 py-4 flex items-center gap-3">
        <Link href="/" className="text-sm text-gray-400 hover:text-gray-600">
          ← 戻る
        </Link>
        <p className="font-medium text-gray-900">Mimamori</p>
      </nav>
      <div className="max-w-2xl mx-auto px-4 py-12">
        <h1 className="text-2xl font-medium text-gray-900 mb-8">
          プライバシーポリシー
        </h1>
        <div className="bg-white rounded-2xl p-8 space-y-6 text-sm text-gray-600 leading-relaxed">
          <div>
            <h2 className="font-medium text-gray-900 mb-2">1. 収集する情報</h2>
            <p>
              当サービスは、アカウント登録時にメールアドレスとお名前を収集します。また、サービス利用に伴い、チェックイン記録、お薬情報、ケアノートなどの情報を保存します。
            </p>
          </div>
          <div>
            <h2 className="font-medium text-gray-900 mb-2">
              2. 情報の利用目的
            </h2>
            <p>
              収集した情報は、サービスの提供・改善、およびご家族への通知送信のみに使用します。第三者への提供は行いません。
            </p>
          </div>
          <div>
            <h2 className="font-medium text-gray-900 mb-2">3. 情報の管理</h2>
            <p>
              お客様の情報は、適切なセキュリティ対策を講じたサーバーで管理します。不正アクセスや漏洩の防止に努めます。
            </p>
          </div>
          <div>
            <h2 className="font-medium text-gray-900 mb-2">4. Cookieの使用</h2>
            <p>当サービスは、ログイン状態の維持のためにCookieを使用します。</p>
          </div>
          <div>
            <h2 className="font-medium text-gray-900 mb-2">5. お問い合わせ</h2>
            <p>
              プライバシーに関するお問い合わせは、開発者までご連絡ください。
            </p>
          </div>
          <p className="text-xs text-gray-400">最終更新日: 2026年5月17日</p>
        </div>
      </div>
    </div>
  );
}
