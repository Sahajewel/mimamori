import Link from "next/link";
import { BackButton } from "../components/BackButton";
import { auth } from "@/lib/auth";

export default async function GuidePage() {
  const session = await auth();
  return (
    <div className="min-h-screen flex flex-col bg-gray-50 ">
      {/* Navbar */}
      <nav className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-gray-100 px-4 md:px-8 py-4">
        <div className="max-w-2xl mx-auto flex items-center justify-between">
          <BackButton />
        </div>
      </nav>

      {/* Hero */}
      <section className="relative text-center px-4 py-16 md:py-20 overflow-hidden">
        <div className="absolute inset-0 bg-linear-to-b from-indigo-50/50 to-white pointer-events-none" />
        <div className="relative z-10 max-w-2xl mx-auto">
          <span className="inline-flex items-center gap-1.5 bg-indigo-50 border border-indigo-100 text-indigo-600 text-sm font-medium px-4 py-2 rounded-full mb-6">
            📖 使い方ガイド
          </span>
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-semibold text-gray-900 leading-tight mb-5">
            Mimamoriの使い方
          </h1>
          <p className="text-base md:text-lg text-gray-500 leading-relaxed">
            はじめての方でも安心。アカウント登録から毎日の見守りまで、順を追ってご説明します。
          </p>
        </div>
      </section>

      {/* 目次 (Table of contents) */}
      <section className="px-4 pb-4 max-w-3xl mx-auto w-full">
        <div className="bg-gray-50 border border-gray-100 rounded-2xl p-6">
          <p className="text-sm font-semibold text-gray-400 uppercase tracking-widest mb-4">
            もくじ
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {[
              { href: "#start", label: "1. アカウントを作る" },
              { href: "#senior", label: "2. 見守る方を登録する" },
              { href: "#invite", label: "3. 家族を招待する" },
              { href: "#roles", label: "4. 権限（役割）について" },
              { href: "#checkin", label: "5. チェックイン" },
              { href: "#medicine", label: "6. お薬の管理" },
              { href: "#quicklink", label: "7. QRクイックリンク" },
              { href: "#note", label: "8. ケアノート" },
              { href: "#chat", label: "9. 家族チャット" },
              { href: "#emergency", label: "10. 緊急アラート" },
              { href: "#transfer", label: "11. オーナーの譲渡" },
              { href: "#delete", label: "12. 削除について" },
            ].map((item) => (
              <a
                key={item.href}
                href={item.href}
                className="text-sm text-indigo-600 hover:underline py-1"
              >
                {item.label}
              </a>
            ))}
          </div>
        </div>
      </section>

      {/* Steps */}
      <section className="px-4 py-10 max-w-3xl mx-auto w-full space-y-10">
        {/* 1. Account */}
        <GuideBlock
          id="start"
          icon="🚀"
          bg="bg-indigo-50"
          color="text-indigo-600"
          title="1. アカウントを作る"
          intro="まずはご家族の代表の方が、無料でアカウントを作成します。"
          steps={[
            "トップページの「無料で始める」を押します。",
            "お名前・メールアドレス・パスワードを入力します。",
            "登録したメールアドレスに確認メールが届きます。メール内のリンクを押すと登録完了です。",
            "ログインすると、ダッシュボード（見守る方の一覧）が表示されます。",
          ]}
          note="確認メールが届かない場合は、迷惑メールフォルダもご確認ください。"
        />

        {/* 2. Senior */}
        <GuideBlock
          id="senior"
          icon="👵"
          bg="bg-rose-50"
          color="text-rose-500"
          title="2. 見守る方を登録する"
          intro="お母さま・お父さまなど、見守りたい方を登録します。"
          steps={[
            "ダッシュボードの「追加」ボタンを押します。",
            "見守る方のお名前を入力します（年齢や写真、メモは任意です）。",
            "保存すると、その方専用の見守りページが作られます。",
            "ここから体調・お薬・ケアノートなどを記録していきます。",
          ]}
          note="複数の方を登録できます。それぞれ別々に見守れます。"
        />

        {/* 3. Invite */}
        <GuideBlock
          id="invite"
          icon="✉️"
          bg="bg-blue-50"
          color="text-blue-600"
          title="3. 家族を招待する"
          intro="兄弟姉妹など、ほかのご家族も一緒に見守れます。"
          steps={[
            "見守る方のページを開き、右上の「招待する」を押します。",
            "招待したい家族のメールアドレスと、権限（役割）を選びます。",
            "招待されたご家族は、まずMimamoriにアカウントを作る必要があります。",
            "同じメールアドレスで登録・ログインすると、その方の見守りページが見えるようになります。",
          ]}
          note="招待は、すでにMimamoriに登録済みのメールアドレス宛にのみ送れます。先にご家族に登録をお願いしてください。"
        />

        {/* 4. Roles */}
        <GuideBlock
          id="roles"
          icon="🔑"
          bg="bg-purple-50"
          color="text-purple-600"
          title="4. 権限（役割）について"
          intro="家族それぞれに、できることの範囲（役割）を設定できます。"
          roles={[
            {
              badge: "オーナー",
              cls: "bg-indigo-50 text-indigo-600",
              desc: "すべての操作ができます。家族の招待、見守る方の削除、オーナーの譲渡もできます。見守る方ごとに1人です。",
            },
            {
              badge: "編集者",
              cls: "bg-green-50 text-green-600",
              desc: "チェックイン・お薬・ケアノートの記録や編集ができます。家族の招待や削除はできません。",
            },
            {
              badge: "閲覧者",
              cls: "bg-gray-100 text-gray-500",
              desc: "記録を見ることができます。チェックインやお薬の追加はできません（チャットには参加できます）。",
            },
          ]}
        />

        {/* 5. Checkin */}
        <GuideBlock
          id="checkin"
          icon="✓"
          bg="bg-green-50"
          color="text-green-600"
          title="5. チェックイン"
          intro="その日の体調を記録して、家族みんなで確認できます。"
          steps={[
            "見守る方のページの「チェックイン」タブを開きます。",
            "「追加」を押し、体調を「元気」「要確認」「緊急」から選びます。",
            "必要であればメモを書いて保存します。",
            "記録は家族全員に共有され、ページの「今日の体調」に表示されます。",
          ]}
          note="ご本人がQRコードから記録することもできます（7番をご覧ください）。"
        />

        {/* 6. Medicine */}
        <GuideBlock
          id="medicine"
          icon="💊"
          bg="bg-emerald-50"
          color="text-emerald-600"
          title="6. お薬の管理"
          intro="お薬を登録して、飲み忘れを防ぎます。"
          steps={[
            "「お薬」タブを開き、「追加」を押します。",
            "お薬の名前・用量・服用頻度・服用タイミング（朝食前など）を入力します。",
            "継続するお薬か、期間を決めたお薬かを選んで保存します。",
            "「服薬履歴」から、飲んだ・飲めなかったの記録を確認できます。",
          ]}
          note="お薬を「飲んだ／飲めなかった」の記録は、ご本人がQRコードから行います（7番）。"
        />

        {/* 7. Quick link */}
        <GuideBlock
          id="quicklink"
          icon="📱"
          bg="bg-indigo-50"
          color="text-indigo-600"
          title="7. QRクイックリンク（ご本人用）"
          intro="ログインやパスワードが苦手なご本人でも、QRコードで簡単に記録できます。"
          steps={[
            "見守る方のページで「リンクを生成する」を押します（オーナーのみ）。",
            "表示されたQRコードを「印刷」して、ご本人にお渡しします。",
            "ご本人はスマホのカメラでQRを読み取り、開いたページのボタンを押すだけ。",
            "「元気です」などの体調や、お薬を飲んだ記録が、家族に届きます。ログインは不要です。",
          ]}
          note="リンクが漏れた場合は、もう一度「生成する」を押すと新しいリンクになり、古いリンクは使えなくなります。"
        />

        {/* 8. Care note */}
        <GuideBlock
          id="note"
          icon="📝"
          bg="bg-amber-50"
          color="text-amber-600"
          title="8. ケアノート"
          intro="病院の記録や気になることをメモして、家族で共有できます。"
          steps={[
            "「ケアノート」タブを開き、「追加」を押します。",
            "内容を書いて保存します。",
            "書いた人の名前と日時とともに、家族全員に共有されます。",
          ]}
          note="自分が書いたノートは、自分で編集・削除できます。"
        />

        {/* 9. Chat */}
        <GuideBlock
          id="chat"
          icon="💬"
          bg="bg-sky-50"
          color="text-sky-600"
          title="9. 家族チャット"
          intro="見守る方について、家族みんなで相談・連絡ができます。"
          steps={[
            "見守る方のページのチャットアイコンを押します。",
            "メッセージを入力して送信します。写真も送れます。",
            "自分のメッセージは長押しで編集・削除ができます。",
            "家族の誰かがメッセージを送ると、ほかの家族に通知が届きます。",
          ]}
          note="チャットには、閲覧者を含む家族全員が参加できます。"
        />

        {/* 10. Emergency */}
        <GuideBlock
          id="emergency"
          icon="🚨"
          bg="bg-red-50"
          color="text-red-500"
          title="10. 緊急アラート"
          intro="緊急時は、家族全員のスマホへすぐにお知らせします。"
          steps={[
            "チェックインで「緊急」を選ぶと、家族全員にプッシュ通知が届きます。",
            "ご本人もQRページの「助けてください」ボタンから緊急を知らせられます。",
            "通知を受け取ったら、すぐにご本人の状態を確認してください。",
          ]}
          note="通知を受け取るには、スマホで通知を「許可」しておく必要があります。"
        />

        {/* 11. Transfer */}
        <GuideBlock
          id="transfer"
          icon="👑"
          bg="bg-violet-50"
          color="text-violet-600"
          title="11. オーナーの譲渡"
          intro="オーナーの役割を、ほかの家族に引き継ぐことができます。"
          steps={[
            "見守る方のページの「家族メンバー」一覧を開きます。",
            "オーナーにしたい家族の横の「オーナーにする」を押します（オーナーのみ表示）。",
            "確認すると、その方が新しいオーナーになり、ご自身は編集者になります。",
          ]}
          note="オーナーがアカウントを削除したいときは、先に譲渡が必要です（12番）。"
        />

        {/* 12. Delete */}
        <GuideBlock
          id="delete"
          icon="🗑️"
          bg="bg-gray-100"
          color="text-gray-500"
          title="12. 削除について"
          intro="見守る方やアカウントの削除には、いくつかのルールがあります。"
          steps={[
            "見守る方の削除：オーナーが、その方のページから削除できます。記録もすべて消えます。",
            "アカウントの削除：設定ページから削除できます。",
            "あなたがオーナーの場合は、先にオーナーを譲渡するか、見守る方を削除する必要があります。",
            "アカウントを削除しても、あなたが記録したチェックインやノートは残りますが、お名前は表示されなくなります。",
          ]}
          note="削除は元に戻せません。ご注意ください。"
        />
      </section>

      {/* CTA */}
      {!session?.user?.id && (
        <section className="relative text-center px-4 py-16 bg-indigo-600 overflow-hidden mt-6">
          <div className="absolute inset-0 bg-linear-to-br from-indigo-600 to-indigo-800 pointer-events-none" />
          <div className="relative z-10">
            <p className="text-2xl md:text-3xl font-semibold text-white mb-3">
              さあ、はじめましょう
            </p>
            <p className="text-base text-indigo-200 mb-8 max-w-md mx-auto">
              大切なご家族を、みんなで見守りましょう。
            </p>
            <Link
              href="/register"
              className="inline-block px-10 py-4 bg-white text-indigo-600 text-base font-semibold rounded-xl hover:bg-indigo-50 transition-colors shadow-xl"
            >
              無料で始める →
            </Link>
          </div>
        </section>
      )}
    </div>
  );
}

