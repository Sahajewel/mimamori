import Image from "next/image";
import Link from "next/link";

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white border-b border-gray-100 px-4 py-4">
        <div className="max-w-2xl mx-auto flex items-center gap-3">
          <Link
            href="/"
            className="flex items-center gap-1.5 text-indigo-600 hover:underline transition-colors text-sm font-medium"
          >
            <span className="text-lg">←</span>
            <span>戻る</span>
          </Link>
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

      <div className="max-w-2xl mx-auto px-4 py-10 space-y-5">
        {/* About Mimamori */}
        <div className="bg-indigo-600 rounded-2xl p-8 text-white">
          <div className="w-14 h-14 bg-white/20 rounded-2xl flex items-center justify-center text-3xl mb-5">
            ♡
          </div>
          <h1 className="text-2xl font-bold mb-3">Mimamoriについて</h1>
          <p className="text-base text-indigo-100 leading-relaxed">
            Mimamoriは、離れて暮らすご家族の毎日を、家族みんなで安心して見守るためのプラットフォームです。毎日のチェックイン、お薬管理、緊急アラート、家族チャットなど、高齢者ケアに必要な機能をすべて一つのアプリに集めました。
          </p>
        </div>

        {/* Mission */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-3">
            🎯 ミッション
          </h2>
          <p className="text-base text-gray-500 leading-relaxed">
            テクノロジーの力で、離れた家族をつなぐ。高齢者が安心して暮らせる社会を作るために、シンプルで使いやすいツールを提供することが私たちの使命です。
          </p>
        </div>

        {/* Features summary */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-50">
            <h2 className="text-xl font-semibold text-gray-900">✨ 主な機能</h2>
          </div>
          {[
            { icon: "✓", label: "毎日のチェックイン" },
            { icon: "💊", label: "お薬管理・リマインダー" },
            { icon: "🚨", label: "緊急アラート通知" },
            { icon: "💬", label: "家族チャット" },
            { icon: "📝", label: "ケアノート" },
            { icon: "📊", label: "週間レポート" },
          ].map((f, i, arr) => (
            <div
              key={f.label}
              className={`flex items-center gap-4 px-6 py-4 ${i !== arr.length - 1 ? "border-b border-gray-50" : ""}`}
            >
              <span className="text-xl w-8 text-center">{f.icon}</span>
              <p className="text-base font-medium text-gray-700">{f.label}</p>
            </div>
          ))}
        </div>

        {/* Developer */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-5">
            👨‍💻 開発者
          </h2>
          <div className="flex items-center gap-5 mb-5">
            <div className="relative w-20 h-20 rounded-full bg-indigo-100 overflow-hidden flex-shrink-0">
              <Image
                src="https://res.cloudinary.com/dqsgq6z74/image/upload/v1779533948/profile_lwdnjm.png"
                alt="Saha Jewel Kumar"
                width={80}
                height={80}
                className="object-cover w-full h-full"
              />
            </div>
            <div>
              <p className="text-xl font-bold text-gray-900">
                Saha Jewel Kumar
              </p>
              <p className="text-base text-indigo-600 font-medium mt-0.5">
                Full Stack Developer
              </p>
              <p className="text-sm text-gray-400 mt-1 leading-relaxed">
                MERN Stack · Next.js · TypeScript · Prisma · PostgreSQL
              </p>
            </div>
          </div>
          <p className="text-base text-gray-500 leading-relaxed">
            スケーラブルで高性能なWebアプリケーションの構築に情熱を注ぐフルスタック開発者。Mimamoriは、大切な家族をつなぐために心を込めて開発しました。
          </p>
        </div>

        <p className="text-center text-sm text-gray-300">
          © 2026 Mimamori — ご家族をつなぐ
        </p>
      </div>
    </div>
  );
}
