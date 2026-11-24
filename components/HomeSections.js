"use client";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { FiSearch, FiArrowRight, FiPlus, FiMinus, FiCheckCircle } from "react-icons/fi";
import { useApi } from "@/lib/useApi";
import { CATEGORIES, HERO_IMAGE, ABOUT_IMAGE } from "@/lib/constants";
import ServiceCard, { ServiceCardSkeleton } from "@/components/ServiceCard";
import { SectionHeading, SmartImage, ErrorBox, EmptyState } from "@/components/ui";

/* ---------- 1. Banner: split layout, photo fills the right half ---------- */
export function Hero() {
  const router = useRouter();
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("");

  function handleSearch(e) {
    e.preventDefault();
    const params = new URLSearchParams();
    if (search.trim()) params.set("search", search.trim());
    if (category) params.set("category", category);
    router.push(`/services${params.toString() ? `?${params}` : ""}`);
  }

  return (
    <>
      <section className="relative overflow-hidden border-b border-sage-900 bg-paper-50">
        {/* salon background image (right half on desktop) */}
        <div
          role="img"
          aria-label="Inside a calm, modern hair salon"
          className="absolute inset-y-0 right-0 hidden w-[46%] bg-sage-800 bg-cover bg-center lg:block"
          style={{ backgroundImage: `url(${HERO_IMAGE})` }}
        />
        <div className="absolute inset-y-0 right-0 hidden w-[46%] bg-sage-950/20 lg:block" />

        <div className="container-page relative grid min-h-[640px] items-center gap-10 py-14 lg:grid-cols-[1.15fr_0.85fr] lg:py-20">
          <div className="fade-up max-w-2xl lg:pr-10">
            <span className="eyebrow">Hair · Skin · Spa · Dhaka</span>
            <h1 className="mt-6 text-5xl leading-[1.02] text-sage-900 sm:text-6xl lg:text-[5.4rem]">
              Considered care, <em className="text-clay-500">booked</em> in minutes.
            </h1>
            <p className="mt-6 max-w-lg text-lg leading-relaxed text-muted">
              Discover signature hair, skin and spa services, choose the time that suits you and pay securely online.
            </p>

            <form onSubmit={handleSearch} className="mt-9 flex max-w-xl flex-col border border-sage-900 bg-white sm:flex-row">
              <div className="flex flex-1 items-center gap-2 px-4">
                <FiSearch className="shrink-0 text-muted" />
                <input
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Search a service…"
                  aria-label="Search services"
                  className="w-full bg-transparent py-4 text-sm text-ink outline-none placeholder:text-muted"
                />
              </div>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                aria-label="Category"
                className="border-t border-line bg-paper-100 px-4 py-4 text-sm text-sage-900 outline-none sm:max-w-[170px] sm:border-l sm:border-t-0"
              >
                <option value="">All Categories</option>
                {CATEGORIES.map((c) => (
                  <option key={c}>{c}</option>
                ))}
              </select>
              <button type="submit" className="btn-dark !rounded-none" aria-label="Search">
                <FiArrowRight size={16} />
              </button>
            </form>

            <div className="mt-7 flex flex-wrap items-center gap-4">
              <Link href="/services" className="btn-gold">
                Explore Salon Services <FiArrowRight size={14} />
              </Link>
              <Link href="/signup" className="btn-outline">Create Account</Link>
            </div>

            <dl className="mt-12 grid max-w-md grid-cols-3 border-t border-sage-900 pt-5">
              {[
                ["12+", "Expert stylists"],
                ["4.9", "Average rating"],
                ["2K+", "Happy clients"],
              ].map(([n, l], i) => (
                <div key={l} className={i ? "border-l border-line pl-4" : ""}>
                  <dt className="font-display text-4xl text-sage-900">{n}</dt>
                  <dd className="mt-1 text-xs uppercase tracking-wider text-muted">{l}</dd>
                </div>
              ))}
            </dl>
          </div>

          {/* mobile image */}
          <div
            role="img"
            aria-label="Inside a calm, modern hair salon"
            className="h-72 bg-sage-800 bg-cover bg-center sm:h-96 lg:hidden"
            style={{ backgroundImage: `url(${HERO_IMAGE})` }}
          />

          {/* floating note over the photo (desktop) */}
          <div className="hidden self-end lg:block">
            <div className="-ml-20 mb-4 max-w-[270px] border border-sage-900 bg-paper-50 p-5 shadow-[8px_8px_0_0_var(--color-sage-900)]">
              <p className="flex items-center gap-2 text-[11px] font-bold uppercase tracking-[0.18em] text-clay-600">
                <FiCheckCircle /> Online booking
              </p>
              <p className="mt-2 font-display text-2xl leading-snug text-sage-900">Request a slot, pay once it&apos;s confirmed.</p>
            </div>
          </div>
        </div>
      </section>

      {/* sliding strip of categories */}
      <div className="overflow-hidden bg-sage-900 py-4" aria-hidden="true">
        <div className="ticker font-display text-2xl text-paper-200">
          {[0, 1].map((k) => (
            <div key={k} className="flex shrink-0">
              {CATEGORIES.map((c) => (
                <span key={c + k} className="flex items-center whitespace-nowrap">
                  <span className="px-6">{c}</span>
                  <span className="text-clay-400">✦</span>
                </span>
              ))}
            </div>
          ))}
        </div>
      </div>
    </>
  );
}

