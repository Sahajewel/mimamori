import { SideNav } from "@/app/components/SideNav";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-gray-50 flex">
      <SideNav />
      <div className="flex-1 ml-16 transition-all duration-300">{children}</div>
    </div>
  );
}
