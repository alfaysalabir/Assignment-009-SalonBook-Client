"use client";
import { useState } from "react";
import toast from "react-hot-toast";
import { FiEye, FiCheck, FiXCircle } from "react-icons/fi";
import { apiFetch } from "@/lib/api";
import { useApi } from "@/lib/useApi";
import { PageTitle } from "@/components/DashboardShell";
import AppointmentDetails from "@/components/AppointmentDetails";
import { PageLoader, ErrorBox, EmptyState, StatusBadge, SmartImage, Modal, ConfirmModal, TableWrap } from "@/components/ui";
import { formatDate, formatDay, formatPrice } from "@/lib/utils";

export default function ManageAppointmentsPage() {
  const { data, loading, error, reload } = useApi("/api/admin/appointments");
  const [filter, setFilter] = useState("all");
  const [details, setDetails] = useState(null);
  const [action, setAction] = useState(null); // { type: "confirm" | "cancel", appointment }
  const [busy, setBusy] = useState(false);

  async function runAction() {
    setBusy(true);
    try {
      const res = await apiFetch(`/api/admin/appointments/${action.appointment._id}/${action.type}`, { method: "PATCH" });
      toast.success(res.message);
      setAction(null);
      reload();
    } catch (err) {
      toast.error(err.message);
      setAction(null);
    } finally {
      setBusy(false);
    }
  }

  if (loading) return <PageLoader text="Loading appointments…" />;
  if (error) return <ErrorBox message={error} onRetry={reload} />;

  const list = filter === "all" ? data : data.filter((a) => a.status === filter);

  return (
    <>
      <PageTitle title="Manage Appointments" text="Review requests, confirm or cancel them." />
      <div className="mb-4 flex flex-wrap gap-2">
        {["all", "pending", "confirmed", "cancelled"].map((f) => (
          <button key={f} onClick={() => setFilter(f)} className={`cursor-pointer rounded-sm border px-4 py-1.5 text-xs font-bold capitalize ${filter === f ? "border-sage-900 bg-sage-900 text-white" : "border-line bg-white text-sage-800"}`}>
            {f}
          </button>
        ))}
      </div>

      {list.length === 0 ? (
        <EmptyState title="No appointments" text="Nothing to show in this view." />
      ) : (
        <TableWrap>
          <thead className="bg-paper-100">
            <tr>{["Customer", "Service", "Date & Time", "Price", "Status", "Payment", "Requested", "Actions"].map((h) => <th key={h} className="th">{h}</th>)}</tr>
          </thead>
          <tbody>
            {list.map((a) => (
              <tr key={a._id} className="border-t border-line">
                <td className="td">
                  <p className="font-bold text-sage-900">{a.customer?.name || "—"}</p>
                  <p className="text-xs text-muted">{a.customer?.email}</p>
                </td>
                <td className="td">
                  <div className="flex items-center gap-3">
                    <SmartImage src={a.service?.image} alt="" className="h-10 w-10 shrink-0 rounded-sm" />
                    <span className="font-semibold">{a.service?.serviceName || "Deleted service"}</span>
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
                      <button onClick={() => setAction({ type: "confirm", appointment: a })} className="btn-dark btn-sm"><FiCheck /> Confirm</button>
                    )}
                    {["pending", "confirmed"].includes(a.status) && (
                      <button onClick={() => setAction({ type: "cancel", appointment: a })} className="btn-outline btn-sm !border-rose-200 !text-rose-600"><FiXCircle /> Cancel</button>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </TableWrap>
      )}

      <Modal open={!!details} onClose={() => setDetails(null)} title="Appointment details">
        {details && <AppointmentDetails a={details} showCustomer />}
      </Modal>
      <ConfirmModal
        open={!!action}
        onClose={() => setAction(null)}
        onConfirm={runAction}
        loading={busy}
        danger={action?.type === "cancel"}
        title={action?.type === "confirm" ? "Confirm appointment?" : "Cancel appointment?"}
        message={action?.type === "confirm" ? "The customer will be able to pay for this appointment." : "The customer will see this appointment as cancelled."}
        confirmText={action?.type === "confirm" ? "Confirm" : "Yes, Cancel"}
      />
    </>
  );
}
