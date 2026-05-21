import { BottomNav } from "@/app/components/BottomNav";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div>
      {children}
      <BottomNav />
      {/* Bottom padding so content not hidden behind nav */}
      <div className="h-20" />
    </div>
  );
}
