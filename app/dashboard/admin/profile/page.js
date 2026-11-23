import { PageTitle } from "@/components/DashboardShell";
import ProfileForm from "@/components/ProfileForm";

export default function AdminProfilePage() {
  return (
    <>
      <PageTitle title="My Profile" text="Update your photo, name and phone number." />
      <ProfileForm />
    </>
  );
}
