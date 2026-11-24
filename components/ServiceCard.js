import Link from "next/link";
import { FiClock, FiArrowUpRight } from "react-icons/fi";
import { SmartImage } from "@/components/ui";
import { formatPrice } from "@/lib/utils";

export default function ServiceCard({ service }) {
  return (
    <article className="group flex flex-col">
      <Link href={`/services/${service._id}`} className="relative block aspect-[4/5] overflow-hidden bg-paper-200" aria-label={service.serviceName}>
        <SmartImage
          src={service.image}
          alt={service.serviceName}
          className="h-full w-full transition duration-700 group-hover:scale-105"
        />
        <span className="absolute left-0 top-4 bg-paper-50 px-3 py-1.5 text-[10px] font-bold uppercase tracking-[0.16em] text-sage-900">
          {service.category}
        </span>
        <span className="absolute bottom-4 right-4 grid h-11 w-11 place-items-center bg-clay-500 text-white opacity-0 transition duration-300 group-hover:opacity-100">
          <FiArrowUpRight size={20} />
        </span>
      </Link>

      <div className="flex flex-1 flex-col border-b border-sage-900 pb-5 pt-4">
        <div className="flex items-start justify-between gap-4">
          <h3 className="text-2xl leading-tight text-sage-900">{service.serviceName}</h3>
          <span className="font-display text-2xl text-clay-600">{formatPrice(service.price)}</span>
        </div>
        <p className="mt-2 line-clamp-2 text-sm leading-relaxed text-muted">{service.description}</p>
        <div className="mt-4 flex items-center justify-between">
          <span className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-muted">
            <FiClock size={13} /> {service.duration} min
          </span>
          <Link
            href={`/services/${service._id}`}
            className="text-xs font-bold uppercase tracking-[0.14em] text-sage-900 underline decoration-clay-500 decoration-2 underline-offset-4 hover:text-clay-600"
          >
            View Details
          </Link>
        </div>
      </div>
    </article>
  );
}

export function ServiceCardSkeleton() {
  return (
    <div aria-hidden="true">
      <div className="aspect-[4/5] animate-pulse bg-paper-200" />
      <div className="space-y-3 border-b border-line pb-5 pt-4">
        <div className="h-6 w-3/4 animate-pulse bg-paper-200" />
        <div className="h-4 w-full animate-pulse bg-paper-200" />
        <div className="h-4 w-1/2 animate-pulse bg-paper-200" />
      </div>
    </div>
  );
}
