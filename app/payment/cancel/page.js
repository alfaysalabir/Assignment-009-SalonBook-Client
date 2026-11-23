import Link from "next/link";
import { FiXCircle } from "react-icons/fi";

export const metadata = { title: "Payment Cancelled | SalonBook" };

export default function PaymentCancelPage() {
  return (
    <section className="container-page grid min-h-[60vh] place-items-center py-10">
      <div className="card max-w-lg p-10 text-center">
        <FiXCircle size={46} className="mx-auto text-rose-500" />
        <h1 className="mt-4 text-4xl font-bold text-plum-900">Payment cancelled</h1>
        <p className="mt-3 text-muted">No money was taken. Your appointment is still waiting, so you can pay whenever you are ready.</p>
        <Link href="/dashboard/customer/appointments" className="btn-dark mt-7">Back to My Appointments</Link>
      </div>
    </section>
  );
}
