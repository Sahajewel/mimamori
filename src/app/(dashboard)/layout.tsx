import { SideNav } from "@/app/components/SideNav";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-gray-50">
      <SideNav />
      {/* Desktop-এ left margin, Mobile-এ bottom padding */}
      <div className="md:ml-16 pb-20 md:pb-0">{children}</div>
    </div>
  );
}