// একটা ধাপের block — steps অথবা roles দেখায়
function GuideBlock({
  id,
  icon,
  bg,
  color,
  title,
  intro,
  steps,
  roles,
  note,
}: {
  id: string;
  icon: string;
  bg: string;
  color: string;
  title: string;
  intro: string;
  steps?: string[];
  roles?: { badge: string; cls: string; desc: string }[];
  note?: string;
}) {
  return (
    <div id={id} className="scroll-mt-24">
      <div className="flex items-center gap-3 mb-4">
        <div
          className={`w-12 h-12 ${bg} rounded-xl flex items-center justify-center ${color} text-2xl shrink-0`}
        >
          {icon}
        </div>
        <h2 className="text-xl md:text-2xl font-semibold text-gray-900">
          {title}
        </h2>
      </div>

      <p className="text-base text-gray-500 leading-relaxed mb-5">{intro}</p>

      {/* Steps */}
      {steps && (
        <div className="space-y-3 mb-4">
          {steps.map((step, i) => (
            <div key={i} className="flex gap-3">
              <div className="w-7 h-7 bg-indigo-600 text-white rounded-full flex items-center justify-center text-sm font-semibold shrink-0">
                {i + 1}
              </div>
              <p className="text-base text-gray-700 leading-relaxed pt-0.5">
                {step}
              </p>
            </div>
          ))}
        </div>
      )}

      {/* Roles */}
      {roles && (
        <div className="space-y-3 mb-4">
          {roles.map((r) => (
            <div
              key={r.badge}
              className="bg-white border border-gray-100 rounded-xl p-4 shadow-sm"
            >
              <span
                className={`inline-block text-xs font-medium px-2.5 py-1 rounded-full mb-2 ${r.cls}`}
              >
                {r.badge}
              </span>
              <p className="text-sm text-gray-600 leading-relaxed">{r.desc}</p>
            </div>
          ))}
        </div>
      )}

      {/* Note */}
      {note && (
        <div className="bg-amber-50 border border-amber-100 rounded-xl px-4 py-3">
          <p className="text-sm text-amber-700 leading-relaxed">💡 {note}</p>
        </div>
      )}
    </div>
  );
}
