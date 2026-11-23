import AuthShell, { AuthFooterLink } from "@/components/AuthShell";
import { SignUpForm } from "@/components/AuthForms";

export const metadata = { title: "Sign Up | SalonBook" };

export default function SignUpPage() {
  return (
    <AuthShell
      title="Create account"
      subtitle="Join SalonBook and book your first visit."
      footer={<AuthFooterLink text="Already have an account?" href="/signin" label="Sign in" />}
    >
      <SignUpForm />
    </AuthShell>
  );
}
