"use client";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { FiSearch, FiArrowRight, FiStar, FiScissors, FiCalendar, FiCheckCircle, FiCreditCard, FiPlus, FiMinus } from "react-icons/fi";
import { useApi } from "@/lib/useApi";
import { CATEGORIES, HERO_IMAGE, HERO_ARCH_IMAGE, ABOUT_IMAGE } from "@/lib/constants";
import ServiceCard, { ServiceCardSkeleton } from "@/components/ServiceCard";
import { SectionHeading, SmartImage, ErrorBox, EmptyState } from "@/components/ui";

/* ---------- 1. Banner ---------- */
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
    <section
      className="relative overflow-hidden bg-plum-900 bg-cover bg-center text-white"
      style={{ backgroundImage: `url(${HERO_IMAGE})` }}
    >
      <div className="absolute inset-0 bg-gradient-to-r from-plum-950 via-plum-900/95 to-plum-800/70" />
      <div className="container-page relative grid items-center gap-12 py-16 lg:grid-cols-[1.1fr_0.9fr] lg:py-24">
        <div className="fade-up">
          <span className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-4 py-1.5 text-xs font-bold uppercase tracking-widest text-gold-300">
            <FiStar size={13} /> Top-rated salon experience
          </span>
          <h1 className="mt-6 text-5xl font-bold leading-[1.05] sm:text-6xl lg:text-7xl">
            Beauty, booked <span className="italic text-gold-400">beautifully.</span>
          </h1>
          <p className="mt-5 max-w-xl text-lg text-white/75">
            Discover signature hair, skin and spa services, choose the time that suits you and pay securely online. Self-care has never been this simple.
          </p>

          <form onSubmit={handleSearch} className="mt-8 flex max-w-xl flex-col gap-2 rounded-3xl bg-white p-2 sm:flex-row sm:items-center sm:rounded-full">
            <div className="flex flex-1 items-center gap-2 px-4">
              <FiSearch className="shrink-0 text-muted" />
              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search a service…"
                aria-label="Search services"
                className="w-full bg-transparent py-3 text-sm text-ink outline-none placeholder:text-muted"
              />
            </div>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              aria-label="Category"
              className="rounded-full bg-blush-100 px-4 py-3 text-sm text-plum-900 outline-none sm:max-w-[180px]"
            >
              <option value="">All Categories</option>
              {CATEGORIES.map((c) => (
                <option key={c}>{c}</option>
              ))}
            </select>
            <button type="submit" className="btn-dark" aria-label="Search">
              <FiArrowRight />
            </button>
          </form>

          <div className="mt-8 flex flex-wrap items-center gap-4">
            <Link href="/services" className="btn-gold">
              Explore Salon Services <FiArrowRight />
            </Link>
            <div className="flex items-center gap-3 text-sm text-white/80">
              <div className="flex -space-x-2">
                {["A", "M", "S", "R"].map((l, i) => (
                  <span key={l} className={`grid h-9 w-9 place-items-center rounded-full border-2 border-plum-900 text-xs font-bold text-plum-950 ${["bg-gold-400", "bg-blush-200", "bg-gold-300", "bg-blush-300"][i]}`}>
                    {l}
                  </span>
                ))}
              </div>
              Loved by 2K+ clients
            </div>
          </div>
        </div>

        {/* Arch image */}
        <div className="relative mx-auto hidden w-full max-w-md lg:block">
          <div className="overflow-hidden rounded-t-[200px] rounded-b-3xl border-8 border-white/10">
            <SmartImage src={HERO_ARCH_IMAGE} alt="Stylist working on a client" className="h-[480px] w-full" />
          </div>
          <div className="absolute -left-10 bottom-16 flex items-center gap-3 rounded-2xl bg-white p-4 text-plum-900 shadow-xl">
            <span className="grid h-11 w-11 place-items-center rounded-full bg-gold-400"><FiStar /></span>
            <div>
              <p className="font-display text-2xl font-bold leading-none">4.9 / 5</p>
              <p className="text-xs text-muted">Average rating</p>
            </div>
          </div>
          <div className="absolute -right-4 top-12 rounded-2xl bg-plum-950/90 px-4 py-3 text-center shadow-xl">
            <p className="font-display text-3xl font-bold text-gold-400">12+</p>
            <p className="text-xs text-white/70">Expert stylists</p>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ---------- 2. Featured services (dynamic) ---------- */
export function FeaturedServices() {
  const { data, loading, error, reload } = useApi("/api/services?limit=6&sort=newest", { auth: false });
  const services = data?.services || [];

  return (
    <section className="container-page py-20">
      <SectionHeading eyebrow="Featured Services" title="Treatments our clients adore" text="A hand-picked selection of our most loved services." />
      <div className="mt-12">
        {error ? (
          <ErrorBox message={error} onRetry={reload} />
        ) : loading ? (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {Array.from({ length: 6 }).map((_, i) => <ServiceCardSkeleton key={i} />)}
          </div>
        ) : services.length === 0 ? (
          <EmptyState title="No services yet" text="Our menu is being prepared. Please check back soon." />
        ) : (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {services.map((s) => <ServiceCard key={s._id} service={s} />)}
          </div>
        )}
      </div>
      <div className="mt-10 text-center">
        <Link href="/services" className="btn-outline">See All Services <FiArrowRight /></Link>
      </div>
    </section>
  );
}

