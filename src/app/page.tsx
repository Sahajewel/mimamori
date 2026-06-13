// app/page.tsx
import Link from "next/link";
import { FeedbackSection } from "./components/FeedbackSection";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import {
  CheckCircle,
  Heart,
  Clock,
  Bell,
  QrCode,
  Users,
  MessageSquare,
  FileText,
  BarChart3,
  Pill,
  AlertTriangle,
  Smartphone,
} from "lucide-react";

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
      {/* Hero Section with animated gradient */}
      <section className="relative flex flex-col items-center text-center px-4 py-16  overflow-hidden">
        {/* Animated gradient background */}
        <div className="absolute inset-0 bg-gradient-to-br from-indigo-50 via-white to-blue-50 animate-gradient-xy" />
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[150%] h-[150%] bg-indigo-100/20 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-blue-100/30 rounded-full blur-3xl animate-float" />
        <div className="relative z-10">
          <span className="inline-flex items-center gap-2 bg-white/80 backdrop-blur-sm border border-indigo-100 text-indigo-600 text-sm font-medium px-5 py-2 rounded-full mb-8 shadow-sm">
            <Heart className="w-4 h-4 fill-indigo-200" />
            🇯🇵 日本の高齢者ケアのために作られました
          </span>
          <h1 className="text-5xl sm:text-4xl md:text-7xl font-bold text-gray-900 leading-tight mb-6">
            離れていても、
            <br />
            <span className="bg-gradient-to-r from-indigo-600 to-blue-600 bg-clip-text text-transparent">
              いつも一緒に。
            </span>
          </h1>
          <p className="text-lg md:text-xl text-gray-500 max-w-lg leading-relaxed mb-10">
            離れて暮らすご家族の毎日の様子を、家族みんなで安心して見守るプラットフォーム。ログイン不要で簡単に記録できます。
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center w-full max-w-sm mx-auto">
            {!session?.user?.id && (
              <div className="group">
                <Link
                  href="/register"
                  className="inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-indigo-600 to-indigo-500 text-white text-base font-semibold rounded-xl hover:from-indigo-700 hover:to-indigo-600 transition-all duration-300 shadow-lg hover:shadow-xl hover:scale-105"
                >
                  無料で始める
                  <span className="group-hover:translate-x-1 transition-transform">
                    →
                  </span>
                </Link>
                <p className="text-sm text-gray-400 mt-4">
                  今すぐ無料で始められます
                </p>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Stats Section with glassmorphism */}
      <section className="relative bg-gradient-to-r from-indigo-600 via-indigo-500 to-blue-600 px-4 py-16 overflow-hidden">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.05'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E')] opacity-20" />
        <div className="relative max-w-3xl mx-auto grid grid-cols-3 gap-8 text-center">
          {[
            { value: "無料", label: "今すぐ試せる", icon: CheckCircle },
            { value: "24時間", label: "いつでも見守れる", icon: Clock },
            { value: "即時", label: "緊急通知が届く", icon: Bell },
          ].map((s) => (
            <div key={s.label} className="group">
              <div className="flex justify-center mb-3">
                <s.icon className="w-8 h-8 text-white/80 group-hover:text-white transition-colors" />
              </div>
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

      {/* Features Section with modern cards */}
      <section className="px-4 py-24 max-w-6xl mx-auto w-full">
        <div className="text-center mb-16">
          <p className="text-sm font-semibold text-indigo-500 tracking-wider uppercase mb-3">
            Features
          </p>
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Mimamoriでできること
          </h2>
          <p className="text-lg text-gray-400 max-w-md mx-auto">
            高齢者の見守りに必要な機能をすべて一つのアプリに
          </p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {[
            {
              icon: CheckCircle,
              gradient: "from-emerald-500 to-teal-500",
              title: "毎日のチェックイン",
              desc: "今日の様子を家族みんなで確認。見逃しがあれば自動でお知らせします。",
            },
            {
              icon: Pill,
              gradient: "from-blue-500 to-cyan-500",
              title: "お薬の管理",
              desc: "飲み忘れを防ぐリマインダーと、時間帯別の服薬記録で安心。",
            },
            {
              icon: AlertTriangle,
              gradient: "from-red-500 to-rose-500",
              title: "緊急アラート",
              desc: "緊急時は家族全員のスマホに即時プッシュ通知でお知らせします。",
            },
            {
              icon: MessageSquare,
              gradient: "from-purple-500 to-indigo-500",
              title: "家族チャット",
              desc: "ご本人について家族みんなで情報共有。写真も送れます。",
            },
            {
              icon: FileText,
              gradient: "from-amber-500 to-orange-500",
              title: "ケアノート",
              desc: "気になることをメモして家族で共有。大切な情報を記録。",
            },
            {
              icon: BarChart3,
              gradient: "from-violet-500 to-fuchsia-500",
              title: "週間レポート",
              desc: "毎週月曜日にチェックイン・服薬状況をメールでお届け。",
            },
          ].map((f) => (
            <div
              key={f.title}
              className="group relative bg-white border border-gray-100 rounded-2xl p-6 hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
            >
              <div
                className={`w-14 h-14 bg-gradient-to-br ${f.gradient} rounded-xl flex items-center justify-center mb-5 shadow-lg group-hover:scale-110 transition-transform duration-300`}
              >
                <f.icon className="w-7 h-7 text-white" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                {f.title}
              </h3>
              <p className="text-gray-500 leading-relaxed">{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* QR Feature with modern glass card */}
      <section className="relative bg-gradient-to-br from-indigo-50 via-blue-50 to-indigo-50 px-4 py-20 overflow-hidden">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg width='40' height='40' viewBox='0 0 40 40' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M20 20.5V18H0v-2h20v-2H0v-2h20v-2H0V8h20V6H0V4h20V2H0V0h22v20h2V0h2v20h2V0h2v20h2V0h2v20h2V0h2v20h2v2H20v-1.5zM0 20v20h20V20H0zM22 22h18v18H22V22z' fill='%234f46e5' fill-opacity='0.03' fill-rule='evenodd'/%3E%3C/svg%3E')]" />
        <div className="relative max-w-4xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 bg-white/80 backdrop-blur-sm border border-indigo-100 text-indigo-600 text-sm font-medium px-5 py-2 rounded-full mb-6 shadow-sm">
            <QrCode className="w-4 h-4" />
            ログイン不要
          </div>
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            QRコードで
            <br />
            かんたん記録
          </h2>
          <p className="text-lg text-gray-500 max-w-md mx-auto mb-12 leading-relaxed">
            QRコードを印刷してご本人に渡すだけ。スマホのカメラで読み取り、ボタンを押すだけで体調とお薬を記録できます。アカウント登録も不要です。
          </p>
          <div className="flex flex-col sm:flex-row gap-6 justify-center items-center">
            {[
              { icon: Smartphone, text: "カメラで読み取る" },
              { icon: CheckCircle, text: "ボタンを押す" },
              { icon: Users, text: "家族に届く" },
            ].map((step, i) => (
              <div key={step.text} className="flex items-center gap-3">
                <div className="flex items-center gap-3 bg-white rounded-2xl px-6 py-4 shadow-lg border border-gray-100">
                  <step.icon className="w-5 h-5 text-indigo-500" />
                  <span className="font-medium text-gray-700">{step.text}</span>
                </div>
                {i < 2 && (
                  <span className="text-2xl text-gray-300 hidden sm:block">
                    →
                  </span>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How it works with timeline */}
      <section className="px-4 py-24 max-w-5xl mx-auto w-full">
        <div className="text-center mb-16">
          <p className="text-sm font-semibold text-indigo-500 tracking-wider uppercase mb-3">
            How it works
          </p>
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900">
            かんたん3ステップ
          </h2>
        </div>
        <div className="relative flex flex-col sm:flex-row items-center justify-center gap-8">
          {[
            {
              num: "01",
              title: "無料登録",
              desc: "メールアドレスだけで\n簡単に登録できます",
              icon: CheckCircle,
            },
            {
              num: "02",
              title: "家族を招待",
              desc: "メールで家族を\n簡単に招待",
              icon: Users,
            },
            {
              num: "03",
              title: "見守り開始",
              desc: "みんなで安心して\n見守りましょう",
              icon: Heart,
            },
          ].map((step, i) => (
            <div key={step.num} className="relative flex-1 w-full">
              <div className="bg-white border border-gray-100 rounded-2xl p-8 text-center shadow-md hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
                <div className="relative">
                  <div className="w-20 h-20 bg-gradient-to-br from-indigo-500 to-indigo-600 text-white rounded-2xl flex items-center justify-center mx-auto mb-5 shadow-lg">
                    <step.icon className="w-8 h-8" />
                  </div>
                  <div className="absolute -top-3 -right-3 w-8 h-8 bg-indigo-100 text-indigo-600 rounded-full flex items-center justify-center text-sm font-bold">
                    {step.num}
                  </div>
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3">
                  {step.title}
                </h3>
                <p className="text-gray-500 whitespace-pre-line">{step.desc}</p>
              </div>
              {i < 2 && (
                <div className="hidden sm:block absolute top-1/2 -right-6 transform -translate-y-1/2 z-10">
                  <div className="w-3 h-3 border-t-2 border-r-2 border-indigo-300 rotate-45" />
                </div>
              )}
            </div>
          ))}
        </div>
      </section>

      {/* Testimonials with modern design */}
      <section className="bg-gradient-to-b from-gray-50 to-white px-4 py-24">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-16">
            <p className="text-sm font-semibold text-indigo-500 tracking-wider uppercase mb-3">
              Testimonials
            </p>
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900">
              ご家族の声
            </h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {displayTestimonials.map((t, index) => (
              <div
                key={index}
                className="group bg-white border border-gray-100 rounded-2xl p-6 shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
              >
                <div className="flex gap-1 mb-4">
                  {[...Array(5)].map((_, i) => (
                    <span
                      key={i}
                      className={`text-lg ${
                        i < t.rating ? "text-yellow-400" : "text-gray-200"
                      }`}
                    >
                      ★
                    </span>
                  ))}
                </div>
                <p className="text-gray-700 leading-relaxed mb-4">“{t.text}”</p>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-gradient-to-br from-indigo-100 to-indigo-200 rounded-full flex items-center justify-center">
                    <span className="text-indigo-600 font-semibold text-sm">
                      {t.author.charAt(0)}
                    </span>
                  </div>
                  <p className="text-sm font-medium text-gray-500">
                    {t.author}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Feedback Section - Updated component included below */}
      <FeedbackSection />

      {/* CTA Section */}
      {!session?.user?.id && (
        <section className="relative text-center px-4 py-24 bg-gradient-to-br from-indigo-600 via-indigo-700 to-blue-800 overflow-hidden">
          <p className="text-4xl md:text-5xl font-bold text-white mb-4">
            今日から始めてみませんか？
          </p>
          <p className="text-lg text-indigo-200 mb-10 max-w-md mx-auto">
            アカウント登録は簡単。大切なご家族を、みんなで見守りましょう。
          </p>
          <Link
            href="/register"
            className="inline-flex items-center gap-2 px-8 py-4 bg-white text-indigo-600 text-base font-semibold rounded-xl hover:bg-indigo-50 transition-all duration-300 shadow-xl hover:scale-105 group"
          >
            無料で始める
            <span className="group-hover:translate-x-1 transition-transform">
              →
            </span>
          </Link>
        </section>
      )}
    </div>
  );
}
