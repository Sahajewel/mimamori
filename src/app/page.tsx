import Link from "next/link";

export default function HomePage() {
  return (
    <div className="min-h-screen flex flex-col bg-white">
      {/* Navbar */}
      <nav className="flex items-center justify-between px-4 md:px-8 py-4 md:py-5 border-b border-gray-100">
        <div className="flex items-center gap-2 md:gap-3">
          <div className="w-8 h-8 md:w-9 md:h-9 rounded-lg bg-indigo-100 flex items-center justify-center">
            <span className="text-indigo-600 text-sm md:text-base">♡</span>
          </div>
          <div>
            <p className="font-medium text-gray-900 text-sm md:text-base leading-none">
              Mimamori
            </p>
            <p className="text-xs text-gray-400 mt-0.5 hidden sm:block">
              見守り — 家族をつなぐ
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2 md:gap-3">
          <Link
            href="/login"
            className="px-3 md:px-5 py-2 md:py-2.5 text-sm font-medium text-gray-600 hover:text-gray-900 transition-colors"
          >
            ログイン
          </Link>
          <Link
            href="/register"
            className="px-3 md:px-5 py-2 md:py-2.5 text-sm font-medium bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
          >
            新規登録
          </Link>
        </div>
      </nav>

      {/* Hero */}
      <section className="flex flex-col items-center text-center px-4 md:px-8 py-12 md:py-20">
        <span className="inline-flex items-center bg-indigo-50 text-indigo-600 text-xs md:text-sm font-medium px-3 md:px-4 py-1.5 rounded-full mb-6 md:mb-8">
          家族の安心をひとつに
        </span>
        <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-medium text-gray-900 leading-tight mb-4 md:mb-6">
          離れていても、
          <br />
          いつも一緒に。
        </h1>
        <p className="text-base sm:text-lg md:text-xl text-gray-500 max-w-lg leading-relaxed mb-8 md:mb-10">
          離れて暮らすご家族の日々の様子を、
          <br />
          みんなで安心して見守るためのプラットフォームです。
        </p>
        <div className="flex flex-col sm:flex-row gap-3 md:gap-4 w-full sm:w-auto">
          <Link
            href="/register"
            className="px-6 md:px-8 py-3 md:py-3.5 bg-indigo-600 text-white text-sm md:text-base font-medium rounded-lg hover:bg-indigo-700 transition-colors text-center"
          >
            無料で始める →
          </Link>
          <Link
            href="/login"
            className="px-6 md:px-8 py-3 md:py-3.5 border border-gray-200 text-gray-600 text-sm md:text-base font-medium rounded-lg hover:bg-gray-50 transition-colors text-center"
          >
            ログイン
          </Link>
        </div>
      </section>

      {/* Features */}
      <section className="px-4 md:px-8 pb-12 md:pb-16">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 md:gap-5 max-w-4xl mx-auto">
          <div className="bg-white border border-gray-100 rounded-xl p-5 md:p-6">
            <div className="w-10 h-10 md:w-11 md:h-11 bg-indigo-50 rounded-lg flex items-center justify-center mb-3 md:mb-4 text-indigo-600 text-lg md:text-xl">
              ✓
            </div>
            <p className="text-sm md:text-base font-medium text-gray-900 mb-1 md:mb-2">
              毎日のチェックイン
            </p>
            <p className="text-xs md:text-sm text-gray-400 leading-relaxed">
              今日の様子を家族みんなで確認。見逃しがあれば自動でお知らせ。
            </p>
          </div>
          <div className="bg-white border border-gray-100 rounded-xl p-5 md:p-6">
            <div className="w-10 h-10 md:w-11 md:h-11 bg-green-50 rounded-lg flex items-center justify-center mb-3 md:mb-4 text-green-600 text-lg md:text-xl">
              💊
            </div>
            <p className="text-sm md:text-base font-medium text-gray-900 mb-1 md:mb-2">
              お薬の管理
            </p>
            <p className="text-xs md:text-sm text-gray-400 leading-relaxed">
              飲み忘れを防ぐリマインダーと、服薬履歴の記録。
            </p>
          </div>
          <div className="bg-white border border-gray-100 rounded-xl p-5 md:p-6">
            <div className="w-10 h-10 md:w-11 md:h-11 bg-amber-50 rounded-lg flex items-center justify-center mb-3 md:mb-4 text-amber-600 text-lg md:text-xl">
              📝
            </div>
            <p className="text-sm md:text-base font-medium text-gray-900 mb-1 md:mb-2">
              ケアノート
            </p>
            <p className="text-xs md:text-sm text-gray-400 leading-relaxed">
              気になることをメモして家族で共有。大切な情報を残す。
            </p>
          </div>
          <div className="bg-white border border-gray-100 rounded-xl p-5 md:p-6">
            <div className="w-10 h-10 md:w-11 md:h-11 bg-red-50 rounded-lg flex items-center justify-center mb-3 md:mb-4 text-red-500 text-lg md:text-xl">
              🔔
            </div>
            <p className="text-sm md:text-base font-medium text-gray-900 mb-1 md:mb-2">
              緊急アラート
            </p>
            <p className="text-xs md:text-sm text-gray-400 leading-relaxed">
              チェックインが途切れたら、家族全員に自動で通知。
            </p>
          </div>
        </div>
      </section>

      {/* Steps */}
      <section className="bg-gray-50 px-4 md:px-8 py-12 md:py-14">
        <p className="text-center text-lg md:text-xl font-medium text-gray-900 mb-8 md:mb-10">
          かんたん3ステップ
        </p>
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 md:gap-6 max-w-2xl mx-auto">
          <div className="text-center flex-1">
            <div className="w-9 h-9 bg-indigo-100 text-indigo-600 rounded-full flex items-center justify-center text-sm md:text-base font-medium mx-auto mb-3">
              1
            </div>
            <p className="text-sm md:text-base font-medium text-gray-900 mb-1">
              登録する
            </p>
            <p className="text-xs md:text-sm text-gray-400">
              無料でアカウントを作成
            </p>
          </div>
          <p className="text-gray-300 text-2xl hidden sm:block">→</p>
          <div className="text-center flex-1">
            <div className="w-9 h-9 bg-indigo-100 text-indigo-600 rounded-full flex items-center justify-center text-sm md:text-base font-medium mx-auto mb-3">
              2
            </div>
            <p className="text-sm md:text-base font-medium text-gray-900 mb-1">
              家族を招待
            </p>
            <p className="text-xs md:text-sm text-gray-400">
              メールで簡単に招待
            </p>
          </div>
          <p className="text-gray-300 text-2xl hidden sm:block">→</p>
          <div className="text-center flex-1">
            <div className="w-9 h-9 bg-indigo-100 text-indigo-600 rounded-full flex items-center justify-center text-sm md:text-base font-medium mx-auto mb-3">
              3
            </div>
            <p className="text-sm md:text-base font-medium text-gray-900 mb-1">
              見守り開始
            </p>
            <p className="text-xs md:text-sm text-gray-400">
              みんなで安心して見守る
            </p>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="text-center px-4 md:px-8 py-12 md:py-16">
        <p className="text-xl md:text-2xl font-medium text-gray-900 mb-2 md:mb-3">
          今日から始めてみませんか？
        </p>
        <p className="text-sm md:text-base text-gray-400 mb-6 md:mb-8">
          登録は無料。いつでもキャンセルできます。
        </p>
        <Link
          href="/register"
          className="px-6 md:px-8 py-3 md:py-3.5 bg-indigo-600 text-white text-sm md:text-base font-medium rounded-lg hover:bg-indigo-700 transition-colors"
        >
          無料で始める →
        </Link>
      </section>

      {/* Footer */}
      <footer className="mt-auto border-t border-gray-100 px-4 md:px-8 py-4 md:py-5 flex flex-col sm:flex-row items-center justify-between gap-2">
        <p className="text-xs md:text-sm text-gray-400">
          © 2026 Mimamori. All rights reserved.
        </p>
        <div className="flex gap-4 md:gap-6">
          <p className="text-xs md:text-sm text-gray-400 cursor-pointer hover:text-gray-600">
            プライバシーポリシー
          </p>
          <p className="text-xs md:text-sm text-gray-400 cursor-pointer hover:text-gray-600">
            利用規約
          </p>
        </div>
      </footer>
    </div>
  );
}
