// app/page.tsx
import { Suspense } from "react";
import { HomeContent, PageLoader } from "@/app/components/HomeContent";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export default async function HomePage() {
  const session = await auth();
  const testimonials = await prisma.feedback.findMany({
    where: {
      showOnLanding: true,
      comment: { not: null },
    },
    orderBy: { createdAt: "desc" },
    take: 6,
  });
  return (
    <Suspense fallback={<PageLoader />}>
      <HomeContent session={session} testimonials={testimonials} />
    </Suspense>
  );
}
