import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import Link from "next/link";

export default async function SeniorsPage() {
  const session = await auth();
  if (!session?.user?.id) redirect("/login");

  const seniorMembers = await prisma.seniorMember.findMany({
    where: { userId: session.user.id },
    include: {
      senior: true,
    },
    orderBy: { createdAt: "asc" },
  });

  return (
    <div className="min-h-screen bg-gray-50 pb-24 md:pb-0">
      <nav className="bg-white border-b border-gray-100 px-4 py-4 sticky top-0 z-10">
        <div className="max-w-2xl mx-auto flex items-center justify-between">
          <h1 className="text-lg font-semibold text-gray-900">家族一覧</h1>
          <Link
            href="/seniors/new"
            className="px-4 py-2 bg-indigo-600 text-white text-sm font-medium rounded-xl hover:bg-indigo-700 transition-colors"
          >
            ＋ 追加
          </Link>
        </div>
      </nav>

      <div className="max-w-2xl mx-auto px-4 py-8">
        {seniorMembers.length === 0 ? (
          <div className="bg-white border border-gray-100 rounded-2xl p-12 text-center">
            <p className="text-4xl mb-4">👨‍👩‍👧</p>
            <p className="text-lg font-semibold text-gray-900 mb-2">
              まだご家族を登録していません
            </p>
            <Link
              href="/seniors/new"
              className="inline-block px-6 py-3 bg-indigo-600 text-white text-sm font-medium rounded-xl hover:bg-indigo-700 transition-colors mt-4"
            >
              ＋ 家族を追加する
            </Link>
          </div>
        ) : (
          <div className="space-y-3">
            {seniorMembers.map((member) => (
              <Link
                key={member.senior.id}
                href={`/seniors/${member.senior.id}`}
                className="flex items-center gap-4 bg-white border border-gray-100 rounded-2xl p-5 hover:border-indigo-200 hover:shadow-md transition-all active:scale-95"
              >
                <div className="w-14 h-14 bg-indigo-100 rounded-full flex items-center justify-center text-indigo-600 font-semibold text-xl overflow-hidden shrink-0">
                  {member.senior.photoUrl ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={member.senior.photoUrl}
                      alt={member.senior.name}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    member.senior.name.charAt(0).toUpperCase()
                  )}
                </div>
                <div className="flex-1">
                  <p className="text-base font-semibold text-gray-900">
                    {member.senior.name}
                  </p>
                  {member.senior.age && (
                    <p className="text-sm text-gray-400">
                      {member.senior.age}歳
                    </p>
                  )}
                </div>
                <div className="flex items-center gap-2">
                  {member.role === "OWNER" && (
                    <span className="text-xs bg-indigo-50 text-indigo-600 px-2.5 py-1 rounded-full font-medium">
                      管理者
                    </span>
                  )}
                  <span className="text-gray-300 text-lg">→</span>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
