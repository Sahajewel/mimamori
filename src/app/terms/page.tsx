import Link from "next/link";

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white border-b border-gray-100 px-4 py-4 flex items-center gap-3">
        <Link href="/" className="text-sm text-gray-400 hover:text-gray-600">
          ← 戻る
        </Link>
        <p className="font-medium text-gray-900">Mimamori</p>
      </nav>
      <div className="max-w-2xl mx-auto px-4 py-12">
        <h1 className="text-2xl font-medium text-gray-900 mb-8">利用規約</h1>
        <div className="bg-white rounded-2xl p-8 space-y-6 text-sm text-gray-600 leading-relaxed">
          <div>
            <h2 className="font-medium text-gray-900 mb-2">
              1. サービスの利用
            </h2>
            <p>
              Mimamoriは、離れて暮らすご家族の見守りを目的としたサービスです。本サービスは個人利用を前提としています。
            </p>
          </div>
          <div>
            <h2 className="font-medium text-gray-900 mb-2">
              2. アカウントの管理
            </h2>
            <p>
              ユーザーは自身のアカウント情報を適切に管理する責任があります。不正利用が発覚した場合、アカウントを停止することがあります。
            </p>
          </div>
          <div>
            <h2 className="font-medium text-gray-900 mb-2">3. 禁止事項</h2>
            <p>
              他者への迷惑行為、不正アクセス、虚偽情報の登録、および本サービスの商業利用は禁止します。
            </p>
          </div>
          <div>
            <h2 className="font-medium text-gray-900 mb-2">4. 免責事項</h2>
            <p>
              本サービスは医療サービスではありません。緊急時は必ず119番または医療機関にご連絡ください。サービスの利用により生じた損害について、開発者は責任を負いません。
            </p>
          </div>
          <div>
            <h2 className="font-medium text-gray-900 mb-2">
              5. サービスの変更・終了
            </h2>
            <p>
              開発者は予告なくサービスの内容を変更、または終了することがあります。
            </p>
          </div>
          <p className="text-xs text-gray-400">最終更新日: 2026年5月17日</p>
        </div>
      </div>
    </div>
  );
}
