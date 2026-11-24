import Link from "next/link";
import { FiScissors } from "react-icons/fi";

export default function Logo({ light = false }) {
  return (
    <Link href="/" className="flex items-center gap-2.5" aria-label="SalonBook home">
      <span className={`grid h-9 w-9 place-items-center ${light ? "bg-clay-500 text-white" : "bg-sage-900 text-clay-300"}`}>
        <FiScissors size={16} />
      </span>
      <span className={`font-display text-2xl font-semibold tracking-tight ${light ? "text-white" : "text-sage-900"}`}>
        Salon<em className="text-clay-500">Book</em>
      </span>
    </Link>
  );
}
