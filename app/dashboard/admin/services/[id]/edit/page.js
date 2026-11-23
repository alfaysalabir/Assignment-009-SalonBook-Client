"use client";
import { use } from "react";
import { useApi } from "@/lib/useApi";
import { PageTitle } from "@/components/DashboardShell";
import ServiceForm from "@/components/ServiceForm";
import { PageLoader, ErrorBox } from "@/components/ui";

export default function EditServicePage({ params }) {
  const { id } = use(params);
  const { data, loading, error, reload } = useApi(`/api/services/${id}`);

  if (loading) return <PageLoader text="Loading service…" />;
  if (error) return <ErrorBox message={error} onRetry={reload} />;

  return (
    <>
      <PageTitle title="Update Service" text={data.serviceName} />
      <ServiceForm service={data} />
    </>
  );
}