/* ---------- 2. Featured services (dynamic) ---------- */
export function FeaturedServices() {
  const { data, loading, error, reload } = useApi("/api/services?limit=6&sort=newest", { auth: false });
  const services = data?.services || [];

  return (
    <section className="container-page py-24">
      <div className="flex flex-wrap items-end justify-between gap-6 border-b border-sage-900 pb-8">
        <SectionHeading eyebrow="Featured Services" title="Treatments our clients return for" />
        <Link href="/services" className="btn-outline">All services <FiArrowRight size={14} /></Link>
      </div>
      <div className="mt-12">
        {error ? (
          <ErrorBox message={error} onRetry={reload} />
        ) : loading ? (
          <div className="grid gap-x-8 gap-y-12 sm:grid-cols-2 lg:grid-cols-3">
            {Array.from({ length: 6 }).map((_, i) => <ServiceCardSkeleton key={i} />)}
          </div>
        ) : services.length === 0 ? (
          <EmptyState title="No services yet" text="Our menu is being prepared. Please check back soon." />
        ) : (
          <div className="grid gap-x-8 gap-y-12 sm:grid-cols-2 lg:grid-cols-3">
            {services.map((s) => <ServiceCard key={s._id} service={s} />)}
          </div>
        )}
      </div>
    </section>
  );
}

