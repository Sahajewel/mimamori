import { SideNav } from "@/app/components/SideNav";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="mr-6">
        <SideNav />
      </div>
      {/* Content সরবে না, full width */}
      {children}
    </div>
  );
}
