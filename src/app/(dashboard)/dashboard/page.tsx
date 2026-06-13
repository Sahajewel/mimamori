// app/dashboard/page.tsx (Server Component)
import { DashboardButton } from "@/app/components/DashboardButton";
import { DashboardClient } from "@/app/components/DashboardClient ";
import { DashboardLogo } from "@/app/components/DashboardLogo";

import { VisibilityRefresh } from "@/app/components/VisibilityRefresh";
import { auth } from "@/lib/auth";
import { japanHour, startOfJapanToday } from "@/lib/japanTime";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import { CalendarDays, Sparkles } from "lucide-react";

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
    <div className="min-h-screen bg-linear-to-br from-gray-50 via-white to-indigo-50/20 pb-24">
      <VisibilityRefresh />
      {/* Modern glass nav */}
      <nav className="bg-white/80 backdrop-blur-md border-b border-gray-100/50 px-3 sm:px-4 py-4 sticky top-0 z-10 shadow-sm overflow-hidden">
        <div className="max-w-5xl mx-auto flex items-center justify-between gap-2">
          {/* Logo */}
          <div className="flex-shrink-0 min-w-0">
            <DashboardLogo />
          </div>

          {/* Dashboard Button */}
          <div className="shrink-0">
            <DashboardButton />
          </div>
        </div>
      </nav>

      <div className="px-4 md:px-8 py-8 max-w-5xl mx-auto">
        {/* Greeting with modern layout */}
        <div className="mb-8 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <div>
            <h1 className="text-3xl md:text-4xl font-bold bg-linear-to-r from-gray-900 to-indigo-800 bg-clip-text text-transparent">
              {getGreeting()}、{session.user.name}さん 👋
            </h1>
            <div className="flex items-center gap-2 mt-2 text-gray-500">
              <CalendarDays className="w-4 h-4" />
              <p className="text-base">
                {now.toLocaleDateString("ja-JP", {
                  timeZone: "Asia/Tokyo",
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                  weekday: "long",
                })}
              </p>
            </div>
          </div>
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
