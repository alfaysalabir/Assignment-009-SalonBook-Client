import Link from "next/link";
import { FiScissors } from "react-icons/fi";

export default function Logo({ light = false }) {
  return (
    <Link href="/" className="flex items-center gap-2.5" aria-label="SalonBook home">
      <span className="grid h-9 w-9 place-items-center rounded-full bg-gold-400 text-plum-950">
        <FiScissors size={17} />
      </span>
      <span className={`font-display text-2xl font-bold tracking-tight ${light ? "text-white" : "text-plum-900"}`}>
        SalonBook
      </span>
    </Link>
  );
}
