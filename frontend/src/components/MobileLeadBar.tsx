import { FaCarSide, FaMapMarkedAlt, FaPhoneAlt } from 'react-icons/fa'
import { Link } from 'react-router'
import { business } from '../data/business'
import { trackContactCta } from '../utils/ctaTracking'

const phoneHref = business.phoneHref || business.contactHref

export const MobileLeadBar = () => (
  <div className="fixed inset-x-0 bottom-0 z-50 grid grid-cols-3 border-t border-[var(--color-border)] bg-[var(--color-background)] shadow-sm lg:hidden">
    <a href={phoneHref} target={business.phoneHref ? undefined : '_blank'} rel={business.phoneHref ? undefined : 'noreferrer'} className="flex min-h-16 flex-col items-center justify-center gap-1 text-xs font-normal text-[var(--color-link)]" onClick={() => trackContactCta('phone_click', 'Mobile Lead Bar Contact')}>
      <FaPhoneAlt className="text-lg" /> Contact
    </a>
    <Link to="/inventory" className="flex min-h-16 flex-col items-center justify-center gap-1 border-x border-[var(--color-border)] text-xs font-normal text-[var(--color-text)]">
      <FaCarSide className="text-lg" /> Inventory
    </Link>
    <a href={business.mapsUrl} target="_blank" rel="noreferrer" className="flex min-h-16 flex-col items-center justify-center gap-1 text-xs font-normal text-[var(--color-text)]" onClick={() => trackContactCta('directions_click', 'Mobile Lead Bar Directions')}>
      <FaMapMarkedAlt className="text-lg" /> Directions
    </a>
  </div>
)
