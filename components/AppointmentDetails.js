import { SmartImage, StatusBadge } from "@/components/ui";
import { formatDate, formatDay, formatPrice } from "@/lib/utils";

const Row = ({ label, children }) => (
  <div className="flex items-start justify-between gap-4 border-b border-line py-2.5 text-sm last:border-0">
    <span className="text-muted">{label}</span>
    <span className="text-right font-semibold text-sage-900">{children}</span>
  </div>
);

export default function AppointmentDetails({ a, showCustomer = false }) {
  const s = a.service;
  return (
    <div>
      <div className="mb-4 flex gap-4">
        <SmartImage src={s?.image} alt={s?.serviceName} className="h-20 w-20 shrink-0 rounded-sm" />
        <div>
          <h4 className="text-2xl font-bold text-sage-900">{s?.serviceName || "Deleted service"}</h4>
          <p className="text-sm text-muted">{s?.category}</p>
        </div>
      </div>
      {showCustomer && (
        <>
          <Row label="Customer">{a.customer?.name || "—"}</Row>
          <Row label="Email">{a.customer?.email || "—"}</Row>
          {a.customer?.phone && <Row label="Phone">{a.customer.phone}</Row>}
        </>
      )}
      <Row label="Date">{formatDay(a.appointmentDate)}</Row>
      <Row label="Time">{a.timeSlot}</Row>
      <Row label="Price">{formatPrice(a.servicePrice)}</Row>
      <Row label="Status"><StatusBadge status={a.status} /></Row>
      <Row label="Payment"><StatusBadge status={a.paymentStatus} /></Row>
      <Row label="Requested on">{formatDate(a.createdAt)}</Row>
      <Row label="Message">{a.message || "—"}</Row>
    </div>
  );
}
