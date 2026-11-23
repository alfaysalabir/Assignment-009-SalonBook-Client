"use client";
import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { FiSearch, FiX } from "react-icons/fi";
import { useApi } from "@/lib/useApi";
import { CATEGORIES } from "@/lib/constants";
import ServiceCard, { ServiceCardSkeleton } from "@/components/ServiceCard";
import { ErrorBox, EmptyState } from "@/components/ui";

export default function BrowseServices() {
  const router = useRouter();
  const params = useSearchParams();

  const [search, setSearch] = useState(params.get("search") || "");
  const [debounced, setDebounced] = useState(search);
  const category = params.get("category") || "";
  const sort = params.get("sort") || "newest";

  // wait a little after typing before asking the server
  useEffect(() => {
    const t = setTimeout(() => setDebounced(search), 400);
    return () => clearTimeout(t);
  }, [search]);

  // keep the URL in sync so a page reload keeps the filters
  function updateUrl(next) {
    const q = new URLSearchParams(params.toString());
    Object.entries(next).forEach(([k, v]) => (v ? q.set(k, v) : q.delete(k)));
    router.replace(`/services${q.toString() ? `?${q}` : ""}`, { scroll: false });
  }
  useEffect(() => {
    if ((params.get("search") || "") !== debounced) updateUrl({ search: debounced });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [debounced]);

  const query = new URLSearchParams({ sort });
  if (debounced.trim()) query.set("search", debounced.trim());
  if (category) query.set("category", category);

  const { data, loading, error, reload } = useApi(`/api/services?${query}`, { auth: false });
  const services = data?.services || [];

  return (
    <>
      <section className="bg-plum-900 py-14 text-center text-white">
        <div className="container-page">
          <span className="eyebrow">Our Menu</span>
          <h1 className="mt-3 text-5xl font-bold sm:text-6xl">Browse <span className="italic text-gold-400">Services</span></h1>
          <p className="mx-auto mt-3 max-w-xl text-white/70">Search, filter and sort to find the treatment that is right for you.</p>
        </div>
      </section>

      <section className="container-page py-10">
        {/* Search / filter / sort */}
        <div className="card flex flex-col gap-3 p-3 md:flex-row md:items-center">
          <div className="relative flex-1">
            <FiSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-muted" />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search services by name…"
              aria-label="Search services by name"
              className="input pl-11 pr-10"
            />
            {search && (
              <button onClick={() => setSearch("")} aria-label="Clear search" className="absolute right-3 top-1/2 -translate-y-1/2 cursor-pointer rounded-full p-1 text-muted hover:bg-blush-100">
                <FiX />
              </button>
            )}
          </div>
          <select value={category} onChange={(e) => updateUrl({ category: e.target.value })} className="input md:w-60" aria-label="Filter by category">
            <option value="">All Categories</option>
            {CATEGORIES.map((c) => <option key={c}>{c}</option>)}
          </select>
          <select value={sort} onChange={(e) => updateUrl({ sort: e.target.value === "newest" ? "" : e.target.value })} className="input md:w-52" aria-label="Sort by price">
            <option value="newest">Newest first</option>
            <option value="price_asc">Price: Low to High</option>
            <option value="price_desc">Price: High to Low</option>
          </select>
        </div>

        {/* Category chips */}
        <div className="mt-5 flex flex-wrap gap-2">
          {["", ...CATEGORIES].map((c) => (
            <button
              key={c || "all"}
              onClick={() => updateUrl({ category: c })}
              className={`cursor-pointer rounded-full border px-4 py-1.5 text-xs font-bold transition ${
                category === c ? "border-plum-900 bg-plum-900 text-white" : "border-line bg-white text-plum-800 hover:border-plum-700"
              }`}
            >
              {c || "All"}
            </button>
          ))}
        </div>

        <div className="mt-8">
          {error ? (
            <ErrorBox message={error} onRetry={reload} />
          ) : loading ? (
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {Array.from({ length: 6 }).map((_, i) => <ServiceCardSkeleton key={i} />)}
            </div>
          ) : services.length === 0 ? (
            <EmptyState
              title="No services found"
              text="Try a different search word or choose another category."
              action={<button className="btn-dark btn-sm" onClick={() => { setSearch(""); router.replace("/services"); }}>Clear Filters</button>}
            />
          ) : (
            <>
              <p className="mb-4 text-sm text-muted">{services.length} service{services.length === 1 ? "" : "s"} found</p>
              <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {services.map((s) => <ServiceCard key={s._id} service={s} />)}
              </div>
            </>
          )}
        </div>
      </section>
    </>
  );
}
