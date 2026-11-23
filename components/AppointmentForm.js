"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { apiFetch } from "@/lib/api";
import { useApi } from "@/lib/useApi";
import { todayString } from "@/lib/utils";
import { Spinner } from "@/components/ui";

export default function AppointmentForm({ service, onCancel }) {
  const router = useRouter();
  const [date, setDate] = useState("");
  const [slot, setSlot] = useState("");
  const [message, setMessage] = useState("");
  const [submitting, setSubmitting] = useState(false);

  // free / booked slots for the chosen date
  const slots = useApi(`/api/services/${service._id}/slots?date=${date}`, { enabled: !!date });

  async function handleSubmit(e) {
    e.preventDefault();
    if (!date) return toast.error("Please choose an appointment date");
    if (date < todayString()) return toast.error("Appointment date cannot be in the past");
    if (!slot) return toast.error("Please choose a time slot");

    setSubmitting(true);
    try {
      const res = await apiFetch("/api/appointments", {
        method: "POST",
        body: { serviceId: service._id, appointmentDate: date, timeSlot: slot, message },
      });
      toast.success(res.message);
      router.push("/dashboard/customer/appointments");
    } catch (err) {
      toast.error(err.message); // includes "slot already booked" conflicts
      setSubmitting(false);
      if (date) slots.reload();
    }
  }

  return (
    <form onSubmit={handleSubmit} className="card mt-8 space-y-5 p-6" noValidate>
      <h3 className="text-3xl font-bold text-plum-900">Book your appointment</h3>

      <div>
        <label htmlFor="date" className="label">Appointment Date</label>
        <input
          id="date"
          type="date"
          min={todayString()}
          value={date}
          onChange={(e) => { setDate(e.target.value); setSlot(""); }}
          className="input sm:max-w-xs"
        />
      </div>

      <div>
        <span className="label">Available Time Slot</span>
        {!date ? (
          <p className="text-sm text-muted">Choose a date to see the available times.</p>
        ) : slots.loading ? (
          <p className="flex items-center gap-2 text-sm text-muted"><Spinner className="h-4 w-4" /> Checking availability…</p>
        ) : slots.error ? (
          <p className="text-sm text-rose-600">{slots.error}</p>
        ) : (
          <div className="grid grid-cols-2 gap-2 sm:grid-cols-3 md:grid-cols-5">
            {slots.data?.map(({ time, available }) => (
              <button
                type="button"
                key={time}
                disabled={!available}
                onClick={() => setSlot(time)}
                className={`cursor-pointer rounded-xl border px-3 py-2.5 text-sm font-semibold transition disabled:cursor-not-allowed disabled:bg-slate-50 disabled:text-slate-400 disabled:line-through ${
                  slot === time ? "border-plum-900 bg-plum-900 text-white" : "border-line bg-white text-plum-900 hover:border-plum-700"
                }`}
              >
                {time}
              </button>
            ))}
          </div>
        )}
      </div>

      <div>
        <label htmlFor="message" className="label">Additional Message <span className="font-normal text-muted">(optional)</span></label>
        <textarea id="message" rows={3} maxLength={300} value={message} onChange={(e) => setMessage(e.target.value)} className="input" placeholder="Anything we should know?" />
      </div>

      <div className="flex flex-wrap gap-3">
        <button type="submit" disabled={submitting} className="btn-dark">
          {submitting && <Spinner className="h-4 w-4" />} {submitting ? "Sending request…" : "Send Appointment Request"}
        </button>
        <button type="button" onClick={onCancel} className="btn-outline" disabled={submitting}>Close</button>
      </div>
    </form>
  );
}
