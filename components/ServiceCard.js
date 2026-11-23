import Link from "next/link";
import { FiClock, FiArrowRight } from "react-icons/fi";
import { SmartImage } from "@/components/ui";
import { formatPrice } from "@/lib/utils";

export default function ServiceCard({ service }) {
  return (
    <article className="group flex flex-col overflow-hidden rounded-3xl border border-line bg-white transition duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-plum-900/10">
      <div className="relative h-56 overflow-hidden">
        <SmartImage
          src={service.image}
          alt={service.serviceName}
          className="h-full w-full transition duration-500 group-hover:scale-105"
        />
        <span className="absolute left-4 top-4 rounded-full bg-white/95 px-3 py-1 text-xs font-bold text-plum-800">
          {service.category}
        </span>
      </div>
      <div className="flex flex-1 flex-col p-6">
        <h3 className="text-2xl font-bold leading-tight text-plum-900">{service.serviceName}</h3>
        <p className="mt-2 line-clamp-2 text-sm leading-relaxed text-muted">{service.description}</p>
        <div className="mt-4 flex items-center justify-between border-t border-line pt-4">
          <span className="font-display text-3xl font-bold text-gold-600">{formatPrice(service.price)}</span>
          <span className="flex items-center gap-1.5 text-sm text-muted">
            <FiClock size={14} /> {service.duration} min
          </span>
        </div>
        <Link href={`/services/${service._id}`} className="btn-dark mt-5 w-full">
          View Details <FiArrowRight />
        </Link>
      </div>
    </article>
  );
}

export function ServiceCardSkeleton() {
  return (
    <div className="overflow-hidden rounded-3xl border border-line bg-white" aria-hidden="true">
      <div className="h-56 animate-pulse bg-blush-100" />
      <div className="space-y-3 p-6">
        <div className="h-6 w-3/4 animate-pulse rounded bg-blush-100" />
        <div className="h-4 w-full animate-pulse rounded bg-blush-100" />
        <div className="h-4 w-2/3 animate-pulse rounded bg-blush-100" />
        <div className="h-11 w-full animate-pulse rounded-full bg-blush-100" />
      </div>
    </div>
  );
}
