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

export default function Footer() {
  return (
    <footer className="mt-20 overflow-hidden bg-plum-950 text-white/80">
      {/* Sliding outlined text */}
      <div className="border-b border-white/10 py-6" aria-hidden="true">
        <div className="marquee font-display text-5xl font-bold uppercase sm:text-7xl">
          {[0, 1].map((i) => (
            <span key={i} className="pr-10">
              Book your glow ✦ Look radiant ✦ Feel beautiful ✦ Book your glow ✦ Look radiant ✦ Feel beautiful ✦
            </span>
          ))}
        </div>
      </div>

      <div className="container-page grid gap-10 py-14 sm:grid-cols-2 lg:grid-cols-4">
        <div>
          <Logo light />
          <p className="mt-4 max-w-xs text-sm leading-relaxed text-white/60">
            SalonBook makes self-care simple. Explore our services, pick a time that suits you and pay securely online.
          </p>
          <div className="mt-5 flex gap-2.5">
            {socials.map(({ icon: Icon, label, href }) => (
              <a
                key={label}
                href={href}
                target="_blank"
                rel="noreferrer"
                aria-label={label}
                className="grid h-9 w-9 place-items-center rounded-full border border-white/20 transition hover:border-gold-400 hover:text-gold-400"
              >
                <Icon size={14} />
              </a>
            ))}
          </div>
        </div>

        <div>
          <h3 className="mb-4 font-sans text-sm font-bold uppercase tracking-widest text-white">Quick Links</h3>
          <ul className="space-y-2.5 text-sm">
            <li><Link href="/" className="hover:text-gold-400">Home</Link></li>
            <li><Link href="/services" className="hover:text-gold-400">Browse Services</Link></li>
            <li><Link href="/signin" className="hover:text-gold-400">Sign In</Link></li>
            <li><Link href="/signup" className="hover:text-gold-400">Sign Up</Link></li>
            <li><Link href="/dashboard" className="hover:text-gold-400">Dashboard</Link></li>
          </ul>
        </div>

        <div>
          <h3 className="mb-4 font-sans text-sm font-bold uppercase tracking-widest text-white">Contact Us</h3>
          <ul className="space-y-3 text-sm">
            <li className="flex gap-3"><FiMapPin className="mt-0.5 shrink-0 text-gold-400" /> {SALON.address}</li>
            <li className="flex gap-3"><FiPhone className="mt-0.5 shrink-0 text-gold-400" /> {SALON.phone}</li>
            <li className="flex gap-3"><FiMail className="mt-0.5 shrink-0 text-gold-400" /> {SALON.email}</li>
          </ul>
        </div>

        <div>
          <h3 className="mb-4 font-sans text-sm font-bold uppercase tracking-widest text-white">Opening Hours</h3>
          <ul className="space-y-3 text-sm">
            {SALON.hours.map((h) => (
              <li key={h.days} className="flex gap-3">
                <FiClock className="mt-0.5 shrink-0 text-gold-400" />
                <span>
                  <span className="block text-white">{h.days}</span>
                  {h.time}
                </span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div className="border-t border-white/10 py-5 text-center text-xs text-white/50">
        © {new Date().getFullYear()} SalonBook. All rights reserved.
      </div>
    </footer>
  );
}
