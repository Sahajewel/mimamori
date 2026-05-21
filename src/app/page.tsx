import Link from "next/link";
import { FeedbackSection } from "./components/FeedbackSection";

export default function HomePage() {
  return (
    <div className="min-h-screen flex flex-col bg-[#FAF9F6] overflow-x-hidden">
      {/* Navbar */}
      <nav className="sticky top-0 z-50 bg-[#FAF9F6]/90 backdrop-blur-md border-b border-[#E8E4DC] px-4 md:px-8 py-3.5">
        <div className="max-w-5xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-[#1A7A5E] flex items-center justify-center shadow-sm">
              <span className="text-white text-base">🌿</span>
            </div>
            <div>
              <p className="font-semibold text-[#1C1C1A] text-sm leading-none tracking-tight">
                Mimamori
              </p>
              <p className="text-[11px] text-[#9B9B97] mt-0.5 hidden sm:block">
                見守り — 家族をつなぐ
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Link
              href="/login"
              className="px-4 py-2 text-sm font-medium text-[#4A4A47] hover:text-[#1C1C1A] transition-colors rounded-lg hover:bg-[#F0EDE6]"
            >
              ログイン
            </Link>
            <Link
              href="/register"
              className="px-4 py-2 text-sm font-semibold bg-[#1A7A5E] text-white rounded-xl hover:bg-[#155F49] active:scale-95 transition-all shadow-sm"
            >
              無料で始める
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="relative flex flex-col items-center text-center px-4 py-20 md:py-32 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-[#EDF7F3]/60 to-[#FAF9F6] pointer-events-none" />
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[500px] h-[500px] bg-[#1A7A5E]/6 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 w-full max-w-2xl mx-auto">
          <span className="inline-flex items-center gap-1.5 bg-[#E8F5F0] border border-[#B8E0D4] text-[#0F6E56] text-xs font-semibold px-4 py-1.5 rounded-full mb-8 tracking-wide">
            🇯🇵 日本の高齢者ケアのために作られました
          </span>
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-semibold text-[#1C1C1A] leading-[1.2] mb-6 tracking-tight">
            離れていても、
            <br />
            <span className="text-[#1A7A5E]">いつも一緒に。</span>
          </h1>
          <p className="text-base md:text-lg text-[#6B6B68] max-w-lg mx-auto leading-relaxed mb-10">
            離れて暮らすご家族の毎日の様子を、
            家族みんなで安心して見守るプラットフォーム。
            ログイン不要で簡単に記録できます。
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center w-full max-w-sm mx-auto">
            <Link
              href="/register"
              className="flex-1 px-8 py-4 bg-[#1A7A5E] text-white text-sm font-semibold rounded-xl hover:bg-[#155F49] active:scale-95 transition-all shadow-lg shadow-[#1A7A5E]/20 text-center"
            >
              無料で始める →
            </Link>
            <Link
              href="/login"
              className="flex-1 px-8 py-4 border border-[#DDD9D0] text-[#4A4A47] text-sm font-medium rounded-xl hover:bg-[#F0EDE6] active:scale-95 transition-all text-center"
            >
              ログイン
            </Link>
          </div>
          <p className="text-xs text-[#AEAEAD] mt-4">
            クレジットカード不要 · 完全無料
          </p>
        </div>
      </section>

      {/* Stats */}
      <section className="bg-[#1A7A5E] px-4 py-12">
        <div className="max-w-3xl mx-auto grid grid-cols-3 gap-4 text-center">
          {[
            { value: "無料", label: "ずっと無料で使える" },
            { value: "24時間", label: "いつでも見守れる" },
            { value: "即時", label: "緊急通知が届く" },
          ].map((s) => (
            <div key={s.label}>
              <p className="text-2xl md:text-4xl font-bold text-white">
                {s.value}
              </p>
              <p className="text-xs md:text-sm text-[#9FD4C4] mt-1.5 leading-relaxed">
                {s.label}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* Features */}
      <section className="px-4 py-20 max-w-5xl mx-auto w-full">
        <div className="text-center mb-14">
          <p className="text-xs font-bold text-[#1A7A5E] tracking-[0.2em] uppercase mb-3">
            Features
          </p>
          <h2 className="text-2xl md:text-3xl font-semibold text-[#1C1C1A] mb-3 tracking-tight">
            Mimamoriでできること
          </h2>
          <p className="text-sm text-[#9B9B97] max-w-md mx-auto leading-relaxed">
            高齢者の見守りに必要な機能をすべて一つのアプリに
          </p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          {[
            {
              icon: "✓",
              bg: "bg-[#E8F5F0]",
              color: "text-[#0F6E56]",
              border: "border-[#C5E8DE]",
              tag: "毎日通知",
              tagBg: "bg-[#E8F5F0] text-[#0F6E56]",
              title: "毎日のチェックイン",
              desc: "今日の様子を家族みんなで確認。見逃しがあれば自動でお知らせします。",
            },
            {
              icon: "💊",
              bg: "bg-[#FAEEDA]",
              color: "text-[#854F0B]",
              border: "border-[#F0D9A8]",
              tag: "飲み忘れ防止",
              tagBg: "bg-[#FAEEDA] text-[#854F0B]",
              title: "お薬の管理",
              desc: "飲み忘れを防ぐリマインダーと、時間帯別の服薬記録で安心。",
            },
            {
              icon: "🚨",
              bg: "bg-[#FCEBEB]",
              color: "text-[#A32D2D]",
              border: "border-[#F0C4C4]",
              tag: "即時通知",
              tagBg: "bg-[#FCEBEB] text-[#A32D2D]",
              title: "緊急アラート",
              desc: "緊急時は家族全員のスマホに即時通知。音とともに届きます。",
            },
            {
              icon: "💬",
              bg: "bg-[#E6F1FB]",
              color: "text-[#185FA5]",
              border: "border-[#BDD8F5]",
              tag: "家族で共有",
              tagBg: "bg-[#E6F1FB] text-[#185FA5]",
              title: "家族チャット",
              desc: "ご本人について家族みんなで情報共有。写真も送れます。",
            },
            {
              icon: "📝",
              bg: "bg-[#EAF3DE]",
              color: "text-[#3B6D11]",
              border: "border-[#C8E0A8]",
              tag: "記録管理",
              tagBg: "bg-[#EAF3DE] text-[#3B6D11]",
              title: "ケアノート",
              desc: "気になることをメモして家族で共有。大切な情報を記録。",
            },
            {
              icon: "📊",
              bg: "bg-[#F0EBF8]",
              color: "text-[#6B2FA0]",
              border: "border-[#D8C5EF]",
              tag: "週次レポート",
              tagBg: "bg-[#F0EBF8] text-[#6B2FA0]",
              title: "週間レポート",
              desc: "毎週月曜日にチェックイン・服薬状況をメールでお届け。",
            },
          ].map((f) => (
            <div
              key={f.title}
              className={`bg-white border ${f.border} rounded-2xl p-6 hover:shadow-md hover:-translate-y-0.5 transition-all duration-200 cursor-default`}
            >
              <div
                className={`w-11 h-11 ${f.bg} rounded-xl flex items-center justify-center mb-4 text-xl`}
              >
                {f.icon}
              </div>
              <p className="text-base font-semibold text-[#1C1C1A] mb-2 tracking-tight">
                {f.title}
              </p>
              <p className="text-sm text-[#9B9B97] leading-relaxed mb-3">
                {f.desc}
              </p>
              <span
                className={`inline-block text-xs font-medium px-2.5 py-1 rounded-full ${f.tagBg}`}
              >
                {f.tag}
              </span>
            </div>
          ))}
        </div>
      </section>

      {/* QR Feature */}
      <section className="bg-gradient-to-r from-[#EDF7F3] to-[#E8F5F0] px-4 py-16 border-y border-[#C5E8DE]">
        <div className="max-w-3xl mx-auto text-center">
          <span className="inline-flex items-center bg-white border border-[#B8E0D4] text-[#0F6E56] text-xs font-semibold px-4 py-1.5 rounded-full mb-6 shadow-sm tracking-wide">
            ✨ ログイン不要
          </span>
          <h2 className="text-2xl md:text-3xl font-semibold text-[#1C1C1A] mb-4 tracking-tight">
            QRコードで
            <br />
            かんたん記録
          </h2>
          <p className="text-sm text-[#6B6B68] max-w-md mx-auto mb-10 leading-relaxed">
            QRコードを印刷してご本人に渡すだけ。
            スマホのカメラで読み取り、ボタンを押すだけで体調とお薬を記録できます。
            アカウント登録も不要です。
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center items-center">
            {["📱 カメラで読み取る", "👆 ボタンを押す", "✓ 家族に届く"].map(
              (s, i) => (
                <div key={s} className="flex items-center gap-3">
                  <div className="bg-white rounded-xl px-5 py-3 shadow-sm border border-white/80 text-sm font-medium text-[#3C3C3A]">
                    {s}
                  </div>
                  {i < 2 && (
                    <span className="text-[#1A7A5E]/40 text-xl hidden sm:block flex-shrink-0">
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
            <p className="text-xs font-bold text-[#1A7A5E] tracking-[0.2em] uppercase mb-3">
              How it works
            </p>
            <h2 className="text-2xl md:text-3xl font-semibold text-[#1C1C1A] tracking-tight">
              かんたん3ステップ
            </h2>
          </div>
          <div className="flex flex-col sm:flex-row items-stretch justify-center gap-4">
            {[
              {
                num: "1",
                title: "無料登録",
                desc: "メールアドレスだけで\n簡単に登録できます",
                color: "bg-[#1A7A5E]",
              },
              {
                num: "2",
                title: "家族を招待",
                desc: "メールで家族を\n簡単に招待",
                color: "bg-[#1A7A5E]/80",
              },
              {
                num: "3",
                title: "見守り開始",
                desc: "みんなで安心して\n見守りましょう",
                color: "bg-[#1A7A5E]/60",
              },
            ].map((s, i) => (
              <div
                key={s.num}
                className="flex items-center gap-4 w-full sm:w-auto"
              >
                <div className="flex-1 sm:w-44 bg-white border border-[#E8E4DC] rounded-2xl p-6 text-center shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all duration-200">
                  <div
                    className={`w-12 h-12 ${s.color} text-white rounded-full flex items-center justify-center text-lg font-bold mx-auto mb-4 shadow-md`}
                  >
                    {s.num}
                  </div>
                  <p className="text-base font-semibold text-[#1C1C1A] mb-2 tracking-tight">
                    {s.title}
                  </p>
                  <p className="text-sm text-[#9B9B97] leading-relaxed whitespace-pre-line">
                    {s.desc}
                  </p>
                </div>
                {i < 2 && (
                  <span className="text-2xl text-[#C5E8DE] hidden sm:block flex-shrink-0">
                    →
                  </span>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="bg-[#F5F3EE] px-4 py-20 border-y border-[#E8E4DC]">
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-12">
            <p className="text-xs font-bold text-[#1A7A5E] tracking-[0.2em] uppercase mb-3">
              Testimonials
            </p>
            <h2 className="text-2xl md:text-3xl font-semibold text-[#1C1C1A] tracking-tight">
              ご家族の声
            </h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {[
              {
                text: "母が一人暮らしで心配でしたが、毎日チェックインが届くので安心できるようになりました。家族みんなで見守れるのが良いです。",
                author: "東京在住、40代 息子",
                initial: "息",
              },
              {
                text: "お薬の飲み忘れが減りました。通知が来るので家族みんなで確認できます。QRコードで母も簡単に使えています。",
                author: "大阪在住、50代 娘",
                initial: "娘",
              },
              {
                text: "緊急ボタンがあるので、何かあった時にすぐ家族に知らせられます。遠くに住んでいても安心です。",
                author: "福岡在住、60代 夫",
                initial: "夫",
              },
              {
                text: "ケアノートで病院の記録も共有できます。離れた家族みんなが同じ情報を持てるのでとても助かっています。",
                author: "名古屋在住、30代 息子",
                initial: "息",
              },
            ].map((t) => (
              <div
                key={t.author}
                className="bg-white border border-[#E8E4DC] rounded-2xl p-6 shadow-sm hover:shadow-md transition-shadow duration-200"
              >
                <p className="text-sm text-[#DAA520] mb-3 tracking-wider">
                  ⭐⭐⭐⭐⭐
                </p>
                <p className="text-sm text-[#3C3C3A] leading-relaxed mb-5">
                  {t.text}
                </p>
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-full bg-[#E8F5F0] flex items-center justify-center text-xs font-semibold text-[#0F6E56]">
                    {t.initial}
                  </div>
                  <p className="text-xs text-[#9B9B97] font-medium">
                    — {t.author}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Feedback */}
      <FeedbackSection />

      {/* CTA */}
      <section className="relative text-center px-4 py-24 bg-[#1A7A5E] overflow-hidden">
        <div className="absolute top-0 right-0 w-72 h-72 bg-white/5 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-72 h-72 bg-black/10 rounded-full blur-3xl pointer-events-none" />
        <div className="relative z-10 max-w-xl mx-auto">
          <p className="text-3xl md:text-4xl font-semibold text-white mb-3 leading-tight tracking-tight">
            今日から始めてみませんか？
          </p>
          <p className="text-sm text-[#9FD4C4] mb-10 max-w-md mx-auto leading-relaxed">
            登録は無料。クレジットカードも不要。
            大切なご家族を、みんなで見守りましょう。
          </p>
          <Link
            href="/register"
            className="inline-block px-10 py-4 bg-white text-[#1A7A5E] text-sm font-semibold rounded-xl hover:bg-[#F0FDF8] active:scale-95 transition-all shadow-xl"
          >
            無料で始める →
          </Link>
          <p className="text-xs text-[#9FD4C4]/60 mt-4">
            クレジットカード不要 · いつでもキャンセル可
          </p>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-[#E8E4DC] px-4 py-8 bg-[#FAF9F6]">
        <div className="max-w-5xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-[#1A7A5E] flex items-center justify-center">
              <span className="text-white text-xs">🌿</span>
            </div>
            <p className="text-sm font-semibold text-[#1C1C1A]">Mimamori</p>
          </div>
          <p className="text-xs text-[#AEAEAD]">
            Developed by Saha Jewel Kumar
          </p>
          <div className="flex flex-wrap justify-center gap-4 md:gap-6">
            <Link
              href="/privacy"
              className="text-xs text-[#9B9B97] hover:text-[#1C1C1A] transition-colors"
            >
              プライバシーポリシー
            </Link>
            <Link
              href="/terms"
              className="text-xs text-[#9B9B97] hover:text-[#1C1C1A] transition-colors"
            >
              利用規約
            </Link>
            <p className="text-xs text-[#AEAEAD]">© 2026 Mimamori</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
