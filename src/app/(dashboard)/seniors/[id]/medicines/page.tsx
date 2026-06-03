import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { redirect, notFound } from "next/navigation";
import { SeniorBackLink } from "@/app/components/SeniorBackLink";
import { MedicineHistoryClient } from "@/app/components/MedicineHistoryClient";

const PER_PAGE = 10;

export default async function MedicineHistoryPage({
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

  const today = new Date(
    new Date().toLocaleString("en-US", { timeZone: "Asia/Tokyo" }),
  );
  today.setHours(0, 0, 0, 0);

  const total = await prisma.medicine.count({
    where: {
      seniorId: id,
      ongoing: false,
      endDate: { lte: today },
    },
  });

  const totalPages = Math.ceil(total / PER_PAGE);

  const medicines = await prisma.medicine.findMany({
    where: {
      seniorId: id,
      ongoing: false,
      endDate: { lte: today },
    },
    orderBy: { endDate: "desc" },
    skip: (currentPage - 1) * PER_PAGE,
    take: PER_PAGE,
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
            <p className="font-semibold text-gray-900">服薬履歴</p>
          </div>
        </div>
      </nav>

      <div className="max-w-2xl mx-auto px-4 py-8">
        <MedicineHistoryClient
          medicines={medicines.map((m) => ({
            id: m.id,
            name: m.name,
            dosage: m.dosage,
            startDate: m.startDate,
            endDate: m.endDate,
            duration: m.duration,
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
