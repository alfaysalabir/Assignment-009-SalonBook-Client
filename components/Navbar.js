"use client";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import toast from "react-hot-toast";
import { FiMenu, FiX, FiChevronDown, FiGrid, FiLogOut } from "react-icons/fi";
import Logo from "@/components/Logo";
import { authClient } from "@/lib/auth-client";
import { clearToken } from "@/lib/api";

export default function Navbar() {
  const pathname = usePathname();
  const router = useRouter();
  const { data: session, isPending } = authClient.useSession();
  const user = session?.user;

  const [menuOpen, setMenuOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  // close menus when the page changes
  useEffect(() => {
    setMenuOpen(false);
    setDropdownOpen(false);
  }, [pathname]);

  // close the dropdown when clicking outside
  useEffect(() => {
    const handler = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) setDropdownOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const links = user
    ? [
        { href: "/", label: "Home" },
        { href: "/services", label: "Browse Services" },
        { href: "/dashboard", label: "Dashboard" },
      ]
    : [{ href: "/services", label: "Browse Services" }];

  const isActive = (href) => (href === "/" ? pathname === "/" : pathname.startsWith(href));

  async function handleLogout() {
    await authClient.signOut();
    clearToken();
    toast.success("Logged out successfully");
    setDropdownOpen(false);
    router.push("/");
    router.refresh();
  }

  return (
    <header className="sticky top-0 z-40 border-b border-sage-900 bg-paper-50/95 backdrop-blur">
      <div className="container-page flex h-[72px] items-center justify-between">
        <Logo />

        {/* Desktop links */}
        <nav className="hidden items-center gap-8 md:flex" aria-label="Main">
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={`text-xs font-bold uppercase tracking-[0.18em] transition hover:text-clay-600 ${
                isActive(link.href) ? "text-clay-600" : "text-sage-900"
              }`}
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-3">
          {/* Auth area */}
          {isPending ? (
            <div className="h-10 w-28 animate-pulse rounded-sm bg-paper-100" />
          ) : user ? (
            <div className="relative" ref={dropdownRef}>
              <button
                onClick={() => setDropdownOpen((o) => !o)}
                className="flex cursor-pointer items-center gap-2 rounded-sm border border-line bg-white py-1.5 pl-1.5 pr-3 transition hover:border-sage-700"
                aria-haspopup="menu"
                aria-expanded={dropdownOpen}
              >
                {user.image ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={user.image} alt="" className="h-8 w-8 rounded-sm object-cover" />
                ) : (
                  <span className="grid h-8 w-8 place-items-center rounded-sm bg-sage-900 text-sm font-bold text-white">
                    {user.name?.[0]?.toUpperCase()}
                  </span>
                )}
                <span className="hidden max-w-[110px] truncate text-sm font-semibold text-sage-900 sm:block">
                  {user.name}
                </span>
                <FiChevronDown size={15} className="text-muted" />
              </button>

              {dropdownOpen && (
                <div
                  role="menu"
                  className="absolute right-0 mt-2 w-56 overflow-hidden rounded-sm border border-line bg-white shadow-xl"
                >
                  <div className="border-b border-line px-4 py-3">
                    <p className="truncate text-sm font-bold text-sage-900">{user.name}</p>
                    <p className="truncate text-xs text-muted">{user.email}</p>
                  </div>
                  <Link
                    href="/dashboard"
                    className="flex items-center gap-2 px-4 py-3 text-sm font-medium hover:bg-paper-100"
                  >
                    <FiGrid size={15} /> Dashboard
                  </Link>
                  <button
                    onClick={handleLogout}
                    className="flex w-full cursor-pointer items-center gap-2 px-4 py-3 text-left text-sm font-medium text-rose-600 hover:bg-paper-100"
                  >
                    <FiLogOut size={15} /> Logout
                  </button>
                </div>
              )}
            </div>
          ) : (
            <div className="hidden items-center gap-2 sm:flex">
              <Link href="/signin" className="btn-outline btn-sm">
                Sign In
              </Link>
              <Link href="/signup" className="btn-dark btn-sm">
                Sign Up
              </Link>
            </div>
          )}

          {/* Mobile menu button */}
          <button
            className="grid h-10 w-10 cursor-pointer place-items-center rounded-sm border border-line md:hidden"
            onClick={() => setMenuOpen((o) => !o)}
            aria-label="Toggle menu"
          >
            {menuOpen ? <FiX size={20} /> : <FiMenu size={20} />}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {menuOpen && (
        <div className="border-t border-line bg-white md:hidden">
          <nav className="container-page flex flex-col gap-1 py-4" aria-label="Mobile">
            {links.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`rounded-sm px-4 py-3 text-sm font-semibold ${
                  isActive(link.href) ? "bg-paper-100 text-clay-600" : "text-sage-900"
                }`}
              >
                {link.label}
              </Link>
            ))}
            {!user && !isPending && (
              <div className="mt-2 grid grid-cols-2 gap-3">
                <Link href="/signin" className="btn-outline btn-sm">
                  Sign In
                </Link>
                <Link href="/signup" className="btn-dark btn-sm">
                  Sign Up
                </Link>
              </div>
            )}
          </nav>
        </div>
      )}
    </header>
  );
}
