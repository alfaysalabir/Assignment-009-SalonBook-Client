"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { authClient } from "@/lib/auth-client";
import { PageLoader } from "@/components/ui";

// /dashboard sends each user to the dashboard of their own role
export default function DashboardRedirect() {
  const router = useRouter();
  const { data: session, isPending } = authClient.useSession();

  useEffect(() => {
    if (isPending) return;
    if (!session?.user) router.replace("/signin?redirect=/dashboard");
    else router.replace(session.user.role === "admin" ? "/dashboard/admin" : "/dashboard/customer");
  }, [isPending, session, router]);

  return <PageLoader text="Taking you to your dashboard…" />;
}
