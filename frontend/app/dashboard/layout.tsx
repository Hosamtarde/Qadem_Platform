import DashboardNav from "@/components/dashboard-nav";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="relative min-h-screen">
      <div className="glow" />
      <div className="relative z-10 flex min-h-screen">
        <DashboardNav />
        <div className="min-w-0 flex-1">{children}</div>
      </div>
    </div>
  );
}
