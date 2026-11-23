import { PageTitle } from "@/components/DashboardShell";
import ServiceForm from "@/components/ServiceForm";

export default function AddServicePage() {
  return (
    <>
      <PageTitle title="Add New Service" text="Fill in the details and upload an image." />
      <ServiceForm />
    </>
  );
}
