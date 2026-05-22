import { SideNav } from "@/app/components/SideNav";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-gray-50">
      <SideNav />
      {/* Content সরবে না, full width */}
      {children}
    </div>
  );
}
