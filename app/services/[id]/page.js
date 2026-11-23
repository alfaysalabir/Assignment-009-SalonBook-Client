"use client";
import Link from "next/link";
import { use, useState } from "react";
import { FiClock, FiArrowLeft, FiTag, FiInfo } from "react-icons/fi";
import { authClient } from "@/lib/auth-client";
import { useApi } from "@/lib/useApi";
import { formatPrice } from "@/lib/utils";
import { PageLoader, ErrorBox, SmartImage, StatusBadge } from "@/components/ui";
import AppointmentForm from "@/components/AppointmentForm";

export default function ServiceDetailsPage({ params }) {
  const { id } = use(params);
  const { data: session } = authClient.useSession();
  const isAdmin = session?.user?.role === "admin";
  const { data: service, loading, error } = useApi(`/api/services/${id}`);
  const [showForm, setShowForm] = useState(false);

  if (loading) return <PageLoader text="Loading service…" />;
  if (error) {
    return (
      <div className="container-page py-16">
        <ErrorBox message={error} />
        <div className="mt-6 text-center">
          <Link href="/services" className="btn-dark"><FiArrowLeft /> Back to Services</Link>
        </div>
      </div>
    );
  }

  const bookable = service.status === "active" && !isAdmin;

  return (
    <div className="container-page py-10">
      <Link href="/services" className="mb-6 inline-flex items-center gap-2 text-sm font-semibold text-plum-800 hover:text-gold-600">
        <FiArrowLeft /> Back to Services
      </Link>

      <div className="grid gap-10 lg:grid-cols-2">
        <div className="overflow-hidden rounded-[2rem]">
          <SmartImage src={service.image} alt={service.serviceName} className="h-[360px] w-full sm:h-[480px]" />
        </div>

        <div>
          <span className="inline-flex items-center gap-1.5 rounded-full bg-blush-100 px-3 py-1 text-xs font-bold text-plum-800">
            <FiTag size={12} /> {service.category}
          </span>
          <h1 className="mt-3 text-5xl font-bold leading-tight text-plum-900">{service.serviceName}</h1>

          <div className="mt-5 flex flex-wrap items-center gap-6">
            <span className="font-display text-5xl font-bold text-gold-600">{formatPrice(service.price)}</span>
            <span className="flex items-center gap-2 text-muted"><FiClock /> {service.duration} minutes</span>
            {service.status !== "active" && <StatusBadge status="inactive" />}
          </div>

          <p className="mt-6 leading-relaxed text-muted">{service.description}</p>

          {isAdmin && (
            <p className="mt-6 flex items-start gap-2 rounded-2xl bg-amber-50 p-4 text-sm text-amber-800">
              <FiInfo className="mt-0.5 shrink-0" /> Admins can&apos;t submit appointment requests. Use a customer account to book.
            </p>
          )}
          {service.status !== "active" && (
            <p className="mt-6 flex items-start gap-2 rounded-2xl bg-slate-100 p-4 text-sm text-slate-700">
              <FiInfo className="mt-0.5 shrink-0" /> This service is inactive and cannot be booked.
            </p>
          )}

          {bookable && !showForm && (
            <button onClick={() => setShowForm(true)} className="btn-dark mt-8">Book Appointment</button>
          )}
          {bookable && showForm && <AppointmentForm service={service} onCancel={() => setShowForm(false)} />}
        </div>
      </div>
    </div>
  );
}
