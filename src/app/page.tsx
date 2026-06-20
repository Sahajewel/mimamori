// app/page.tsx
import { Suspense } from "react";
import { HomeContent, PageLoader } from "@/app/components/HomeContent";

export default function HomePage() {
  return (
    <Suspense fallback={<PageLoader />}>
      <HomeContent />
    </Suspense>
  );
}
