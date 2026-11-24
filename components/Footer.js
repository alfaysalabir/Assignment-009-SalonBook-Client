import Link from "next/link";
import { FaFacebookF, FaInstagram, FaPinterestP, FaYoutube } from "react-icons/fa";
import { FiMapPin, FiPhone, FiMail, FiClock } from "react-icons/fi";
import Logo from "@/components/Logo";
import { SALON } from "@/lib/constants";

const socials = [
  { icon: FaFacebookF, label: "Facebook", href: "https://facebook.com" },
  { icon: FaInstagram, label: "Instagram", href: "https://instagram.com" },
  { icon: FaPinterestP, label: "Pinterest", href: "https://pinterest.com" },
  { icon: FaYoutube, label: "YouTube", href: "https://youtube.com" },
];

const heading = "mb-5 font-sans text-[11px] font-bold uppercase tracking-[0.22em] text-clay-600";

export default function Footer() {
  return (
    <footer className="relative mt-24 overflow-hidden border-t border-sage-900 bg-paper-100 text-sage-800">
      <div className="container-page grid gap-10 py-16 sm:grid-cols-2 lg:grid-cols-[1.4fr_1fr_1.2fr_1.2fr]">
        <div>
          <Logo />
          <p className="mt-5 max-w-xs text-sm leading-relaxed text-muted">
            SalonBook makes self-care simple. Explore our services, pick a time that suits you and pay securely online.
          </p>
          <div className="mt-6 flex gap-2">
            {socials.map(({ icon: Icon, label, href }) => (
              <a
                key={label}
                href={href}
                target="_blank"
                rel="noreferrer"
                aria-label={label}
                className="grid h-10 w-10 place-items-center border border-sage-900 text-sage-900 transition hover:bg-sage-900 hover:text-paper-50"
              >
                <Icon size={14} />
              </a>
            ))}
          </div>
        </div>

        <div>
          <h3 className={heading}>Navigate</h3>
          <ul className="space-y-3 text-sm font-medium">
            <li><Link href="/" className="hover:text-clay-600">Home</Link></li>
            <li><Link href="/services" className="hover:text-clay-600">Browse Services</Link></li>
            <li><Link href="/signin" className="hover:text-clay-600">Sign In</Link></li>
            <li><Link href="/signup" className="hover:text-clay-600">Sign Up</Link></li>
            <li><Link href="/dashboard" className="hover:text-clay-600">Dashboard</Link></li>
          </ul>
        </div>

        <div>
          <h3 className={heading}>Visit & Contact</h3>
          <ul className="space-y-3 text-sm">
            <li className="flex gap-3"><FiMapPin className="mt-0.5 shrink-0 text-clay-500" /> {SALON.address}</li>
            <li className="flex gap-3"><FiPhone className="mt-0.5 shrink-0 text-clay-500" /> {SALON.phone}</li>
            <li className="flex gap-3"><FiMail className="mt-0.5 shrink-0 text-clay-500" /> {SALON.email}</li>
          </ul>
        </div>

        <div>
          <h3 className={heading}>Opening Hours</h3>
          <ul className="space-y-3 text-sm">
            {SALON.hours.map((h) => (
              <li key={h.days} className="flex gap-3">
                <FiClock className="mt-0.5 shrink-0 text-clay-500" />
                <span>
                  <span className="block font-semibold text-sage-900">{h.days}</span>
                  {h.time}
                </span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Big wordmark */}
      <p
        aria-hidden="true"
        className="pointer-events-none select-none whitespace-nowrap text-center font-display text-[22vw] font-semibold leading-[0.8] tracking-tighter text-sage-900/[0.06] lg:text-[17rem]"
      >
        SalonBook
      </p>

      <div className="relative border-t border-line py-5 text-center text-xs text-muted">
        © {new Date().getFullYear()} SalonBook. All rights reserved.
      </div>
    </footer>
  );
}
