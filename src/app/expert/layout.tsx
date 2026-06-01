import DashboardLayout from "@/components/layout/dashboard-layout";

export const dynamic = "force-dynamic";

export default function ExpertLayout({ children }: { children: React.ReactNode }) {
  return <DashboardLayout>{children}</DashboardLayout>;
}