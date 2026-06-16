import { AdminShell } from "@/components/admin/admin-shell";
import { DashboardCharts } from "@/components/admin/dashboard-charts";
import { DashboardKpis } from "@/components/admin/dashboard-kpis";
import { DashboardRecentActivity } from "@/components/admin/dashboard-recent-activity";
import { DashboardStatusSummary } from "@/components/admin/dashboard-status-summary";
import { buildDashboardStats } from "@/lib/admin/dashboard-stats";
import { requireAdminOrEditor } from "@/lib/admin/permissions";
import { getDashboardData } from "@/lib/admin/queries";

export const dynamic = "force-dynamic";

export default async function AdminDashboardPage() {
  const admin = await requireAdminOrEditor();
  const rawData = await getDashboardData();
  const stats = buildDashboardStats(rawData);

  return (
    <AdminShell
      admin={admin}
      title="Dashboard"
      description="Visão geral do portfólio e da operação."
    >
      <div className="space-y-8">
        <DashboardKpis items={stats.kpis} />

        <div className="grid gap-6 xl:grid-cols-2">
          <DashboardStatusSummary items={stats.charts.byStatus} />
          <DashboardRecentActivity items={stats.recentUpdates} />
        </div>

        <DashboardCharts
          data={stats.charts}
          hasProperties={stats.hasProperties}
        />
      </div>
    </AdminShell>
  );
}
