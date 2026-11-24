"use client";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { useSearchParams } from "next/navigation";
import { FiCheckCircle, FiClock, FiAlertCircle } from "react-icons/fi";
import { apiFetch } from "@/lib/api";
import { formatPrice } from "@/lib/utils";
import { PageLoader, Spinner } from "@/components/ui";

// This page only SHOWS the result. The payment is marked "paid" by the verified Stripe webhook on the server.
export default function PaymentSuccess() {
  const sessionId = useSearchParams().get("session_id");
  const [info, setInfo] = useState(null);
  const [error, setError] = useState("");
  const [tries, setTries] = useState(0);
  const timer = useRef(null);

  useEffect(() => {
    if (!sessionId) {
      setError("No payment session found.");
      return;
    }
    let stop = false;
    async function check(attempt) {
      try {
        const data = await apiFetch(`/api/payments/session/${sessionId}`);
        if (stop) return;
        setInfo(data);
        setTries(attempt);
        // webhooks can take a few seconds - check again until the server says "paid"
        if (data.appointmentPaymentStatus !== "paid" && attempt < 8) {
          timer.current = setTimeout(() => check(attempt + 1), 2000);
        }
      } catch (err) {
        if (!stop) setError(err.message);
      }
    }
    check(1);
    return () => {
      stop = true;
      clearTimeout(timer.current);
    };
  }, [sessionId]);

  if (error) {
    return (
      <Result icon={<FiAlertCircle size={42} className="text-rose-500" />} title="We couldn't check your payment" text={error} />
    );
  }
  if (!info) return <PageLoader text="Confirming your payment…" />;

  const paid = info.appointmentPaymentStatus === "paid";
  return paid ? (
    <Result
      icon={<FiCheckCircle size={46} className="text-emerald-500" />}
      title="Payment successful!"
      text={`Thank you! We received ${formatPrice(info.amount)}. Your appointment is paid and confirmed.`}
    />
  ) : (
    <Result
      icon={tries < 8 ? <Spinner className="h-10 w-10 text-sage-700" /> : <FiClock size={42} className="text-amber-500" />}
      title={tries < 8 ? "Confirming your payment…" : "Payment is being processed"}
      text={
        tries < 8
          ? "Please wait a moment while we verify your payment with Stripe."
          : "Your payment is taking a little longer than usual. Check My Appointments in a few minutes."
      }
    />
  );
}

function Result({ icon, title, text }) {
  return (
    <section className="container-page grid min-h-[60vh] place-items-center py-10">
      <div className="card max-w-lg p-10 text-center">
        <div className="mb-4 grid place-items-center">{icon}</div>
        <h1 className="text-4xl font-bold text-sage-900">{title}</h1>
        <p className="mt-3 text-muted">{text}</p>
        <Link href="/dashboard/customer/appointments" className="btn-dark mt-7">View My Appointments</Link>
      </div>
    </section>
  );
}
