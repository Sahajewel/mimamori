import Link from "next/link";
import { FeedbackSection } from "./components/FeedbackSection";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { LogoutButton } from "./components/LogoutButton";
import { DashboardButton } from "./components/DashboardButton";
import { LandingNav } from "./components/Landingnav";

export default async function HomePage() {
  const session = await auth();
  // Dynamic testimonials
  const testimonials = await prisma.feedback.findMany({
    where: {
      showOnLanding: true,
      comment: { not: null },
    },
    orderBy: { createdAt: "desc" },
    take: 6,
  });

  const staticTestimonials = [
    {
      text: "母が一人暮らしで心配でしたが、毎日チェックインが届くので安心できるようになりました。",
      author: "東京在住、40代 息子",
      rating: 5,
    },
    {
      text: "お薬の飲み忘れが減りました。QRコードで母も簡単に使えています。",
      author: "大阪在住、50代 娘",
      rating: 5,
    },
    {
      text: "緊急ボタンがあるので、何かあった時にすぐ家族に知らせられます。",
      author: "福岡在住、60代 夫",
      rating: 5,
    },
    {
      text: "ケアノートで病院の記録も共有できます。家族みんなが同じ情報を持てます。",
      author: "名古屋在住、30代 息子",
      rating: 5,
    },
  ];

  const displayTestimonials =
    testimonials.length >= 2
      ? testimonials.map((t) => ({
          text: t.comment!,
          author: t.name ? `${t.name}さん` : "Mimamoriユーザー",
          rating: t.rating,
        }))
      : staticTestimonials;

  return (
    <div className="min-h-screen flex flex-col bg-white overflow-x-hidden">
      {/* Navbar */}
      <LandingNav
        isLoggedIn={!!session?.user?.id}
        userName={session?.user?.name}
        userImage={session?.user?.image}
      />

      {/* 以下全部 same */}
      {/* Hero */}
      <section className="relative flex flex-col items-center text-center px-4 py-20 md:py-32 overflow-hidden">
        <div className="absolute inset-0 bg-linear-to-b from-indigo-50/50 to-white pointer-events-none" />
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-150 h-150 bg-indigo-100/30 rounded-full blur-3xl pointer-events-none" />
        <div className="relative z-10">
          <span className="inline-flex items-center gap-1.5 bg-indigo-50 border border-indigo-100 text-indigo-600 text-sm font-medium px-4 py-2 rounded-full mb-8">
            🇯🇵 日本の高齢者ケアのために作られました
          </span>
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-semibold text-gray-900 leading-tight mb-6">
            離れていても、
            <br />
            <span className="text-indigo-600">いつも一緒に。</span>
          </h1>
          <p className="text-lg md:text-xl text-gray-500 max-w-lg leading-relaxed mb-10">
            離れて暮らすご家族の毎日の様子を、家族みんなで安心して見守るプラットフォーム。ログイン不要で簡単に記録できます。
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center w-full max-w-sm mx-auto">
            {session?.user?.id ? (
              <Link
                href="/dashboard"
                className="flex-1 px-8 py-4 bg-indigo-600 text-white text-base font-semibold rounded-xl hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-200 text-center"
              >
                ダッシュボード
              </Link>
            ) : (
              <>
                <Link
                  href="/register"
                  className="flex-1 px-8 py-4 bg-indigo-600 text-white text-base font-semibold rounded-xl hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-200 text-center"
                >
                  無料で始める →
                </Link>
                <Link
                  href="/login"
                  className="flex-1 px-8 py-4 border border-gray-200 text-gray-700 text-base font-medium rounded-xl hover:bg-gray-50 transition-colors text-center"
                >
                  ログイン
                </Link>
              </>
            )}
          </div>
          <p className="text-sm text-gray-400 mt-4">今すぐ無料で始められます</p>
        </div>
      </section>

      {/* Stats */}
      <section className="bg-indigo-600 px-4 py-12">
        <div className="max-w-3xl mx-auto grid grid-cols-3 gap-4 text-center">
          {[
            { value: "無料", label: "今すぐ試せる" },
            { value: "24時間", label: "いつでも見守れる" },
            { value: "即時", label: "緊急通知が届く" },
          ].map((s) => (
            <div key={s.label}>
              <p className="text-3xl md:text-4xl font-bold text-white">
                {s.value}
              </p>
              <p className="text-sm md:text-base text-indigo-200 mt-2">
                {s.label}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* Features */}
      <section className="px-4 py-20 max-w-5xl mx-auto w-full">
        <div className="text-center mb-14">
          <p className="text-sm font-semibold text-indigo-500 tracking-widest uppercase mb-3">
            Features
          </p>
          <h2 className="text-3xl md:text-4xl font-semibold text-gray-900 mb-4">
            Mimamoriでできること
          </h2>
          <p className="text-base text-gray-400 max-w-md mx-auto">
            高齢者の見守りに必要な機能をすべて一つのアプリに
          </p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-5">
          {[
            {
              icon: "✓",
              bg: "bg-indigo-50",
              color: "text-indigo-600",
              border: "border-indigo-100",
              title: "毎日のチェックイン",
              desc: "今日の様子を家族みんなで確認。見逃しがあれば自動でお知らせします。",
            },
            {
              icon: "💊",
              bg: "bg-green-50",
              color: "text-green-600",
              border: "border-green-100",
              title: "お薬の管理",
              desc: "飲み忘れを防ぐリマインダーと、時間帯別の服薬記録で安心。",
            },
            {
              icon: "🚨",
              bg: "bg-red-50",
              color: "text-red-500",
              border: "border-red-100",
              title: "緊急アラート",
              desc: "緊急時は家族全員のスマホに即時プッシュ通知でお知らせします。",
            },
            {
              icon: "💬",
              bg: "bg-blue-50",
              color: "text-blue-600",
              border: "border-blue-100",
              title: "家族チャット",
              desc: "ご本人について家族みんなで情報共有。写真も送れます。",
            },
            {
              icon: "📝",
              bg: "bg-amber-50",
              color: "text-amber-600",
              border: "border-amber-100",
              title: "ケアノート",
              desc: "気になることをメモして家族で共有。大切な情報を記録。",
            },
            {
              icon: "📊",
              bg: "bg-purple-50",
              color: "text-purple-600",
              border: "border-purple-100",
              title: "週間レポート",
              desc: "毎週月曜日にチェックイン・服薬状況をメールでお届け。",
            },
          ].map((f) => (
            <div
              key={f.title}
              className={`bg-white border ${f.border} rounded-2xl p-6 hover:shadow-md transition-shadow`}
            >
              <div
                className={`w-12 h-12 ${f.bg} rounded-xl flex items-center justify-center mb-4 ${f.color} text-2xl`}
              >
                {f.icon}
              </div>
              <p className="text-lg font-semibold text-gray-900 mb-2">
                {f.title}
              </p>
              <p className="text-sm text-gray-400 leading-relaxed">{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* QR Feature */}
      <section className="bg-linear-to-r from-indigo-50 to-blue-50 px-4 py-16">
        <div className="max-w-3xl mx-auto text-center">
          <span className="inline-flex items-center bg-white border border-indigo-100 text-indigo-600 text-sm font-medium px-4 py-2 rounded-full mb-6 shadow-sm">
            ✨ ログイン不要
          </span>
          <h2 className="text-3xl md:text-4xl font-semibold text-gray-900 mb-4">
            QRコードで
            <br />
            かんたん記録
          </h2>
          <p className="text-base text-gray-500 max-w-md mx-auto mb-10 leading-relaxed">
            QRコードを印刷してご本人に渡すだけ。スマホのカメラで読み取り、ボタンを押すだけで体調とお薬を記録できます。アカウント登録も不要です。
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            {["📱 カメラで読み取る", "👆 ボタンを押す", "✓ 家族に届く"].map(
              (s, i) => (
                <div key={s} className="flex items-center gap-3">
                  <div className="bg-white rounded-xl px-5 py-3 shadow-sm border border-white text-base font-medium text-gray-700">
                    {s}
                  </div>
                  {i < 2 && (
                    <span className="text-gray-300 hidden sm:block text-xl">
                      →
                    </span>
                  )}
                </div>
              ),
            )}
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="px-4 py-20">
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-14">
            <p className="text-sm font-semibold text-indigo-500 tracking-widest uppercase mb-3">
              How it works
            </p>
            <h2 className="text-3xl md:text-4xl font-semibold text-gray-900">
              かんたん3ステップ
            </h2>
          </div>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            {[
              {
                num: "1",
                title: "無料登録",
                desc: "メールアドレスだけで\n簡単に登録できます",
                color: "bg-indigo-600",
              },
              {
                num: "2",
                title: "家族を招待",
                desc: "メールで家族を\n簡単に招待",
                color: "bg-indigo-500",
              },
              {
                num: "3",
                title: "見守り開始",
                desc: "みんなで安心して\n見守りましょう",
                color: "bg-indigo-400",
              },
            ].map((s, i) => (
              <div
                key={s.num}
                className="flex items-center gap-4 w-full sm:w-auto"
              >
                <div className="flex-1 sm:w-48 bg-white border border-gray-100 rounded-2xl p-6 text-center shadow-sm hover:shadow-md transition-shadow">
                  <div
                    className={`w-14 h-14 ${s.color} text-white rounded-full flex items-center justify-center text-xl font-bold mx-auto mb-4 shadow-md`}
                  >
                    {s.num}
                  </div>
                  <p className="text-lg font-semibold text-gray-900 mb-2">
                    {s.title}
                  </p>
                  <p className="text-sm text-gray-400 leading-relaxed whitespace-pre-line">
                    {s.desc}
                  </p>
                </div>
                {i < 2 && (
                  <span className="text-2xl text-gray-200 hidden sm:block shrink-0">
                    →
                  </span>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="bg-gray-50 px-4 py-20">
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-12">
            <p className="text-sm font-semibold text-indigo-500 tracking-widest uppercase mb-3">
              Testimonials
            </p>
            <h2 className="text-3xl md:text-4xl font-semibold text-gray-900">
              ご家族の声
            </h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            {displayTestimonials.map((t, index) => (
              <div
                key={index}
                className="bg-white border border-gray-100 rounded-2xl p-6 shadow-sm"
              >
                <p className="text-base text-yellow-400 mb-3">
                  {"⭐".repeat(t.rating)}
                </p>
                <p className="text-base text-gray-700 leading-relaxed mb-4">
                  {t.text}
                </p>
                <p className="text-sm text-gray-400 font-medium">
                  — {t.author}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Feedback */}
      <FeedbackSection />

      {/* CTA */}
      <section className="relative text-center px-4 py-20 bg-indigo-600 overflow-hidden">
        <div className="absolute inset-0 bg-linear-to-br from-indigo-600 to-indigo-800 pointer-events-none" />
        <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500/30 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-indigo-700/30 rounded-full blur-3xl pointer-events-none" />
        <div className="relative z-10">
          <p className="text-3xl md:text-4xl font-semibold text-white mb-4">
            今日から始めてみませんか？
          </p>
          <p className="text-base text-indigo-200 mb-10 max-w-md mx-auto">
            アカウント登録は簡単。大切なご家族を、みんなで見守りましょう。
          </p>
          <Link
            href="/register"
            className="inline-block px-10 py-4 bg-white text-indigo-600 text-base font-semibold rounded-xl hover:bg-indigo-50 transition-colors shadow-xl"
          >
            無料で始める →
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-gray-100 px-4 py-8 bg-white">
        <div className="max-w-5xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-indigo-600 flex items-center justify-center">
              <span className="text-white text-xs">♡</span>
            </div>
            <p className="text-base font-semibold text-gray-900">Mimamori</p>
          </div>
          <p className="text-sm text-gray-400">Developed by Saha Jewel Kumar</p>
          <div className="flex flex-wrap gap-4 justify-center">
            <Link
              href="/privacy"
              className="text-sm text-gray-400 hover:underline transition-colors"
            >
              プライバシーポリシー
            </Link>
            <Link
              href="/terms"
              className="text-sm text-gray-400 hover:underline transition-colors"
            >
              利用規約
            </Link>
            <Link
              href="/about"
              className="text-sm text-gray-400 hover:underline transition-colors"
            >
              Mimamoriについて
            </Link>
            <Link
              href="/contact"
              className="text-sm text-gray-400 hover:underline transition-colors"
            >
              お問い合わせ
            </Link>
            <p className="text-sm text-gray-400">© 2026 Mimamori</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
