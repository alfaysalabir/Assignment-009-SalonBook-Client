import Link from "next/link";

export default function NotFound() {
  return (
    <section className="container-page grid min-h-[60vh] place-items-center text-center">
      <div>
        <p className="font-display text-8xl font-bold text-gold-500">404</p>
        <h1 className="mt-2 text-4xl font-bold text-plum-900">Page not found</h1>
        <p className="mt-2 text-muted">The page you are looking for does not exist or has moved.</p>
        <div className="mt-6 flex justify-center gap-3">
          <Link href="/" className="btn-dark">Go Home</Link>
          <Link href="/services" className="btn-outline">Browse Services</Link>
        </div>
      </div>
    </section>
  );
}
