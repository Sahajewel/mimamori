import Link from "next/link";
import { FeedbackSection } from "./components/FeedbackSection";

export default function HomePage() {
  return (
    <div className="min-h-screen flex flex-col bg-white">
      {/* Navbar */}
      <nav className="flex items-center justify-between px-4 md:px-8 py-4 border-b border-gray-100">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-indigo-100 flex items-center justify-center">
            <span className="text-indigo-600 text-sm">♡</span>
          </div>
          <div>
            <p className="font-medium text-gray-900 text-sm leading-none">
              Mimamori
            </p>
            <p className="text-xs text-gray-400 mt-0.5 hidden sm:block">
              見守り — 家族をつなぐ
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Link
            href="/login"
            className="px-4 py-2 text-sm font-medium text-gray-600 hover:text-gray-900 transition-colors"
          >
            ログイン
          </Link>
          <Link
            href="/register"
            className="px-4 py-2 text-sm font-medium bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
          >
            新規登録
          </Link>
        </div>
      </nav>

      {/* Hero */}
      <section className="flex flex-col items-center text-center px-4 py-16 md:py-24">
        <span className="inline-flex items-center bg-indigo-50 text-indigo-600 text-xs font-medium px-4 py-1.5 rounded-full mb-6">
          🇯🇵 日本の高齢者ケアのために
        </span>
        <h1 className="text-3xl sm:text-4xl md:text-5xl font-medium text-gray-900 leading-tight mb-4">
          離れていても、
          <br />
          いつも一緒に。
        </h1>
        <p className="text-base md:text-lg text-gray-500 max-w-md leading-relaxed mb-8">
          離れて暮らすご家族の日々の様子を、
          <br />
          みんなで安心して見守るプラットフォーム。
        </p>
        <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
          <Link
            href="/register"
            className="px-8 py-3.5 bg-indigo-600 text-white text-sm font-medium rounded-lg hover:bg-indigo-700 transition-colors text-center"
          >
            無料で始める →
          </Link>
          <Link
            href="/login"
            className="px-8 py-3.5 border border-gray-200 text-gray-600 text-sm font-medium rounded-lg hover:bg-gray-50 transition-colors text-center"
          >
            ログイン
          </Link>
        </div>
      </section>

      {/* Stats */}
      <section className="bg-indigo-600 px-4 py-10">
        <div className="max-w-3xl mx-auto grid grid-cols-3 gap-6 text-center">
          <div>
            <p className="text-2xl md:text-3xl font-medium text-white">無料</p>
            <p className="text-xs text-indigo-200 mt-1">ずっと無料で使える</p>
          </div>
          <div>
            <p className="text-2xl md:text-3xl font-medium text-white">
              24時間
            </p>
            <p className="text-xs text-indigo-200 mt-1">いつでも見守れる</p>
          </div>
          <div>
            <p className="text-2xl md:text-3xl font-medium text-white">即時</p>
            <p className="text-xs text-indigo-200 mt-1">緊急通知が届く</p>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="px-4 py-14 max-w-4xl mx-auto w-full">
        <p className="text-center text-xl font-medium text-gray-900 mb-10">
          Mimamoriでできること
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
          {[
            {
              icon: "✓",
              bg: "bg-indigo-50",
              color: "text-indigo-600",
              title: "毎日のチェックイン",
              desc: "今日の様子を家族みんなで確認。見逃しがあれば自動でお知らせ。",
            },
            {
              icon: "💊",
              bg: "bg-green-50",
              color: "text-green-600",
              title: "お薬の管理",
              desc: "飲み忘れを防ぐリマインダーと、時間帯別の服薬記録。",
            },
            {
              icon: "📝",
              bg: "bg-amber-50",
              color: "text-amber-600",
              title: "ケアノート",
              desc: "気になることをメモして家族で共有。大切な情報を記録。",
            },
            {
              icon: "🚨",
              bg: "bg-red-50",
              color: "text-red-500",
              title: "緊急アラート",
              desc: "緊急時は家族全員のスマホに即時通知。音とともに届く。",
            },
          ].map((f) => (
            <div
              key={f.title}
              className="bg-white border border-gray-100 rounded-xl p-5"
            >
              <div
                className={`w-10 h-10 ${f.bg} rounded-lg flex items-center justify-center mb-3 ${f.color} text-lg`}
              >
                {f.icon}
              </div>
              <p className="text-sm font-medium text-gray-900 mb-1">
                {f.title}
              </p>
              <p className="text-xs text-gray-400 leading-relaxed">{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* How it works */}
      <section className="bg-gray-50 px-4 py-14">
        <p className="text-center text-xl font-medium text-gray-900 mb-10">
          かんたん3ステップ
        </p>
        <div className="flex flex-col sm:flex-row items-center justify-center gap-6 max-w-2xl mx-auto">
          {[
            { num: "1", title: "登録する", desc: "無料でアカウントを作成" },
            { num: "2", title: "家族を招待", desc: "メールで簡単に招待" },
            { num: "3", title: "見守り開始", desc: "みんなで安心して見守る" },
          ].map((s, i) => (
            <div key={s.num} className="flex items-center gap-6">
              <div className="text-center">
                <div className="w-10 h-10 bg-indigo-600 text-white rounded-full flex items-center justify-center text-sm font-medium mx-auto mb-3">
                  {s.num}
                </div>
                <p className="text-sm font-medium text-gray-900 mb-1">
                  {s.title}
                </p>
                <p className="text-xs text-gray-400">{s.desc}</p>
              </div>
              {i < 2 && (
                <p className="text-gray-300 text-2xl hidden sm:block">→</p>
              )}
            </div>
          ))}
        </div>
      </section>

      {/* Testimonial */}
      <section className="px-4 py-14 max-w-2xl mx-auto w-full text-center">
        <p className="text-xl font-medium text-gray-900 mb-8">ご家族の声</p>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="bg-indigo-50 rounded-2xl p-5 text-left">
            <p className="text-sm text-gray-700 leading-relaxed mb-3">
              母が一人暮らしで心配でしたが、毎日チェックインが届くので安心できるようになりました。&rdquo;
            </p>
            <p className="text-xs text-gray-400">— 東京在住、40代 息子</p>
          </div>
          <div className="bg-green-50 rounded-2xl p-5 text-left">
            <p className="text-sm text-gray-700 leading-relaxed mb-3">
              お薬の飲み忘れが減りました。家族みんなで確認できるのが良いです。&quot;
            </p>
            <p className="text-xs text-gray-400">— 大阪在住、50代 娘</p>
          </div>
        </div>
      </section>
      <FeedbackSection></FeedbackSection>
      {/* CTA */}
      <section className="text-center px-4 py-14 bg-indigo-600">
        <p className="text-2xl font-medium text-white mb-2">
          今日から始めてみませんか？
        </p>
        <p className="text-sm text-indigo-200 mb-8">
          登録は無料。いつでもキャンセルできます。
        </p>
        <Link
          href="/register"
          className="px-8 py-3.5 bg-white text-indigo-600 text-sm font-medium rounded-lg hover:bg-indigo-50 transition-colors"
        >
          無料で始める →
        </Link>
      </section>

      {/* Footer */}
      <footer className="border-t border-gray-100 px-4 py-6">
        <div className="max-w-4xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-indigo-100 flex items-center justify-center">
              <span className="text-indigo-600 text-xs">♡</span>
            </div>
            <p className="text-sm font-medium text-gray-900">Mimamori</p>
          </div>
          <p className="text-xs text-gray-400">Developed by Saha Jewel Kumar</p>
          <div className="flex gap-6">
            <Link
              href="/privacy"
              className="text-xs text-gray-400 hover:text-gray-600"
            >
              プライバシーポリシー
            </Link>
            <Link
              href="/terms"
              className="text-xs text-gray-400 hover:text-gray-600"
            >
              利用規約
            </Link>
            <p className="text-xs text-gray-400">© 2026 Mimamori</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
