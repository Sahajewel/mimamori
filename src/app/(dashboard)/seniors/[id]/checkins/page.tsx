import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { redirect, notFound } from "next/navigation";
import Link from "next/link";
import { CheckInsClient } from "@/app/components/CheckInsClient";

const PER_PAGE = 10;

export default async function CheckInsPage({
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

  const total = await prisma.checkIn.count({ where: { seniorId: id } });
  const totalPages = Math.ceil(total / PER_PAGE);

  const checkIns = await prisma.checkIn.findMany({
    where: { seniorId: id },
    orderBy: { createdAt: "desc" },
    skip: (currentPage - 1) * PER_PAGE,
    take: PER_PAGE,
    include: { user: { select: { name: true, id: true } } },
  });

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white border-b border-gray-100 px-4 py-4 sticky top-0 z-10 pl-16">
        <div className="max-w-2xl mx-auto flex items-center gap-3">
          {/* pagination history এ আটকাবে না */}
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
            <p className="font-semibold text-gray-900">チェックイン履歴</p>
          </div>
        </div>
      </nav>

      <div className="max-w-2xl mx-auto px-4 py-8">
        <CheckInsClient
          checkIns={checkIns.map((c) => ({
            ...c,
            createdAt: c.createdAt,
          }))}
          seniorId={id}
          seniorName={senior?.name ?? ""}
          total={total}
          currentPage={currentPage}
          totalPages={totalPages}
        />
      </div>
    </div>
  );
}
