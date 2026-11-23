"use client";
import Link from "next/link";
import { useState } from "react";
import toast from "react-hot-toast";
import { FiEdit2, FiTrash2, FiPlus, FiSearch } from "react-icons/fi";
import { apiFetch } from "@/lib/api";
import { useApi } from "@/lib/useApi";
import { PageTitle } from "@/components/DashboardShell";
import { PageLoader, ErrorBox, EmptyState, StatusBadge, SmartImage, ConfirmModal, TableWrap } from "@/components/ui";
import { formatPrice } from "@/lib/utils";

export default function ManageServicesPage() {
  const { data, loading, error, reload } = useApi("/api/admin/services");
  const [search, setSearch] = useState("");
  const [sort, setSort] = useState("");
  const [toDelete, setToDelete] = useState(null);
  const [busy, setBusy] = useState(false);

  async function toggleStatus(s) {
    const status = s.status === "active" ? "inactive" : "active";
    try {
      const res = await apiFetch(`/api/services/${s._id}/status`, { method: "PATCH", body: { status } });
      toast.success(res.message);
      reload();
    } catch (err) {
      toast.error(err.message);
    }
  }

  async function handleDelete() {
    setBusy(true);
    try {
      const res = await apiFetch(`/api/services/${toDelete._id}`, { method: "DELETE" });
      toast.success(res.message);
      setToDelete(null);
      reload();
    } catch (err) {
      toast.error(err.message);
      setToDelete(null);
    } finally {
      setBusy(false);
    }
  }

  if (loading) return <PageLoader text="Loading services…" />;
  if (error) return <ErrorBox message={error} onRetry={reload} />;

  let list = data.filter((s) => s.serviceName.toLowerCase().includes(search.toLowerCase()));
  if (sort === "asc") list = [...list].sort((a, b) => a.price - b.price);
  if (sort === "desc") list = [...list].sort((a, b) => b.price - a.price);

  return (
    <>
      <PageTitle
        title="Manage Services"
        text={`${data.length} service${data.length === 1 ? "" : "s"} in total`}
        action={<Link href="/dashboard/admin/services/add" className="btn-dark btn-sm"><FiPlus /> Add Service</Link>}
      />

      <div className="mb-4 flex flex-col gap-3 sm:flex-row">
        <div className="relative flex-1">
          <FiSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-muted" />
          <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search by service name…" aria-label="Search services" className="input pl-11" />
        </div>
        <select value={sort} onChange={(e) => setSort(e.target.value)} className="input sm:w-52" aria-label="Sort by price">
          <option value="">Sort by price</option>
          <option value="asc">Low to High</option>
          <option value="desc">High to Low</option>
        </select>
      </div>

      {list.length === 0 ? (
        <EmptyState title="No services found" text="Add your first service to get started." action={<Link href="/dashboard/admin/services/add" className="btn-dark btn-sm">Add Service</Link>} />
      ) : (
        <TableWrap>
          <thead className="bg-blush-100">
            <tr>{["Service", "Category", "Price", "Duration", "Status", "Actions"].map((h) => <th key={h} className="th">{h}</th>)}</tr>
          </thead>
          <tbody>
            {list.map((s) => (
              <tr key={s._id} className="border-t border-line">
                <td className="td">
                  <div className="flex items-center gap-3">
                    <SmartImage src={s.image} alt="" className="h-12 w-12 shrink-0 rounded-xl" />
                    <span className="font-bold text-plum-900">{s.serviceName}</span>
                  </div>
                </td>
                <td className="td text-muted">{s.category}</td>
                <td className="td font-semibold">{formatPrice(s.price)}</td>
                <td className="td text-muted">{s.duration} min</td>
                <td className="td">
                  <button onClick={() => toggleStatus(s)} className="cursor-pointer" title="Click to activate / deactivate">
                    <StatusBadge status={s.status} />
                  </button>
                </td>
                <td className="td">
                  <div className="flex gap-2">
                    <Link href={`/dashboard/admin/services/${s._id}/edit`} className="btn-outline btn-sm" aria-label="Edit service"><FiEdit2 /></Link>
                    <button onClick={() => setToDelete(s)} className="btn-outline btn-sm !border-rose-200 !text-rose-600" aria-label="Delete service"><FiTrash2 /></button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </TableWrap>
      )}

      <ConfirmModal
        open={!!toDelete}
        onClose={() => setToDelete(null)}
        onConfirm={handleDelete}
        loading={busy}
        danger
        title="Delete this service?"
        message={`"${toDelete?.serviceName}" will be removed permanently. This cannot be undone.`}
        confirmText="Delete"
      />
    </>
  );
}
