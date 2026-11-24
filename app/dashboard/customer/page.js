"use client";
import Link from "next/link";
import { FiCalendar, FiClock, FiCheckCircle, FiXCircle, FiArrowRight } from "react-icons/fi";
import { authClient } from "@/lib/auth-client";
import { useApi } from "@/lib/useApi";
import { PageTitle } from "@/components/DashboardShell";
import StatCard from "@/components/StatCard";
import { PageLoader, ErrorBox, EmptyState, StatusBadge, SmartImage } from "@/components/ui";
import { formatDay, formatPrice } from "@/lib/utils";

export default function CustomerOverview() {
  const { data: session } = authClient.useSession();
  const stats = useApi("/api/appointments/my/stats");
  const list = useApi("/api/appointments/my");

  if (stats.loading || list.loading) return <PageLoader text="Loading your dashboard…" />;
  if (stats.error || list.error) return <ErrorBox message={stats.error || list.error} onRetry={() => { stats.reload(); list.reload(); }} />;

  const recent = list.data.slice(0, 4);
  return (
    <>
      <PageTitle title={`Hello, ${session?.user?.name?.split(" ")[0] || "there"}`} text="Here is a quick look at your appointments." />
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard icon={FiCalendar} label="Total Requests" value={stats.data.total} />
        <StatCard icon={FiClock} label="Pending" value={stats.data.pending} tone="amber" />
        <StatCard icon={FiCheckCircle} label="Confirmed" value={stats.data.confirmed} tone="emerald" />
        <StatCard icon={FiXCircle} label="Cancelled" value={stats.data.cancelled} tone="rose" />
      </div>

      <div className="mt-8 flex items-center justify-between">
        <h2 className="text-3xl font-bold text-sage-900">Recent appointments</h2>
        <Link href="/dashboard/customer/appointments" className="flex items-center gap-1 text-sm font-bold text-sage-800 hover:text-clay-600">View all <FiArrowRight /></Link>
      </div>
      <div className="mt-4 space-y-3">
        {recent.length === 0 ? (
          <EmptyState title="No appointments yet" text="Pick a service and request your first appointment." action={<Link href="/services" className="btn-dark btn-sm">Browse Services</Link>} />
        ) : (
          recent.map((a) => (
            <div key={a._id} className="card flex flex-wrap items-center gap-4 p-4">
              <SmartImage src={a.service?.image} alt="" className="h-14 w-14 rounded-sm" />
              <div className="min-w-0 flex-1">
                <p className="truncate font-bold text-sage-900">{a.service?.serviceName || "Deleted service"}</p>
                <p className="text-xs text-muted">{formatDay(a.appointmentDate)} · {a.timeSlot} · {formatPrice(a.servicePrice)}</p>
              </div>
              <StatusBadge status={a.status} />
            </div>
          ))
        )}
      </div>
    </>
  );
}
