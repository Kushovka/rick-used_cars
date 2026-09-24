import { AnimatePresence, motion } from 'framer-motion'
import { useEffect, useState } from 'react'
import { Link, NavLink, useNavigate } from 'react-router'
import { FaBars, FaChevronDown, FaPhoneAlt, FaSearch, FaTimes } from 'react-icons/fa'
import { listVehicles } from '../api/vehicles'
import { business } from '../data/business'
import type { Vehicle } from '../types/vehicle'
import { trackContactCta } from '../utils/ctaTracking'

const desktopNavItems = [
  { label: 'Inventory', href: '/inventory' },
  { label: 'Warranty', href: '/warranty' },
  { label: 'Delivery', href: '/delivery' },
  { label: 'About', href: '/about' },
]

const mobileNavItems = [
  { label: 'Inventory', href: '/inventory' },
  { label: 'Warranty', href: '/warranty' },
  { label: 'Delivery', href: '/delivery' },
  { label: 'About', href: '/about' },
  { label: 'Contact Us', href: '/contact' },
  { label: 'Our Team', href: '/team' },
]

const HeaderSearch = () => {
  const navigate = useNavigate()
  const [query, setQuery] = useState('')
  const [matches, setMatches] = useState<Vehicle[]>([])
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    const term = query.trim()
    if (term.length < 2) {
      setMatches([])
      setLoading(false)
      return
    }

    let cancelled = false
    setLoading(true)
    listVehicles({ q: term, pageSize: 4 })
      .then((response) => { if (!cancelled) setMatches(response.items) })
      .catch(() => { if (!cancelled) setMatches([]) })
      .finally(() => { if (!cancelled) setLoading(false) })

    return () => { cancelled = true }
  }, [query])

  const viewSearch = () => {
    const term = query.trim()
    if (term) navigate(`/inventory?q=${encodeURIComponent(term)}`)
  }

  return <div className="relative w-[250px] 2xl:w-[292px]">
    <label className="relative block">
      <span className="sr-only">Search inventory</span>
      <FaSearch aria-hidden="true" className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-[11px] text-[var(--color-muted)]" />
      <input
        className="h-12 w-full border border-[var(--color-border)] bg-[var(--color-surface)] py-0 pl-9 pr-9 text-[12px] text-[var(--color-text)] outline-none placeholder:text-[var(--color-muted)] focus:border-[var(--color-primary)]"
        type="text"
        inputMode="search"
        value={query}
        onChange={(event) => setQuery(event.target.value)}
        onKeyDown={(event) => { if (event.key === 'Enter') { event.preventDefault(); viewSearch() } if (event.key === 'Escape') setQuery('') }}
        placeholder="Search inventory"
      />
      {query ? <button type="button" aria-label="Clear inventory search" onClick={() => setQuery('')} className="absolute right-0 top-0 grid h-12 w-9 place-items-center text-[var(--color-muted)] transition hover:text-[var(--color-primary)]"><FaTimes aria-hidden="true" /></button> : null}
    </label>
    {query.trim().length >= 2 ? <div className="absolute right-0 top-[calc(100%+0.5rem)] z-50 w-[min(360px,calc(100vw-2.5rem))] border border-[var(--color-border)] bg-[var(--color-surface)] shadow-[0_12px_28px_rgba(23,34,27,0.16)]">
      {loading ? <p className="px-4 py-3 text-[11px] text-[var(--color-muted)]">Searching inventory…</p> : matches.length ? <><div className="divide-y divide-[var(--color-divider)]">{matches.map((vehicle) => <Link key={vehicle.id} to={`/inventory/${vehicle.slug}`} onClick={() => setQuery('')} className="flex items-center gap-3 px-3 py-2.5 transition hover:bg-[var(--color-background)]"><img src={vehicle.images[0]} alt="" className="h-12 w-16 shrink-0 object-cover" /><span className="min-w-0"><strong className="block truncate font-['Barlow_Condensed'] text-[17px] font-bold leading-none text-[var(--color-primary)]">{vehicle.year} {vehicle.make} {vehicle.model}</strong><span className="mt-1 block text-[10px] text-[var(--color-muted)]">{vehicle.trim || 'Available now'}</span></span></Link>)}</div><button type="button" onClick={viewSearch} className="flex h-10 w-full items-center justify-center border-t border-[var(--color-divider)] text-[10px] font-bold uppercase tracking-[0.08em] text-[var(--color-primary)] transition hover:bg-[var(--color-background)] hover:text-[var(--color-accent)]">View all results</button></> : <p className="px-4 py-3 text-[11px] text-[var(--color-muted)]">No vehicles match “{query.trim()}”.</p>}
    </div> : null}
  </div>
}

