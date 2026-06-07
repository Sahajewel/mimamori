import { DashboardButton } from "@/app/components/DashboardButton";
import { DashboardClient } from "@/app/components/DashboardClient ";
import { DashboardLogo } from "@/app/components/DashboardLogo";

import { NotificationButton } from "@/app/components/NotificationButton";
import { VisibilityRefresh } from "@/app/components/VisibilityRefresh";
import { auth } from "@/lib/auth";
import { japanHour, startOfJapanToday } from "@/lib/japanTime";
import { prisma } from "@/lib/prisma";

import { redirect } from "next/navigation";

export default async function DashboardPage() {
  const session = await auth();
  if (!session?.user?.id) redirect("/login");

  const seniorMembers = await prisma.seniorMember.findMany({
    where: { userId: session.user.id },
    include: {
      senior: {
        include: {
          checkIns: {
            orderBy: { createdAt: "desc" },
            take: 1,
          },
          medicines: {
            where: { active: true },
            include: {
              reminders: true,
              logs: {
                where: {
                  createdAt: {
                    gte: startOfJapanToday(),
                  },
                },
              },
            },
          },
        },
      },
    },
    orderBy: { createdAt: "asc" },
  });
  const now = new Date();

  const hour = japanHour();

  function getGreeting() {
    if (hour >= 5 && hour < 11) return "おはようございます";
    if (hour >= 11 && hour < 17) return "こんにちは";
    return "こんばんは";
  }

  return (
    <div className="min-h-screen bg-gray-50 pb-24">
      <VisibilityRefresh></VisibilityRefresh>
      <nav className="bg-white border-b border-gray-100 px-4 py-4 sticky top-0 z-10">
        <div className="max-w-4xl mx-auto flex items-center justify-between pl-12">
          <DashboardLogo></DashboardLogo>
          <div className="flex items-center gap-3">
            <DashboardButton></DashboardButton>

            <p className="text-sm text-gray-500 hidden sm:block">
              {session.user.name}さん
            </p>
          </div>
        </div>
      </nav>

      <div className="px-4 md:px-8 py-8 max-w-4xl mx-auto">
        <div className="mb-6">
          <h1 className="text-2xl md:text-3xl font-semibold text-gray-900">
            {getGreeting()}、{session.user.name}さん 👋
          </h1>
          <p className="text-base text-gray-400 mt-1">
            {now.toLocaleDateString("ja-JP", {
              timeZone: "Asia/Tokyo",
              year: "numeric",
              month: "long",
              day: "numeric",
              weekday: "long",
            })}
          </p>
        </div>
        <div className="mb-2">
          <NotificationButton></NotificationButton>
        </div>
        <DashboardClient
          seniorMembers={seniorMembers.map((m) => ({
            role: m.role,
            senior: {
              id: m.senior.id,
              name: m.senior.name,
              age: m.senior.age,
              photoUrl: m.senior.photoUrl,
              checkIns: m.senior.checkIns.map((c) => ({
                status: c.status,
                createdAt: c.createdAt.toISOString(),
              })),
              medicines: m.senior.medicines.map((med) => ({
                reminders: med.reminders.map((r) => ({ id: r.id })),
                logs: med.logs.map((l) => ({ status: l.status })),
              })),
            },
          }))}
          now={now.toISOString()}
        />
      </div>
    </div>
  );
}
