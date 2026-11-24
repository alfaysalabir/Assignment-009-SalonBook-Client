"use client";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import {
  FiGrid, FiCalendar, FiUser, FiScissors, FiPlusCircle, FiUsers, FiCreditCard, FiMenu, FiX, FiLogOut,
} from "react-icons/fi";
import { authClient } from "@/lib/auth-client";
import { clearToken } from "@/lib/api";
import { PageLoader } from "@/components/ui";

const NAV = {
  customer: [
    { href: "/dashboard/customer", label: "Overview", icon: FiGrid },
    { href: "/dashboard/customer/appointments", label: "My Appointments", icon: FiCalendar },
    { href: "/dashboard/customer/profile", label: "My Profile", icon: FiUser },
  ],
  admin: [
    { href: "/dashboard/admin", label: "Overview", icon: FiGrid },
    { href: "/dashboard/admin/services", label: "Manage Services", icon: FiScissors },
    { href: "/dashboard/admin/services/add", label: "Add Service", icon: FiPlusCircle },
    { href: "/dashboard/admin/appointments", label: "Manage Appointments", icon: FiCalendar },
    { href: "/dashboard/admin/users", label: "Manage Users", icon: FiUsers },
    { href: "/dashboard/admin/transactions", label: "Transactions", icon: FiCreditCard },
    { href: "/dashboard/admin/profile", label: "My Profile", icon: FiUser },
  ],
};

// Wraps a role's pages: checks login + role, then shows the sidebar layout
export default function DashboardShell({ role, children }) {
  const router = useRouter();
  const pathname = usePathname();
  const { data: session, isPending } = authClient.useSession();
  const user = session?.user;
  const [open, setOpen] = useState(false);

  useEffect(() => setOpen(false), [pathname]);

  useEffect(() => {
    if (isPending) return;
    if (!user) router.replace(`/signin?redirect=${encodeURIComponent(pathname)}`);
    else if (!user.isBlocked && user.role !== role) router.replace("/dashboard"); // wrong role -> send to own dashboard
  }, [isPending, user, role, router, pathname]);

  async function logout() {
    await authClient.signOut();
    clearToken();
    toast.success("Logged out successfully");
    router.push("/");
    router.refresh();
  }

  if (isPending || !user || (!user.isBlocked && user.role !== role)) return <PageLoader text="Opening your dashboard…" />;

  if (user.isBlocked) {
    return (
      <div className="container-page grid min-h-[60vh] place-items-center text-center">
        <div className="card max-w-md p-8">
          <h1 className="text-3xl font-bold text-sage-900">Account blocked</h1>
          <p className="mt-2 text-sm text-muted">Your account has been blocked. Please contact the salon for help.</p>
          <button onClick={logout} className="btn-dark mt-5">Logout</button>
        </div>
      </div>
    );
  }

  const items = NAV[role];
  const isActive = (href) => (href === `/dashboard/${role}` ? pathname === href : pathname.startsWith(href) && !(href.endsWith("/services") && pathname.endsWith("/add")));

  const sidebar = (
    <nav className="flex h-full flex-col" aria-label="Dashboard">
      <p className="mb-3 px-3 text-[11px] font-bold uppercase tracking-[0.22em] text-clay-300">
        {role === "admin" ? "Admin Panel" : "My Account"}
      </p>
      <ul className="space-y-1">
        {items.map(({ href, label, icon: Icon }) => (
          <li key={href}>
            <Link
              href={href}
              className={`flex items-center gap-3 rounded-sm px-3 py-2.5 text-sm font-semibold transition ${
                isActive(href) ? "bg-clay-500 text-white" : "text-paper-200 hover:bg-white/10"
              }`}
            >
              <Icon size={17} /> {label}
            </Link>
          </li>
        ))}
      </ul>
      <button
        onClick={logout}
        className="mt-auto flex cursor-pointer items-center gap-3 rounded-sm px-3 py-2.5 text-sm font-semibold text-rose-300 hover:bg-white/10"
      >
        <FiLogOut size={17} /> Logout
      </button>
    </nav>
  );

  return (
    <div className="container-page py-6 lg:py-8">
      {/* Mobile bar */}
      <div className="mb-4 flex items-center justify-between rounded-sm border border-line bg-white px-4 py-3 lg:hidden">
        <div>
          <p className="text-sm font-bold text-sage-900">{user.name}</p>
          <p className="text-xs capitalize text-muted">{role}</p>
        </div>
        <button onClick={() => setOpen(true)} className="grid h-10 w-10 cursor-pointer place-items-center rounded-sm border border-line" aria-label="Open dashboard menu">
          <FiMenu size={20} />
        </button>
      </div>

      {open && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div className="absolute inset-0 bg-sage-950/60" onClick={() => setOpen(false)} />
          <div className="absolute left-0 top-0 h-full w-72 bg-sage-900 p-5 shadow-2xl">
            <button onClick={() => setOpen(false)} className="mb-4 cursor-pointer rounded-sm p-1.5 text-white hover:bg-white/10" aria-label="Close menu">
              <FiX size={20} />
            </button>
            <div className="h-[calc(100%-3rem)]">{sidebar}</div>
          </div>
        </div>
      )}

      <div className="grid gap-6 lg:grid-cols-[250px_1fr]">
        <aside className="hidden h-[calc(100vh-9rem)] rounded-sm border border-sage-900 bg-sage-900 p-5 lg:sticky lg:top-24 lg:block">
          {sidebar}
        </aside>
        <section className="min-w-0">{children}</section>
      </div>
    </div>
  );
}

export function PageTitle({ title, text, action }) {
  return (
    <div className="mb-6 flex flex-wrap items-end justify-between gap-3">
      <div>
        <h1 className="text-4xl font-bold text-sage-900">{title}</h1>
        {text && <p className="mt-1 text-sm text-muted">{text}</p>}
      </div>
      {action}
    </div>
  );
}
