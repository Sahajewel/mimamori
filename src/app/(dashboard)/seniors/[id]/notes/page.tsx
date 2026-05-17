import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { redirect, notFound } from "next/navigation";
import Link from "next/link";

const PER_PAGE = 10;

interface CareNotesPageParams {
  id: string;
}

interface CareNotesPageSearchParams {
  page?: string;
}

interface Senior {
  name: string;
}

interface CareNoteWithUser {
  id: string;
  content: string;
  createdAt: Date;
  user: {
    name: string;
  };
}

export default async function CareNotesPage({
  params,
  searchParams,
}: {
  params: Promise<CareNotesPageParams>;
  searchParams: Promise<CareNotesPageSearchParams>;
}) {
  const { id } = await params;
  const { page } = await searchParams;
  const currentPage = Number(page) || 1;

  const session = await auth();
  if (!session?.user?.id) redirect("/login");

  const member = await prisma.seniorMember.findFirst({
    where: { seniorId: id, userId: session.user.id },
  });
  if (!member) notFound();

  const senior: Senior | null = await prisma.senior.findUnique({
    where: { id },
    select: { name: true },
  });

  const total = await prisma.careNote.count({
    where: { seniorId: id },
  });

  const totalPages = Math.ceil(total / PER_PAGE);

  const notes: CareNoteWithUser[] = await prisma.careNote.findMany({
    where: { seniorId: id },
    orderBy: { createdAt: "desc" },
    skip: (currentPage - 1) * PER_PAGE,
    take: PER_PAGE,
    include: {
      user: { select: { name: true } },
    },
  });

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white border-b border-gray-100 px-4 md:px-8 py-4 flex items-center gap-3">
        <Link
          href={`/seniors/${id}`}
          className="text-sm text-gray-400 hover:text-gray-600 transition-colors"
        >
          ← 戻る
        </Link>
        <p className="font-medium text-gray-900">Mimamori</p>
      </nav>

      <div className="max-w-2xl mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-xl md:text-2xl font-medium text-gray-900">
              ケアノート
            </h1>
            <p className="text-sm text-gray-400 mt-1">
              {senior?.name}さん · 全{total}件
            </p>
          </div>
          <Link
            href={`/seniors/${id}/notes/new`}
            className="px-4 py-2 bg-indigo-600 text-white text-sm font-medium rounded-lg hover:bg-indigo-700 transition-colors"
          >
            ＋ 追加
          </Link>
        </div>

        <div className="bg-white border border-gray-100 rounded-2xl p-6 mb-6">
          {notes.length === 0 ? (
            <p className="text-sm text-gray-400 text-center py-4">
              まだノートがありません
            </p>
          ) : (
            <div className="space-y-3">
              {notes.map((note, index) => (
                <div
                  key={note.id}
                  className="py-3 border-b border-gray-50 last:border-0"
                >
                  <div className="flex items-start gap-3">
                    <span className="text-xs text-gray-300 mt-1 w-6 flex-shrink-0">
                      {(currentPage - 1) * PER_PAGE + index + 1}
                    </span>
                    <div className="flex-1">
                      <p className="text-sm text-gray-700 mb-1">
                        {note.content}
                      </p>
                      <div className="flex items-center gap-2">
                        <p className="text-xs text-gray-400">
                          {note.user.name}
                        </p>
                        <p className="text-xs text-gray-300">·</p>
                        <p className="text-xs text-gray-300">
                          {new Date(note.createdAt).toLocaleDateString(
                            "ja-JP",
                            { timeZone: "Asia/Tokyo" },
                          )}{" "}
                          {new Date(note.createdAt).toLocaleTimeString(
                            "ja-JP",
                            {
                              timeZone: "Asia/Tokyo",
                              hour: "2-digit",
                              minute: "2-digit",
                            },
                          )}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex items-center justify-center gap-2">
            {currentPage > 1 && (
              <Link
                href={`/seniors/${id}/notes?page=${currentPage - 1}`}
                className="px-4 py-2 text-sm border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
              >
                ← 前へ
              </Link>
            )}
            <div className="flex gap-1">
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
                <Link
                  key={p}
                  href={`/seniors/${id}/notes?page=${p}`}
                  className={`w-9 h-9 flex items-center justify-center text-sm rounded-lg transition-colors ${
                    p === currentPage
                      ? "bg-indigo-600 text-white"
                      : "border border-gray-200 hover:bg-gray-50 text-gray-600"
                  }`}
                >
                  {p}
                </Link>
              ))}
            </div>
            {currentPage < totalPages && (
              <Link
                href={`/seniors/${id}/notes?page=${currentPage + 1}`}
                className="px-4 py-2 text-sm border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
              >
                次へ →
              </Link>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
