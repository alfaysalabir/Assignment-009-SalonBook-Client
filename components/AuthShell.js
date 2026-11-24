import Link from "next/link";
import { SmartImage } from "@/components/ui";
import { HERO_ARCH_IMAGE } from "@/lib/constants";

// Two-column layout used by Sign In and Sign Up
export default function AuthShell({ title, subtitle, children, footer }) {
  return (
    <section className="container-page grid min-h-[calc(100vh-72px)] items-center gap-10 py-10 lg:grid-cols-2">
      <div className="relative hidden h-[600px] overflow-hidden rounded-sm bg-sage-900 lg:block">
        <SmartImage src={HERO_ARCH_IMAGE} alt="" className="h-full w-full opacity-60" />
        <div className="absolute inset-0 bg-gradient-to-t from-sage-950 via-sage-900/40 to-transparent" />
        <div className="absolute bottom-0 p-10 text-white">
          <h2 className="text-5xl font-bold leading-tight">Your best look <span className="italic text-clay-400">starts here.</span></h2>
          <p className="mt-3 max-w-sm text-white/70">Book appointments, track their status and pay online, all in one place.</p>
        </div>
      </div>
      <div className="mx-auto w-full max-w-md">
        <h1 className="text-5xl font-bold text-sage-900">{title}</h1>
        <p className="mt-2 text-muted">{subtitle}</p>
        <div className="mt-8">{children}</div>
        <p className="mt-6 text-center text-sm text-muted">{footer}</p>
      </div>
    </section>
  );
}

export function AuthFooterLink({ text, href, label }) {
  return (
    <>
      {text} <Link href={href} className="font-bold text-sage-800 underline-offset-4 hover:underline">{label}</Link>
    </>
  );
}
