"use client";
import Link from "next/link";
import { useState } from "react";
import toast from "react-hot-toast";
import { FiEye, FiXCircle, FiCreditCard } from "react-icons/fi";
import { apiFetch } from "@/lib/api";
import { useApi } from "@/lib/useApi";
import { PageTitle } from "@/components/DashboardShell";
import AppointmentDetails from "@/components/AppointmentDetails";
import { PageLoader, ErrorBox, EmptyState, StatusBadge, SmartImage, Modal, ConfirmModal, TableWrap, Spinner } from "@/components/ui";
import { formatDate, formatDay, formatPrice, shortId } from "@/lib/utils";

const FILTERS = ["all", "pending", "confirmed", "cancelled"];

export default function MyAppointmentsPage() {
  const { data, loading, error, reload } = useApi("/api/appointments/my");
  const payments = useApi("/api/payments/my");
  const [tab, setTab] = useState("appointments");
  const [filter, setFilter] = useState("all");
  const [details, setDetails] = useState(null);
  const [toCancel, setToCancel] = useState(null);
  const [busy, setBusy] = useState(false);
  const [payingId, setPayingId] = useState(null);

  async function cancelAppointment() {
    setBusy(true);
    try {
      const res = await apiFetch(`/api/appointments/${toCancel._id}/cancel`, { method: "PATCH" });
      toast.success(res.message);
      setToCancel(null);
      reload();
    } catch (err) {
      toast.error(err.message);
    } finally {
      setBusy(false);
    }
  }

  async function payNow(a) {
    setPayingId(a._id);
    try {
      const { url } = await apiFetch("/api/payments/checkout-session", { method: "POST", body: { appointmentId: a._id } });
      window.location.href = url; // go to Stripe Checkout
    } catch (err) {
      toast.error(err.message);
      setPayingId(null);
    }
  }

  if (loading) return <PageLoader text="Loading your appointments…" />;
  if (error) return <ErrorBox message={error} onRetry={reload} />;

  const list = filter === "all" ? data : data.filter((a) => a.status === filter);

  return (
    <>
      <PageTitle title="My Appointments" text="Track your requests, pay for confirmed visits and see your history." />

      <div className="mb-5 inline-flex rounded-full bg-white p-1 text-sm font-bold ring-1 ring-line">
        {[["appointments", "Appointments"], ["payments", "Payment History"]].map(([key, label]) => (
          <button key={key} onClick={() => setTab(key)} className={`cursor-pointer rounded-full px-5 py-2 transition ${tab === key ? "bg-plum-900 text-white" : "text-plum-800"}`}>
            {label}
          </button>
        ))}
      </div>

      {tab === "appointments" ? (
        <>
          <div className="mb-4 flex flex-wrap gap-2">
            {FILTERS.map((f) => (
              <button key={f} onClick={() => setFilter(f)} className={`cursor-pointer rounded-full border px-4 py-1.5 text-xs font-bold capitalize ${filter === f ? "border-plum-900 bg-plum-900 text-white" : "border-line bg-white text-plum-800"}`}>
                {f}
              </button>
            ))}
          </div>

          {list.length === 0 ? (
            <EmptyState title="Nothing here" text="You have no appointments in this view." action={<Link href="/services" className="btn-dark btn-sm">Browse Services</Link>} />
          ) : (
            <TableWrap>
              <thead className="bg-blush-100">
                <tr>
                  {["Service", "Date & Time", "Price", "Status", "Payment", "Requested", "Actions"].map((h) => <th key={h} className="th">{h}</th>)}
                </tr>
              </thead>
              <tbody>
                {list.map((a) => (
                  <tr key={a._id} className="border-t border-line">
                    <td className="td">
                      <div className="flex items-center gap-3">
                        <SmartImage src={a.service?.image} alt="" className="h-12 w-12 shrink-0 rounded-xl" />
                        <div>
                          <p className="font-bold text-plum-900">{a.service?.serviceName || "Deleted service"}</p>
                          <p className="text-xs text-muted">{a.service?.category}</p>
                        </div>
                      </div>
                    </td>
                    <td className="td whitespace-nowrap">{formatDay(a.appointmentDate)}<br /><span className="text-xs text-muted">{a.timeSlot}</span></td>
                    <td className="td font-semibold">{formatPrice(a.servicePrice)}</td>
                    <td className="td"><StatusBadge status={a.status} /></td>
                    <td className="td"><StatusBadge status={a.paymentStatus} /></td>
                    <td className="td whitespace-nowrap text-muted">{formatDate(a.createdAt)}</td>
                    <td className="td">
                      <div className="flex gap-2">
                        <button onClick={() => setDetails(a)} className="btn-outline btn-sm" aria-label="View details"><FiEye /></button>
                        {a.status === "pending" && (
                          <button onClick={() => setToCancel(a)} className="btn-outline btn-sm !border-rose-200 !text-rose-600"><FiXCircle /> Cancel</button>
                        )}
                        {a.status === "confirmed" && a.paymentStatus === "unpaid" && (
                          <button onClick={() => payNow(a)} disabled={payingId === a._id} className="btn-gold btn-sm">
                            {payingId === a._id ? <Spinner className="h-3.5 w-3.5" /> : <FiCreditCard />} {payingId === a._id ? "Redirecting…" : "Pay Now"}
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </TableWrap>
          )}
        </>
      ) : payments.loading ? (
        <PageLoader text="Loading payments…" />
      ) : payments.error ? (
        <ErrorBox message={payments.error} onRetry={payments.reload} />
      ) : payments.data.length === 0 ? (
        <EmptyState title="No payments yet" text="Your payments will appear here after you pay for a confirmed appointment." />
      ) : (
        <TableWrap>
          <thead className="bg-blush-100">
            <tr>{["Service", "Amount", "Reference", "Status", "Date"].map((h) => <th key={h} className="th">{h}</th>)}</tr>
          </thead>
          <tbody>
            {payments.data.map((t) => (
              <tr key={t._id} className="border-t border-line">
                <td className="td font-bold text-plum-900">{t.service?.serviceName || "Deleted service"}</td>
                <td className="td font-semibold">{formatPrice(t.amount)} <span className="uppercase text-muted">{t.currency}</span></td>
                <td className="td font-mono text-xs text-muted">{shortId(t.stripeSessionId)}</td>
                <td className="td"><StatusBadge status={t.status} /></td>
                <td className="td text-muted">{formatDate(t.createdAt)}</td>
              </tr>
            ))}
          </tbody>
        </TableWrap>
      )}

      <Modal open={!!details} onClose={() => setDetails(null)} title="Appointment details">
        {details && <AppointmentDetails a={details} />}
      </Modal>
      <ConfirmModal
        open={!!toCancel}
        onClose={() => setToCancel(null)}
        onConfirm={cancelAppointment}
        loading={busy}
        danger
        title="Cancel this request?"
        message="This pending appointment request will be cancelled. You can always book again later."
        confirmText="Yes, Cancel"
      />
    </>
  );
}
