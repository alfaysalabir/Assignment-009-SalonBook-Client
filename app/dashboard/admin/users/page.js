"use client";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { FiEye, FiSlash, FiUnlock, FiSearch } from "react-icons/fi";
import { apiFetch } from "@/lib/api";
import { useApi } from "@/lib/useApi";
import { PageTitle } from "@/components/DashboardShell";
import { PageLoader, ErrorBox, EmptyState, StatusBadge, Modal, ConfirmModal, TableWrap, Spinner } from "@/components/ui";
import { formatDate } from "@/lib/utils";

function Avatar({ user, size = "h-10 w-10" }) {
  return user.image ? (
    // eslint-disable-next-line @next/next/no-img-element
    <img src={user.image} alt="" className={`${size} shrink-0 rounded-full object-cover`} />
  ) : (
    <span className={`${size} grid shrink-0 place-items-center rounded-full bg-plum-900 font-bold text-white`}>{user.name?.[0]?.toUpperCase()}</span>
  );
}

export default function ManageUsersPage() {
  const [search, setSearch] = useState("");
  const [debounced, setDebounced] = useState("");
  useEffect(() => {
    const t = setTimeout(() => setDebounced(search), 400);
    return () => clearTimeout(t);
  }, [search]);

  const { data, loading, error, reload } = useApi(`/api/admin/users?search=${encodeURIComponent(debounced)}`);
  const [detailsId, setDetailsId] = useState(null);
  const details = useApi(`/api/admin/users/${detailsId}`, { enabled: !!detailsId });
  const [toToggle, setToToggle] = useState(null);
  const [busy, setBusy] = useState(false);

  async function toggleBlock() {
    setBusy(true);
    const block = !toToggle.isBlocked;
    try {
      const res = await apiFetch(`/api/admin/users/${toToggle._id}/${block ? "block" : "unblock"}`, { method: "PATCH" });
      toast.success(res.message);
      setToToggle(null);
      reload();
    } catch (err) {
      toast.error(err.message);
      setToToggle(null);
    } finally {
      setBusy(false);
    }
  }

  return (
    <>
      <PageTitle title="Manage Users" text="All registered customers." />
      <div className="relative mb-4 max-w-md">
        <FiSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-muted" />
        <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search by name or email…" aria-label="Search users" className="input pl-11" />
      </div>

      {loading && !data ? (
        <PageLoader text="Loading users…" />
      ) : error ? (
        <ErrorBox message={error} onRetry={reload} />
      ) : data.length === 0 ? (
        <EmptyState title="No customers found" text="Registered customers will appear here." />
      ) : (
        <TableWrap>
          <thead className="bg-blush-100">
            <tr>{["Customer", "Phone", "Joined", "Status", "Actions"].map((h) => <th key={h} className="th">{h}</th>)}</tr>
          </thead>
          <tbody>
            {data.map((u) => (
              <tr key={u._id} className="border-t border-line">
                <td className="td">
                  <div className="flex items-center gap-3">
                    <Avatar user={u} />
                    <div>
                      <p className="font-bold text-plum-900">{u.name}</p>
                      <p className="text-xs text-muted">{u.email}</p>
                    </div>
                  </div>
                </td>
                <td className="td text-muted">{u.phone || "—"}</td>
                <td className="td text-muted">{formatDate(u.createdAt)}</td>
                <td className="td"><StatusBadge status={u.isBlocked ? "blocked" : "active"} /></td>
                <td className="td">
                  <div className="flex gap-2">
                    <button onClick={() => setDetailsId(u._id)} className="btn-outline btn-sm" aria-label="View user"><FiEye /></button>
                    {u.isBlocked ? (
                      <button onClick={() => setToToggle(u)} className="btn-dark btn-sm"><FiUnlock /> Unblock</button>
                    ) : (
                      <button onClick={() => setToToggle(u)} className="btn-outline btn-sm !border-rose-200 !text-rose-600"><FiSlash /> Block</button>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </TableWrap>
      )}

      <Modal open={!!detailsId} onClose={() => setDetailsId(null)} title="User details">
        {details.loading ? (
          <div className="grid place-items-center py-8 text-plum-700"><Spinner className="h-8 w-8" /></div>
        ) : details.error ? (
          <p className="text-sm text-rose-600">{details.error}</p>
        ) : details.data ? (
          <div>
            <div className="mb-4 flex items-center gap-4">
              <Avatar user={details.data} size="h-16 w-16" />
              <div>
                <p className="text-xl font-bold text-plum-900">{details.data.name}</p>
                <p className="text-sm text-muted">{details.data.email}</p>
              </div>
            </div>
            {[
              ["Phone", details.data.phone || "—"],
              ["Joined", formatDate(details.data.createdAt)],
              ["Appointments", details.data.appointmentCount],
              ["Account", details.data.isBlocked ? "Blocked" : "Active"],
            ].map(([k, v]) => (
              <div key={k} className="flex justify-between border-b border-line py-2.5 text-sm last:border-0">
                <span className="text-muted">{k}</span><span className="font-semibold text-plum-900">{v}</span>
              </div>
            ))}
          </div>
        ) : null}
      </Modal>

      <ConfirmModal
        open={!!toToggle}
        onClose={() => setToToggle(null)}
        onConfirm={toggleBlock}
        loading={busy}
        danger={!toToggle?.isBlocked}
        title={toToggle?.isBlocked ? "Unblock this user?" : "Block this user?"}
        message={toToggle?.isBlocked ? `${toToggle?.name} will be able to use SalonBook again.` : `${toToggle?.name} will be logged out and will not be able to use protected features.`}
        confirmText={toToggle?.isBlocked ? "Unblock" : "Block"}
      />
    </>
  );
}
