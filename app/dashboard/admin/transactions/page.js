"use client";
import { useApi } from "@/lib/useApi";
import { PageTitle } from "@/components/DashboardShell";
import { PageLoader, ErrorBox, EmptyState, StatusBadge, TableWrap } from "@/components/ui";
import { formatDate, formatDay, formatPrice, shortId } from "@/lib/utils";

export default function TransactionsPage() {
  const { data, loading, error, reload } = useApi("/api/admin/transactions");

  if (loading) return <PageLoader text="Loading transactions…" />;
  if (error) return <ErrorBox message={error} onRetry={reload} />;

  return (
    <>
      <PageTitle title="Transactions" text="Payments are recorded automatically from verified Stripe events. They cannot be edited." />
      {data.length === 0 ? (
        <EmptyState title="No transactions yet" text="Paid appointments will show up here." />
      ) : (
        <TableWrap>
          <thead className="bg-blush-100">
            <tr>{["Customer", "Service", "Appointment", "Amount", "Currency", "Stripe Session", "Status", "Date"].map((h) => <th key={h} className="th">{h}</th>)}</tr>
          </thead>
          <tbody>
            {data.map((t) => (
              <tr key={t._id} className="border-t border-line">
                <td className="td">
                  <p className="font-bold text-plum-900">{t.customer?.name || "—"}</p>
                  <p className="text-xs text-muted">{t.customer?.email}</p>
                </td>
                <td className="td font-semibold">{t.service?.serviceName || "Deleted service"}</td>
                <td className="td whitespace-nowrap text-muted">{t.appointment ? `${formatDay(t.appointment.appointmentDate)} · ${t.appointment.timeSlot}` : "—"}</td>
                <td className="td font-semibold">{formatPrice(t.amount)}</td>
                <td className="td uppercase text-muted">{t.currency}</td>
                <td className="td font-mono text-xs text-muted">{shortId(t.stripeSessionId)}</td>
                <td className="td"><StatusBadge status={t.status} /></td>
                <td className="td whitespace-nowrap text-muted">{formatDate(t.createdAt)}</td>
              </tr>
            ))}
          </tbody>
        </TableWrap>
      )}
    </>
  );
}
