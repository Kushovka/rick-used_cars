import { motion, useReducedMotion } from 'framer-motion'
import { Link } from 'react-router'
import { FaPhoneAlt } from 'react-icons/fa'
import type { Vehicle } from '../types/vehicle'
import { formatNumber, formatPrice } from '../utils/format'
import { business } from '../data/business'
import { trackContactCta } from '../utils/ctaTracking'

type VehicleCardProps = {
  vehicle: Vehicle
}

const phoneHref = business.phoneHref || business.contactHref

export const VehicleCard = ({ vehicle }: VehicleCardProps) => {
  const prefersReducedMotion = useReducedMotion()

  return (
  <motion.article
    className="group flex h-full flex-col overflow-hidden border border-[var(--color-border)] bg-[var(--color-surface)] transition hover:border-[var(--color-primary)]"
    initial={prefersReducedMotion ? false : { opacity: 0, clipPath: 'inset(0 0 5% 0)' }}
    whileInView={{ opacity: 1, clipPath: 'inset(0 0 0% 0)' }}
    viewport={{ once: true, amount: 0.15 }}
    transition={{ duration: prefersReducedMotion ? 0.14 : 0.34, ease: [0.16, 1, 0.3, 1] }}
  >
    <Link to={`/inventory/${vehicle.slug}`} className="relative block overflow-hidden">
      <img
        src={vehicle.images[0]}
        alt={`${vehicle.year} ${vehicle.make} ${vehicle.model}`}
        className="h-64 w-full object-cover transition duration-500 group-hover:scale-[1.025]"
        loading="lazy"
      />
      <div className="absolute left-0 top-0 bg-[var(--color-primary)] px-3 py-1.5 text-[11px] font-bold uppercase tracking-[0.1em] text-[#fffdf8]">
        {vehicle.bodyType}
      </div>
    </Link>

    <div className="flex flex-1 flex-col p-5">
      <div>
        {vehicle.stockNumber ? <p className="text-xs font-bold uppercase tracking-[0.1em] text-[var(--color-muted)]">Stock #{vehicle.stockNumber}</p> : null}
        <h3 className="mt-3 line-clamp-2 font-['Barlow_Condensed'] text-3xl font-semibold leading-[0.9] text-[var(--color-text)]">
          {vehicle.year} {vehicle.make} {vehicle.model}
        </h3>
        <p className="mt-1 truncate text-sm text-[var(--color-muted)]">{vehicle.trim}</p>
        <p className="mt-4 text-3xl font-bold tracking-tight text-[var(--color-primary)]">{formatPrice(vehicle.price)}</p>
        <p className="mt-4 border-t border-[var(--color-divider)] pt-3 text-sm text-[var(--color-muted)]">
          {formatNumber(vehicle.mileage)} mi <span className="mx-2 text-[#8B1E1E]">•</span> {vehicle.drivetrain} <span className="mx-2 text-[#8B1E1E]">•</span> {vehicle.transmission}
        </p>
      </div>

      <div className="mt-auto grid gap-3 pt-6 sm:grid-cols-[1fr_auto]">
        <Link
          to={`/inventory/${vehicle.slug}`}
          className="inline-flex h-11 items-center justify-center bg-[var(--color-primary)] px-5 text-sm font-bold uppercase tracking-[0.04em] text-white transition hover:bg-[var(--color-accent)]"
        >
          View Details
        </Link>
        <a
          href={phoneHref}
          target={business.phoneHref ? undefined : '_blank'}
          rel={business.phoneHref ? undefined : 'noreferrer'}
          className="inline-flex h-11 items-center justify-center gap-2 border border-[var(--color-primary)] px-5 text-sm font-bold uppercase tracking-[0.04em] text-[var(--color-primary)] transition hover:bg-[var(--color-hover)]"
          onClick={() => trackContactCta('phone_click', 'Vehicle Card Contact')}
        >
          <FaPhoneAlt className="text-[#8B1E1E]" /> Call
        </a>
      </div>
    </div>
  </motion.article>
  )
}
