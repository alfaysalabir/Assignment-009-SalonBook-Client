import { Suspense } from "react";
import PaymentSuccess from "@/components/PaymentSuccess";
import { PageLoader } from "@/components/ui";

export const metadata = { title: "Payment Successful | SalonBook" };

export default function Page() {
  return (
    <Suspense fallback={<PageLoader />}>
      <PaymentSuccess />
    </Suspense>
  );
}
