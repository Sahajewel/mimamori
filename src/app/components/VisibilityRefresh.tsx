"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";

export function VisibilityRefresh() {
  const router = useRouter();
  useEffect(() => {
    function onVisible() {
      if (!document.hidden) router.refresh();
    }
    document.addEventListener("visibilitychange", onVisible);
    return () => document.removeEventListener("visibilitychange", onVisible);
  }, [router]);
  return null;
}
