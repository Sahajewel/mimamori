import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { redirect, notFound } from "next/navigation";
import { SeniorBackLink } from "@/app/components/SeniorBackLink";
import { CareNotesClient } from "@/app/components/CareNotesClient";

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
      <nav className="bg-white border-b border-gray-100 px-4 py-4 sticky top-0 z-10 pl-16">
        <div className="max-w-2xl mx-auto flex items-center gap-3">
          <SeniorBackLink seniorId={id} />
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-indigo-600 flex items-center justify-center">
              <span className="text-white text-sm">♡</span>
            </div>
            <p className="font-semibold text-gray-900">ケアノート</p>
          </div>
        </div>
      </nav>

      <div className="max-w-2xl mx-auto px-4 py-8">
        <CareNotesClient
          notes={notes.map((n) => ({
            id: n.id,
            content: n.content,
            createdAt: n.createdAt,
            user: n.user,
            // authorName: n.user?.name ?? null,
          }))}
          seniorId={id}
          seniorName={senior?.name ?? ""}
          total={total}
          currentPage={currentPage}
          totalPages={totalPages}
          currentUserId={session.user.id}
          currentUserRole={member.role}
        />
      </div>
    </div>
  );
}
