import Link from "next/link";
import {
  Check,
  Pill,
  BellRing,
  MessagesSquare,
  NotebookPen,
  BarChart3,
  Camera,
  MousePointerClick,
  Star,
  Heart,
  ArrowRight,
} from "lucide-react";
import { FeedbackSection } from "./components/FeedbackSection";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";

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

  const features = [
    {
      Icon: Check,
      bg: "bg-brand-soft",
      color: "text-brand-dark",
      border: "border-brand-soft",
      title: "毎日のチェックイン",
      desc: "今日の様子を家族みんなで確認。見逃しがあれば自動でお知らせします。",
    },
    {
      Icon: Pill,
      bg: "bg-emerald-50",
      color: "text-emerald-700",
      border: "border-emerald-100",
      title: "お薬の管理",
      desc: "飲み忘れを防ぐリマインダーと、時間帯別の服薬記録で安心。",
    },
    {
      Icon: BellRing,
      bg: "bg-rose-50",
      color: "text-rose-600",
      border: "border-rose-100",
      title: "緊急アラート",
      desc: "緊急時は家族全員のスマホに即時プッシュ通知でお知らせします。",
    },
    {
      Icon: MessagesSquare,
      bg: "bg-sky-50",
      color: "text-sky-700",
      border: "border-sky-100",
      title: "家族チャット",
      desc: "ご本人について家族みんなで情報共有。写真も送れます。",
    },
    {
      Icon: NotebookPen,
      bg: "bg-amber-50",
      color: "text-amber-700",
      border: "border-amber-100",
      title: "ケアノート",
      desc: "気になることをメモして家族で共有。大切な情報を記録。",
    },
    {
      Icon: BarChart3,
      bg: "bg-violet-50",
      color: "text-violet-700",
      border: "border-violet-100",
      title: "週間レポート",
      desc: "毎週月曜日にチェックイン・服薬状況をメールでお届け。",
    },
  ];

  const qrSteps = [
    { Icon: Camera, label: "カメラで読み取る" },
    { Icon: MousePointerClick, label: "ボタンを押す" },
    { Icon: Check, label: "家族に届く" },
  ];

  return (
    <div className="min-h-screen flex flex-col bg-surface overflow-x-hidden">
      {/* Hero */}
      <section className="relative flex flex-col items-center text-center px-4 py-20 md:py-32 overflow-hidden">
        <div className="absolute inset-0 bg-linear-to-b from-brand-soft/60 to-surface pointer-events-none" />
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-150 h-150 bg-brand/10 rounded-full blur-3xl pointer-events-none" />
        <div className="relative z-10">
          <span className="inline-flex items-center gap-1.5 bg-white border border-brand-soft text-brand-dark text-sm font-medium px-4 py-2 rounded-full mb-8 shadow-sm">
            🇯🇵 日本の高齢者ケアのために作られました
          </span>
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-semibold text-stone-800 leading-tight mb-6">
            離れていても、
            <br />
            <span className="text-brand-dark">いつも一緒に。</span>
          </h1>
          <p className="text-lg md:text-xl text-stone-600 max-w-lg leading-relaxed mb-10">
            離れて暮らすご家族の毎日の様子を、家族みんなで安心して見守るプラットフォーム。ログイン不要で簡単に記録できます。
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center w-full max-w-sm mx-auto">
            {!session?.user?.id && (
              <div>
                <Link
                  href="/register"
                  className="inline-flex items-center gap-2 px-10 py-4 bg-brand text-white text-base font-semibold rounded-xl hover:bg-brand-dark transition-colors shadow-lg shadow-brand/20"
                >
                  無料で始める
                  <ArrowRight className="w-5 h-5" />
                </Link>
                <p className="text-sm text-stone-500 mt-4">
                  今すぐ無料で始められます
                </p>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="bg-brand px-4 py-12">
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
              <p className="text-sm md:text-base text-white/80 mt-2">
                {s.label}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* Features */}
      <section className="px-4 py-20 max-w-5xl mx-auto w-full">
        <div className="text-center mb-14">
          <p className="text-sm font-semibold text-brand-dark tracking-widest uppercase mb-3">
            Features
          </p>
          <h2 className="text-3xl md:text-4xl font-semibold text-stone-800 mb-4">
            Mimamoriでできること
          </h2>
          <p className="text-base text-stone-600 max-w-md mx-auto">
            高齢者の見守りに必要な機能をすべて一つのアプリに
          </p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-5">
          {features.map((f) => (
            <div
              key={f.title}
              className={`bg-white border ${f.border} rounded-2xl p-6 hover:shadow-md transition-shadow`}
            >
              <div
                className={`w-12 h-12 ${f.bg} rounded-xl flex items-center justify-center mb-4 ${f.color}`}
              >
                <f.Icon className="w-6 h-6" strokeWidth={2} />
              </div>
              <p className="text-lg font-semibold text-stone-800 mb-2">
                {f.title}
              </p>
              <p className="text-base text-stone-600 leading-relaxed">
                {f.desc}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* QR Feature */}
      <section className="bg-linear-to-r from-brand-soft to-emerald-50 px-4 py-16">
        <div className="max-w-3xl mx-auto text-center">
          <span className="inline-flex items-center gap-1.5 bg-white border border-brand-soft text-brand-dark text-sm font-medium px-4 py-2 rounded-full mb-6 shadow-sm">
            <Heart className="w-4 h-4" /> ログイン不要
          </span>
          <h2 className="text-3xl md:text-4xl font-semibold text-stone-800 mb-4">
            QRコードで
            <br />
            かんたん記録
          </h2>
          <p className="text-base text-stone-600 max-w-md mx-auto mb-10 leading-relaxed">
            QRコードを印刷してご本人に渡すだけ。スマホのカメラで読み取り、ボタンを押すだけで体調とお薬を記録できます。アカウント登録も不要です。
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            {qrSteps.map((s, i) => (
              <div key={s.label} className="flex items-center gap-3">
                <div className="flex items-center gap-2.5 bg-white rounded-xl px-5 py-3 shadow-sm border border-stone-100 text-base font-medium text-stone-700">
                  <s.Icon className="w-5 h-5 text-brand-dark" />
                  {s.label}
                </div>
                {i < 2 && (
                  <ArrowRight className="w-5 h-5 text-stone-300 hidden sm:block" />
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="px-4 py-20">
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-14">
            <p className="text-sm font-semibold text-brand-dark tracking-widest uppercase mb-3">
              How it works
            </p>
            <h2 className="text-3xl md:text-4xl font-semibold text-stone-800">
              かんたん3ステップ
            </h2>
          </div>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            {[
              {
                num: "1",
                title: "無料登録",
                desc: "メールアドレスだけで\n簡単に登録できます",
                color: "bg-brand",
              },
              {
                num: "2",
                title: "家族を招待",
                desc: "メールで家族を\n簡単に招待",
                color: "bg-brand/85",
              },
              {
                num: "3",
                title: "見守り開始",
                desc: "みんなで安心して\n見守りましょう",
                color: "bg-brand/70",
              },
            ].map((s, i) => (
              <div
                key={s.num}
                className="flex items-center gap-4 w-full sm:w-auto"
              >
                <div className="flex-1 sm:w-48 bg-white border border-stone-100 rounded-2xl p-6 text-center shadow-sm hover:shadow-md transition-shadow">
                  <div
                    className={`w-14 h-14 ${s.color} text-white rounded-full flex items-center justify-center text-xl font-bold mx-auto mb-4 shadow-md`}
                  >
                    {s.num}
                  </div>
                  <p className="text-lg font-semibold text-stone-800 mb-2">
                    {s.title}
                  </p>
                  <p className="text-base text-stone-600 leading-relaxed whitespace-pre-line">
                    {s.desc}
                  </p>
                </div>
                {i < 2 && (
                  <ArrowRight className="w-6 h-6 text-stone-200 hidden sm:block shrink-0" />
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="bg-white px-4 py-20">
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-12">
            <p className="text-sm font-semibold text-brand-dark tracking-widest uppercase mb-3">
              Testimonials
            </p>
            <h2 className="text-3xl md:text-4xl font-semibold text-stone-800">
              ご家族の声
            </h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            {displayTestimonials.map((t, index) => (
              <div
                key={index}
                className="bg-surface border border-stone-100 rounded-2xl p-6 shadow-sm"
              >
                <div
                  className="flex gap-0.5 mb-3"
                  aria-label={`評価 ${t.rating} / 5`}
                >
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star
                      key={i}
                      className={
                        i < t.rating
                          ? "w-4 h-4 text-amber-400 fill-amber-400"
                          : "w-4 h-4 text-stone-200 fill-stone-200"
                      }
                    />
                  ))}
                </div>
                <p className="text-base text-stone-700 leading-relaxed mb-4">
                  {t.text}
                </p>
                <p className="text-sm text-stone-500 font-medium">
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
      {!session?.user?.id && (
        <section className="relative text-center px-4 py-20 bg-brand-dark overflow-hidden">
          <div className="absolute inset-0 bg-linear-to-br from-brand to-brand-dark pointer-events-none" />
          <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute bottom-0 left-0 w-64 h-64 bg-black/10 rounded-full blur-3xl pointer-events-none" />
          <div className="relative z-10">
            <p className="text-3xl md:text-4xl font-semibold text-white mb-4">
              今日から始めてみませんか？
            </p>
            <p className="text-base text-white/80 mb-10 max-w-md mx-auto">
              アカウント登録は簡単。大切なご家族を、みんなで見守りましょう。
            </p>
            <Link
              href="/register"
              className="inline-flex items-center gap-2 px-10 py-4 bg-white text-brand-dark text-base font-semibold rounded-xl hover:bg-stone-50 transition-colors shadow-xl"
            >
              無料で始める
              <ArrowRight className="w-5 h-5" />
            </Link>
          </div>
        </section>
      )}
    </div>
  );
}