/* ---------- 3. Categories (dynamic) ---------- */
export function Categories() {
  const { data, loading, error } = useApi("/api/services/categories", { auth: false });
  const list = data || CATEGORIES.map((name) => ({ name, count: 0 }));

  return (
    <section className="bg-white py-20">
      <div className="container-page">
        <SectionHeading eyebrow="Service Categories" title="Find your perfect treatment" text="Pick a category and explore every service inside it." />
        {error && <p className="mt-6 text-center text-sm text-rose-600">{error}</p>}
        <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {list.map((c, i) => (
            <Link
              key={c.name}
              href={`/services?category=${encodeURIComponent(c.name)}`}
              className={`group relative flex min-h-[150px] flex-col justify-between overflow-hidden rounded-3xl border border-line p-6 transition hover:-translate-y-1 hover:shadow-lg ${
                i % 4 === 0 ? "bg-blush-100" : i % 4 === 1 ? "bg-plum-900 text-white" : i % 4 === 2 ? "bg-blush-200" : "bg-gold-300/40"
              }`}
            >
              <FiScissors size={22} className={i % 4 === 1 ? "text-gold-400" : "text-gold-600"} />
              <div>
                <h3 className="text-2xl font-bold leading-tight">{c.name}</h3>
                <p className={`mt-1 flex items-center gap-1 text-xs font-semibold ${i % 4 === 1 ? "text-white/70" : "text-muted"}`}>
                  {loading ? "…" : `${c.count} service${c.count === 1 ? "" : "s"}`}
                  <FiArrowRight className="transition group-hover:translate-x-1" />
                </p>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ---------- 4. Extra section: How it works ---------- */
export function HowItWorks() {
  const steps = [
    { icon: FiSearch, title: "Choose a service", text: "Browse our menu, search by name and filter by category." },
    { icon: FiCalendar, title: "Request a time", text: "Pick your date and a time slot that fits your day." },
    { icon: FiCheckCircle, title: "Get confirmation", text: "Our team reviews and confirms your appointment." },
    { icon: FiCreditCard, title: "Pay securely", text: "Pay online with Stripe from your dashboard." },
  ];
  return (
    <section className="container-page grid items-center gap-12 py-20 lg:grid-cols-2">
      <div className="relative">
        <div className="overflow-hidden rounded-[2rem]">
          <SmartImage src={ABOUT_IMAGE} alt="Relaxing spa treatment" className="h-[420px] w-full lg:h-[520px]" />
        </div>
        <div className="absolute -bottom-5 right-4 rounded-2xl bg-plum-900 px-6 py-4 text-white shadow-xl sm:-right-5">
          <p className="font-display text-4xl font-bold text-gold-400">5 min</p>
          <p className="text-xs text-white/70">to book your visit</p>
        </div>
      </div>
      <div>
        <span className="eyebrow eyebrow-left">How It Works</span>
        <h2 className="mt-3 text-4xl font-bold text-plum-900 sm:text-5xl">Four easy steps to your next visit</h2>
        <div className="mt-8 grid gap-4 sm:grid-cols-2">
          {steps.map(({ icon: Icon, title, text }, i) => (
            <div key={title} className="card p-5">
              <div className="flex items-center justify-between">
                <span className="grid h-11 w-11 place-items-center rounded-full bg-plum-900 text-gold-300"><Icon size={18} /></span>
                <span className="font-display text-4xl font-bold text-blush-300">0{i + 1}</span>
              </div>
              <h3 className="mt-4 text-2xl font-bold text-plum-900">{title}</h3>
              <p className="mt-1 text-sm text-muted">{text}</p>
            </div>
          ))}
        </div>
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
    <section className="bg-blush-100 py-20">
      <div className="container-page">
        <SectionHeading eyebrow="Your Questions Answered" title="Frequently asked questions" />
        <div className="mx-auto mt-10 max-w-3xl space-y-3">
          {faqs.map((f, i) => (
            <div key={f.q} className="card overflow-hidden">
              <button
                onClick={() => setOpen(open === i ? -1 : i)}
                aria-expanded={open === i}
                className="flex w-full cursor-pointer items-center justify-between gap-4 p-5 text-left font-semibold text-plum-900"
              >
                {f.q}
                <span className="grid h-7 w-7 shrink-0 place-items-center rounded-full bg-plum-900 text-white">
                  {open === i ? <FiMinus size={14} /> : <FiPlus size={14} />}
                </span>
              </button>
              {open === i && <p className="px-5 pb-5 text-sm leading-relaxed text-muted">{f.a}</p>}
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
    <section className="container-page py-20">
      <div className="relative overflow-hidden rounded-[2rem] bg-plum-900 px-6 py-14 text-center text-white sm:px-12">
        <div className="absolute -right-16 -top-16 h-56 w-56 rounded-full bg-gold-400/20" />
        <div className="absolute -bottom-20 -left-10 h-56 w-56 rounded-full bg-plum-700/50" />
        <h2 className="relative text-4xl font-bold sm:text-5xl">Ready for a little <span className="italic text-gold-400">me time?</span></h2>
        <p className="relative mx-auto mt-3 max-w-lg text-white/70">Join SalonBook today and book your first appointment in minutes.</p>
        <Link href="/signup" className="btn-gold relative mt-7">Create Free Account <FiArrowRight /></Link>
      </div>
    </section>
  );
}
