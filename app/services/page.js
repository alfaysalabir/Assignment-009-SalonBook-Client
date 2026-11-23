import { Suspense } from "react";
import BrowseServices from "@/components/BrowseServices";
import { PageLoader } from "@/components/ui";

export const metadata = { title: "Browse Services | SalonBook" };

export default function ServicesPage() {
  return (
    <Suspense fallback={<PageLoader />}>
      <BrowseServices />
    </Suspense>
  );
}
