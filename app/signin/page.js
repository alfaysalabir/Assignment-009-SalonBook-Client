import { Suspense } from "react";
import AuthShell, { AuthFooterLink } from "@/components/AuthShell";
import { SignInForm } from "@/components/AuthForms";

export const metadata = { title: "Sign In | SalonBook" };

export default function SignInPage() {
  return (
    <AuthShell
      title="Welcome back"
      subtitle="Sign in to manage your appointments."
      footer={<AuthFooterLink text="New to SalonBook?" href="/signup" label="Create an account" />}
    >
      <Suspense fallback={null}>
        <SignInForm />
      </Suspense>
    </AuthShell>
  );
}
