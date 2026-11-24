"use client";
import { FiUsers, FiScissors, FiCalendar, FiClock, FiCheckCircle, FiCreditCard } from "react-icons/fi";
import { useApi } from "@/lib/useApi";
import { PageTitle } from "@/components/DashboardShell";
import StatCard from "@/components/StatCard";
import { PageLoader, ErrorBox, StatusBadge, SmartImage } from "@/components/ui";
import { formatDay, formatPrice } from "@/lib/utils";

export default function AdminOverview() {
  const stats = useApi("/api/admin/stats");
  const appts = useApi("/api/admin/appointments");

  if (stats.loading || appts.loading) return <PageLoader text="Loading dashboard data…" />;
  if (stats.error || appts.error) return <ErrorBox message={stats.error || appts.error} onRetry={() => { stats.reload(); appts.reload(); }} />;

  const s = stats.data;
  return (
    <>
      <PageTitle title="Admin Overview" text="A snapshot of your salon." />
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        <StatCard icon={FiUsers} label="Registered Customers" value={s.customers} />
        <StatCard icon={FiScissors} label="Active Services" value={s.activeServices} tone="gold" />
        <StatCard icon={FiCalendar} label="Total Appointment Requests" value={s.totalAppointments} />
        <StatCard icon={FiClock} label="Pending Appointments" value={s.pending} tone="amber" />
        <StatCard icon={FiCheckCircle} label="Confirmed Appointments" value={s.confirmed} tone="emerald" />
        <StatCard icon={FiCreditCard} label={`Successful Payments · ${formatPrice(s.revenue)}`} value={s.successfulPayments} tone="emerald" />
      </div>

      <h2 className="mb-4 mt-8 text-3xl font-bold text-sage-900">Latest requests</h2>
      <div className="space-y-3">
        {appts.data.slice(0, 5).map((a) => (
          <div key={a._id} className="card flex flex-wrap items-center gap-4 p-4">
            <SmartImage src={a.service?.image} alt="" className="h-14 w-14 rounded-sm" />
            <div className="min-w-0 flex-1">
              <p className="truncate font-bold text-sage-900">{a.service?.serviceName || "Deleted service"}</p>
              <p className="text-xs text-muted">{a.customer?.name} · {formatDay(a.appointmentDate)} · {a.timeSlot}</p>
            </div>
            <StatusBadge status={a.status} />
          </div>
        ))}
        {appts.data.length === 0 && <p className="text-sm text-muted">No appointment requests yet.</p>}
      </div>
    </>
  );
}
