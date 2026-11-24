"use client";
import { useEffect, useState } from "react";
import { FiScissors, FiAlertCircle, FiInbox, FiX } from "react-icons/fi";

/* Image that shows a soft placeholder if the link is empty or broken */
export function SmartImage({ src, alt = "", className = "" }) {
  const [failed, setFailed] = useState(false);
  if (!src || failed) {
    return (
      <div className={`grid place-items-center bg-gradient-to-br from-paper-200 to-paper-100 text-clay-600 ${className}`}>
        <FiScissors size={28} />
      </div>
    );
  }
  // eslint-disable-next-line @next/next/no-img-element
  return <img src={src} alt={alt} className={`object-cover ${className}`} onError={() => setFailed(true)} loading="lazy" />;
}

export function Spinner({ className = "h-5 w-5" }) {
  return (
    <span
      className={`inline-block animate-spin rounded-full border-2 border-current border-t-transparent ${className}`}
      role="status"
      aria-label="Loading"
    />
  );
}

export function PageLoader({ text = "Loading…" }) {
  return (
    <div className="grid min-h-[50vh] place-items-center">
      <div className="flex flex-col items-center gap-3 text-sage-700">
        <Spinner className="h-9 w-9" />
        <p className="text-sm font-medium text-muted">{text}</p>
      </div>
    </div>
  );
}

export function ErrorBox({ message, onRetry }) {
  return (
    <div className="card mx-auto flex max-w-lg flex-col items-center gap-3 p-8 text-center">
      <FiAlertCircle size={34} className="text-rose-500" />
      <p className="font-semibold text-sage-900">{message || "Something went wrong"}</p>
      {onRetry && (
        <button onClick={onRetry} className="btn-dark btn-sm">
          Try Again
        </button>
      )}
    </div>
  );
}

export function EmptyState({ title, text, action }) {
  return (
    <div className="card flex flex-col items-center gap-2 p-10 text-center">
      <FiInbox size={34} className="text-clay-500" />
      <h3 className="font-display text-2xl font-bold text-sage-900">{title}</h3>
      {text && <p className="max-w-sm text-sm text-muted">{text}</p>}
      {action && <div className="mt-3">{action}</div>}
    </div>
  );
}

const badgeStyles = {
  pending: "bg-amber-100 text-amber-800",
  confirmed: "bg-emerald-100 text-emerald-800",
  cancelled: "bg-rose-100 text-rose-700",
  paid: "bg-emerald-100 text-emerald-800",
  unpaid: "bg-slate-100 text-slate-600",
  failed: "bg-rose-100 text-rose-700",
  active: "bg-emerald-100 text-emerald-800",
  inactive: "bg-slate-100 text-slate-600",
  blocked: "bg-rose-100 text-rose-700",
};

export function StatusBadge({ status }) {
  return (
    <span
      className={`inline-block rounded-sm px-3 py-1 text-xs font-bold capitalize ${badgeStyles[status] || "bg-slate-100 text-slate-600"}`}
    >
      {status}
    </span>
  );
}

export function SectionHeading({ eyebrow, title, text, center = false }) {
  return (
    <div className={center ? "mx-auto max-w-2xl text-center" : "max-w-2xl"}>
      <span className="eyebrow">{eyebrow}</span>
      <h2 className="mt-3 text-4xl text-sage-900 sm:text-5xl">{title}</h2>
      {text && <p className="mt-3 text-muted">{text}</p>}
    </div>
  );
}

export function Modal({ open, onClose, title, children, wide = false }) {
  useEffect(() => {
    if (!open) return;
    const onKey = (e) => e.key === "Escape" && onClose();
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [open, onClose]);

  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 grid place-items-center p-4" role="dialog" aria-modal="true" aria-label={title}>
      <div className="absolute inset-0 bg-sage-950/60" onClick={onClose} />
      <div
        className={`relative max-h-[90vh] w-full overflow-y-auto rounded-sm bg-white p-6 shadow-2xl ${wide ? "max-w-2xl" : "max-w-md"}`}
      >
        <div className="mb-4 flex items-start justify-between gap-4">
          <h3 className="font-display text-3xl font-bold text-sage-900">{title}</h3>
          <button onClick={onClose} aria-label="Close" className="cursor-pointer rounded-sm p-1.5 hover:bg-paper-100">
            <FiX size={20} />
          </button>
        </div>
        {children}
      </div>
    </div>
  );
}

export function ConfirmModal({ open, onClose, onConfirm, title, message, confirmText = "Confirm", danger = false, loading = false }) {
  return (
    <Modal open={open} onClose={loading ? () => {} : onClose} title={title}>
      <p className="text-sm leading-relaxed text-muted">{message}</p>
      <div className="mt-6 flex justify-end gap-3">
        <button className="btn-outline btn-sm" onClick={onClose} disabled={loading}>
          Go Back
        </button>
        <button className={`${danger ? "btn-danger" : "btn-dark"} btn-sm`} onClick={onConfirm} disabled={loading}>
          {loading && <Spinner className="h-4 w-4" />} {confirmText}
        </button>
      </div>
    </Modal>
  );
}

export function TableWrap({ children }) {
  return (
    <div className="card overflow-x-auto">
      <table className="w-full min-w-[720px] text-left text-sm">{children}</table>
    </div>
  );
}