/* ---------- 3. Categories as a numbered index (dynamic) ---------- */
export function Categories() {
  const { data, loading, error } = useApi("/api/services/categories", { auth: false });
  const list = data || CATEGORIES.map((name) => ({ name, count: 0 }));

  return (
    <section className="border-y border-sage-900 bg-paper-100 py-24">
      <div className="container-page grid gap-12 lg:grid-cols-[0.8fr_1.6fr]">
        <div className="lg:sticky lg:top-28 lg:self-start">
          <SectionHeading
            eyebrow="Service Categories"
            title="Find your treatment"
            text="Pick a category and explore every service inside it."
          />
          {error && <p className="mt-4 text-sm text-rose-700">{error}</p>}
        </div>

        <ul className="border-t border-sage-900">
          {list.map((c, i) => (
            <li key={c.name}>
              <Link
                href={`/services?category=${encodeURIComponent(c.name)}`}
                className="group grid grid-cols-[3rem_1fr_auto] items-center gap-4 border-b border-line px-2 py-5 transition-all hover:bg-sage-900 hover:px-6 sm:grid-cols-[4.5rem_1fr_auto_2.5rem]"
              >
                <span className="font-display text-xl text-clay-500 group-hover:text-clay-300">{String(i + 1).padStart(2, "0")}</span>
                <span className="font-display text-2xl text-sage-900 group-hover:text-paper-50 sm:text-4xl">{c.name}</span>
                <span className="text-xs font-semibold uppercase tracking-wider text-muted group-hover:text-paper-200">
                  {loading ? "…" : `${c.count} service${c.count === 1 ? "" : "s"}`}
                </span>
                <FiArrowRight className="hidden justify-self-end text-sage-900 transition group-hover:translate-x-1 group-hover:text-clay-300 sm:block" />
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}

/* ---------- 4. Extra section: How it works ---------- */
export function HowItWorks() {
  const steps = [
    { title: "Choose a service", text: "Browse our menu, search by name and filter by category." },
    { title: "Request a time", text: "Pick your date and a time slot that fits your day." },
    { title: "Get confirmation", text: "Our team reviews and confirms your appointment." },
    { title: "Pay securely", text: "Pay online with Stripe from your dashboard." },
  ];
  return (
    <section className="container-page py-24">
      <div className="grid gap-8 lg:grid-cols-2 lg:items-end">
        <SectionHeading eyebrow="How It Works" title="Four easy steps to your next visit" />
        <p className="max-w-md text-muted lg:justify-self-end">
          No phone calls, no waiting. Send a request in a few clicks and we will take care of the rest.
        </p>
      </div>

      <ol className="mt-14 grid gap-x-8 gap-y-10 sm:grid-cols-2 lg:grid-cols-4">
        {steps.map((s, i) => (
          <li key={s.title} className="border-t-2 border-sage-900 pt-5">
            <span className="font-display text-6xl text-clay-500">{String(i + 1).padStart(2, "0")}</span>
            <h3 className="mt-4 text-2xl text-sage-900">{s.title}</h3>
            <p className="mt-2 text-sm leading-relaxed text-muted">{s.text}</p>
          </li>
        ))}
      </ol>

      <div className="mt-16 overflow-hidden">
        <SmartImage src={ABOUT_IMAGE} alt="Relaxing spa treatment" className="h-64 w-full sm:h-96" />
      </div>
    </section>
  );
}

/* ---------- 5. FAQ ---------- */
const faqs = [
  { q: "How do I book an appointment?", a: "Create a free account, open any service, choose a date and time slot and send your request. We will confirm it soon." },
  { q: "When do I pay?", a: "You pay after the salon confirms your appointment. Open My Appointments in your dashboard and press Pay Now." },
  { q: "Can I cancel my request?", a: "Yes. You can cancel any appointment while it is still pending from your dashboard." },
  { q: "Is online payment safe?", a: "Payments are handled by Stripe. We never see or store your card details." },
];

export function FAQ() {
  const [open, setOpen] = useState(0);
  return (
    <section className="border-t border-sage-900 bg-sage-900 py-24 text-paper-50">
      <div className="container-page grid gap-12 lg:grid-cols-[0.8fr_1.4fr]">
        <div>
          <span className="eyebrow !text-clay-300">Your Questions Answered</span>
          <h2 className="mt-3 text-4xl text-paper-50 sm:text-5xl">Frequently asked questions</h2>
        </div>
        <div className="border-t border-white/20">
          {faqs.map((f, i) => (
            <div key={f.q} className="border-b border-white/20">
              <button
                onClick={() => setOpen(open === i ? -1 : i)}
                aria-expanded={open === i}
                className="flex w-full cursor-pointer items-center justify-between gap-4 py-6 text-left font-display text-2xl"
              >
                {f.q}
                <span className="grid h-8 w-8 shrink-0 place-items-center border border-white/40">
                  {open === i ? <FiMinus size={14} /> : <FiPlus size={14} />}
                </span>
              </button>
              {open === i && <p className="max-w-xl pb-6 text-sm leading-relaxed text-paper-200">{f.a}</p>}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ---------- Final call to action ---------- */
export function CTA() {
  return (
    <section className="container-page py-24">
      <div className="grid items-center gap-8 border border-sage-900 bg-clay-500 p-8 text-white shadow-[10px_10px_0_0_var(--color-sage-900)] sm:p-14 lg:grid-cols-[1.4fr_1fr]">
        <h2 className="text-4xl leading-tight text-white sm:text-6xl">
          Ready for a little <em>me time?</em>
        </h2>
        <div className="lg:justify-self-end">
          <p className="max-w-sm text-white/90">Join SalonBook today and book your first appointment in minutes.</p>
          <Link href="/signup" className="mt-6 inline-flex items-center gap-2 bg-sage-900 px-7 py-4 text-xs font-bold uppercase tracking-[0.14em] text-paper-50 transition hover:bg-white hover:text-sage-900">
            Create Free Account <FiArrowRight size={14} />
          </Link>
        </div>
      </div>
    </section>
  );
}