export const Header = () => {
  const [open, setOpen] = useState(false)
  const [desktopContactOpen, setDesktopContactOpen] = useState(false)
  const [desktopContactSuppressed, setDesktopContactSuppressed] = useState(false)
  const phoneHref = business.phoneHref || business.contactHref
  const closeDesktopContactMenu = () => {
    setDesktopContactOpen(false)
    setDesktopContactSuppressed(true)
  }

  return (
    <motion.header
      className="sticky inset-x-0 top-0 z-50 border-b border-[var(--color-border)] bg-[rgba(245,241,232,0.96)] backdrop-blur"
      initial={{ opacity: 0, y: -8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.24, ease: 'easeOut' }}
    >
      <div className="mx-auto grid h-[var(--header-height)] max-w-[1728px] grid-cols-[1fr_auto] items-center gap-6 px-5 sm:px-8 xl:grid-cols-[1fr_auto_1fr] xl:px-[5.5rem]">
        <Link
          to="/"
          className="flex min-w-0 items-center focus:outline-none focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-3 focus-visible:outline-[var(--color-accent)]"
          onClick={() => setOpen(false)}
        >
          <span className="block shrink-0 font-['Barlow_Condensed'] text-[25px] font-bold uppercase leading-[0.78] tracking-[-0.03em] text-[var(--color-primary)] sm:text-[29px] xl:text-[56px]">
            Rick's <span className="block text-[12px] tracking-[0.16em] text-[var(--color-accent)] xl:text-[18px]">Used Cars</span>
          </span>
        </Link>

        <nav className="hidden items-center justify-self-center gap-10 xl:flex 2xl:gap-12">
          {desktopNavItems.map((item) => (
            <NavLink
              key={item.href}
              to={item.href}
              className={({ isActive }) =>
                `text-[16px] font-semibold transition ${
                  isActive
                    ? 'text-[var(--color-accent)]'
                    : 'text-[var(--color-text)] hover:text-[var(--color-accent)]'
                }`
              }
            >
              {item.label}
            </NavLink>
          ))}
          <div
            className="relative flex h-full items-center"
            onMouseEnter={() => {
              if (!desktopContactSuppressed) setDesktopContactOpen(true)
            }}
            onMouseLeave={() => {
              setDesktopContactOpen(false)
              setDesktopContactSuppressed(false)
            }}
          >
            <NavLink
              to="/contact"
              onClick={closeDesktopContactMenu}
              className={({ isActive }) =>
                `inline-flex items-center gap-1.5 text-[16px] font-semibold transition ${
                  isActive
                    ? 'text-[var(--color-accent)]'
                    : 'text-[var(--color-text)] hover:text-[var(--color-accent)]'
                }`
              }
            >
              Contact <FaChevronDown className={`text-[9px] transition-transform duration-200 ${desktopContactOpen ? 'rotate-180' : ''}`} />
            </NavLink>
            <div className={`absolute right-[-0.75rem] top-full z-50 w-48 border border-[var(--color-border)] bg-[var(--color-surface)] p-2 transition duration-200 ${desktopContactOpen ? 'pointer-events-auto translate-y-0 opacity-100' : 'pointer-events-none translate-y-1 opacity-0'}`}>
              <NavLink to="/contact" onClick={closeDesktopContactMenu} className={({ isActive }) => `block px-3 py-2.5 text-sm font-medium transition ${isActive ? 'bg-[var(--color-background)] text-[var(--color-accent)]' : 'text-[var(--color-text)] hover:bg-[var(--color-background)] hover:text-[var(--color-accent)]'}`}>Contact Us</NavLink>
              <NavLink to="/team" onClick={closeDesktopContactMenu} className={({ isActive }) => `block px-3 py-2.5 text-sm font-medium transition ${isActive ? 'bg-[var(--color-background)] text-[var(--color-accent)]' : 'text-[var(--color-text)] hover:bg-[var(--color-background)] hover:text-[var(--color-accent)]'}`}>Our Team</NavLink>
            </div>
          </div>
        </nav>

        <div className="hidden h-full items-center justify-self-end gap-3 xl:flex">
          <HeaderSearch />
          <a
            href={phoneHref}
            target={business.phoneHref ? undefined : '_blank'}
            rel={business.phoneHref ? undefined : 'noreferrer'}
            className="inline-flex h-12 items-center justify-center gap-2 whitespace-nowrap bg-[var(--color-primary)] px-7 text-[15px] font-bold text-[#fffdf8] transition hover:bg-[var(--color-accent)]"
            onClick={() => trackContactCta('phone_click', 'Header Call Now')}
          >
            <FaPhoneAlt className="text-xs text-[var(--color-accent)]" />
            {business.phone}
          </a>
        </div>

        <div className="flex h-full items-center xl:hidden">
          <button
            aria-label="Open menu"
            className="grid h-10 w-10 place-items-center border border-[var(--color-primary)] text-[var(--color-primary)]"
            onClick={() => setOpen((value) => !value)}
            type="button"
          >
            {open ? <FaTimes /> : <FaBars />}
          </button>
        </div>
      </div>

      <AnimatePresence>
        {open ? (
          <motion.div
            className="z-50 overflow-y-auto px-5 pb-8 pt-5 xl:hidden"
            style={{ position: 'fixed', inset: 0, minHeight: '100dvh', backgroundColor: '#070707', zIndex: 100 }}
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
          >
          <div className="flex items-center justify-between">
            <Link to="/" className="flex h-10 items-center" onClick={() => setOpen(false)}>
              <span className="font-['Barlow_Condensed'] text-[25px] font-bold uppercase leading-[0.78] tracking-[-0.03em] text-white">
                Rick's <span className="block text-[12px] tracking-[0.16em] text-[var(--color-accent)]">Used Cars</span>
              </span>
            </Link>
            <button
              aria-label="Close menu"
              className="grid h-11 w-11 place-items-center rounded-md border border-[rgba(255,255,255,0.18)] text-white"
              onClick={() => setOpen(false)}
              type="button"
            >
              <FaTimes />
            </button>
          </div>

          <nav className="mt-12 grid gap-1">
            {mobileNavItems.map((item) => (
              <NavLink
                key={item.href}
                to={item.href}
                onClick={() => setOpen(false)}
                className={({ isActive }) =>
                  `border-b border-[rgba(255,255,255,0.08)] py-4 text-2xl font-normal transition ${
                    isActive
                      ? 'text-white'
                      : 'text-[rgba(255,255,255,0.78)] hover:text-white'
                  }`
                }
              >
                {item.label}
              </NavLink>
            ))}
          </nav>

          <div className="mt-10 grid gap-3">
            <Link
              to="/inventory"
              className="inline-flex h-12 items-center justify-center rounded-md bg-[#8B1E1E] px-5 text-sm font-medium uppercase tracking-[0.04em] text-white transition hover:bg-[#6F1717]"
              onClick={() => setOpen(false)}
            >
              View Inventory
            </Link>
            <div className="grid grid-cols-2 gap-3">
              <a href={phoneHref} target={business.phoneHref ? undefined : '_blank'} rel={business.phoneHref ? undefined : 'noreferrer'} className="inline-flex h-12 items-center justify-center rounded-md border border-[rgba(255,255,255,0.18)] px-4 text-sm font-medium uppercase tracking-[0.04em] text-white" onClick={() => { setOpen(false); trackContactCta('phone_click', 'Mobile Menu Contact') }}>
              Call Now
              </a>
              <a href={business.mapsUrl} target="_blank" rel="noreferrer" className="inline-flex h-12 items-center justify-center rounded-md border border-[rgba(255,255,255,0.18)] px-4 text-sm font-medium uppercase tracking-[0.04em] text-white" onClick={() => { setOpen(false); trackContactCta('directions_click', 'Mobile Menu Directions') }}>
                Directions
              </a>
            </div>
          </div>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </motion.header>
  )
}
