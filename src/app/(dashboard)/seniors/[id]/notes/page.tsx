import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { redirect, notFound } from "next/navigation";
import Link from "next/link";
import { BackButton } from "@/app/components/BackButton";
import { CareNoteActions } from "@/app/components/CareNoteActions";

const PER_PAGE = 10;

export default async function CareNotesPage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ page?: string }>;
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

  const senior = await prisma.senior.findUnique({
    where: { id },
    select: { name: true },
  });

  const total = await prisma.careNote.count({
    where: { seniorId: id },
  });

  const totalPages = Math.ceil(total / PER_PAGE);

  const notes = await prisma.careNote.findMany({
    where: { seniorId: id },
    orderBy: { createdAt: "desc" },
    skip: (currentPage - 1) * PER_PAGE,
    take: PER_PAGE,
    include: {
      user: { select: { name: true, id: true } },
    },
  });

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navbar */}
      <nav className="bg-white border-b border-gray-100 px-4 py-4 sticky top-0 z-10 pl-16">
        <div className="max-w-2xl mx-auto flex items-center gap-3">
          <Link
            href={`/seniors/${id}`}
            className="flex items-center gap-1.5 text-indigo-600 hover:underline transition-colors text-sm font-medium"
          >
            <span className="text-lg">←</span>
            <span>戻る</span>
          </Link>
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-indigo-600 flex items-center justify-center">
              <span className="text-white text-sm">♡</span>
            </div>
            <p className="font-semibold text-gray-900">ケアノート</p>
          </div>
        </div>
      </nav>

      <div className="max-w-2xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-semibold text-gray-900">ケアノート</h1>
            <p className="text-base text-gray-400 mt-1">
              {senior?.name}さん · 全{total}件
            </p>
          </div>
          <Link
            href={`/seniors/${id}/notes/new`}
            className="px-4 py-2.5 bg-indigo-600 text-white text-sm font-semibold rounded-xl hover:bg-indigo-700 transition-colors shadow-sm"
          >
            ＋ 追加
          </Link>
        </div>

        {/* List */}
        <div className="bg-white border border-gray-100 rounded-2xl overflow-hidden shadow-sm mb-6">
          {notes.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-4xl mb-3">📝</p>
              <p className="text-base text-gray-400">まだノートがありません</p>
            </div>
          ) : (
            <div className="divide-y divide-gray-50">
              {notes.map((note, index) => (
                <div
                  key={note.id}
                  className="px-5 py-4 hover:bg-gray-50 transition-colors"
                >
                  <div className="flex items-start gap-3">
                    <span className="text-sm text-gray-300 w-6 mt-0.5 flex-shrink-0">
                      {(currentPage - 1) * PER_PAGE + index + 1}
                    </span>
                    <div className="flex-1">
                      <p className="text-base text-gray-800 leading-relaxed mb-2">
                        {note.content}
                      </p>
                      <div className="flex items-center gap-2">
                        <p className="text-sm text-gray-400 font-medium">
                          {note.user.name}
                        </p>
                        <p className="text-xs text-gray-300">·</p>
                        <p className="text-sm text-gray-300">
                          {new Date(note.createdAt).toLocaleDateString(
                            "ja-JP",
                            {
                              timeZone: "Asia/Tokyo",
                              month: "short",
                              day: "numeric",
                            },
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
                      <CareNoteActions
                        noteId={note.id}
                        seniorId={id}
                        content={note.content}
                        isOwner={note.user.id === session.user.id}
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex items-center justify-between gap-2">
            {currentPage > 1 ? (
              <Link
                href={`/seniors/${id}/notes?page=${currentPage - 1}`}
                className="px-5 py-2.5 text-sm font-medium border border-gray-200 rounded-xl hover:bg-gray-50 transition-colors"
              >
                ← 前へ
              </Link>
            ) : (
              <div />
            )}

            <p className="text-sm text-gray-400">
              {currentPage} / {totalPages} ページ
            </p>

            {currentPage < totalPages ? (
              <Link
                href={`/seniors/${id}/notes?page=${currentPage + 1}`}
                className="px-5 py-2.5 text-sm font-medium border border-gray-200 rounded-xl hover:bg-gray-50 transition-colors"
              >
                次へ →
              </Link>
            ) : (
              <div />
            )}
          </div>
        )}
      </div>
    </div>
  );
}
