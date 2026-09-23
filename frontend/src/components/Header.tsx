import { AnimatePresence, motion } from 'framer-motion'
import { useState } from 'react'
import { Link, NavLink } from 'react-router'
import { FaBars, FaPhoneAlt, FaTimes } from 'react-icons/fa'
import { business } from '../data/business'
import { trackContactCta } from '../utils/ctaTracking'

const desktopNavItems = [
  { label: 'Inventory', href: '/inventory' },
  { label: 'Financing', href: '/financing' },
  { label: 'Trade-In', href: '/trade-in' },
  { label: 'Warranty', href: '/warranty' },
  { label: 'About', href: '/about' },
  { label: 'Contact', href: '/contact' },
]

const mobileNavItems = [
  { label: 'Inventory', href: '/inventory' },
  { label: 'Financing', href: '/financing' },
  { label: 'Trade-In', href: '/trade-in' },
  { label: 'Warranty', href: '/warranty' },
  { label: 'About', href: '/about' },
  { label: 'Contact', href: '/contact' },
]

export const Header = () => {
  const [open, setOpen] = useState(false)
  const phoneHref = business.phoneHref || business.contactHref

  return (
    <motion.header
      className="sticky inset-x-0 top-0 z-50 border-b border-[var(--color-border)] bg-[rgba(245,241,232,0.96)] backdrop-blur"
      initial={{ opacity: 0, y: -8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.24, ease: 'easeOut' }}
    >
      <div className="mx-auto flex h-[78px] max-w-[1536px] items-center justify-between gap-6 px-5 sm:px-8 lg:px-[5.5rem]">
        <Link
          to="/"
          className="flex min-w-0 items-center focus:outline-none focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-3 focus-visible:outline-[var(--color-accent)]"
          onClick={() => setOpen(false)}
        >
          <span className="block shrink-0 font-['Barlow_Condensed'] text-[25px] font-bold uppercase leading-[0.78] tracking-[-0.03em] text-[var(--color-primary)] sm:text-[29px]">
            Rick's <span className="block text-[12px] tracking-[0.16em] text-[var(--color-accent)]">Used Cars</span>
          </span>
        </Link>

        <div className="hidden h-full items-center justify-end gap-7 lg:flex">
          <nav className="flex items-center justify-end gap-9 xl:gap-11">
            {desktopNavItems.map((item) => (
              <NavLink
                key={item.href}
                to={item.href}
                className={({ isActive }) =>
                  `text-[15px] font-medium transition ${
                    isActive
                      ? 'text-[var(--color-accent)]'
                      : 'text-[var(--color-text)] hover:text-[var(--color-accent)]'
                  }`
                }
              >
                {item.label}
              </NavLink>
            ))}
          </nav>

          <a
            href={phoneHref}
            target={business.phoneHref ? undefined : '_blank'}
            rel={business.phoneHref ? undefined : 'noreferrer'}
            className="inline-flex h-11 items-center justify-center gap-2 bg-[var(--color-primary)] px-6 text-sm font-bold text-[#fffdf8] transition hover:bg-[var(--color-accent)]"
            onClick={() => trackContactCta('phone_click', 'Header Call Now')}
          >
            <FaPhoneAlt className="text-xs text-[var(--color-accent)]" />
            {business.phone}
          </a>
        </div>

        <div className="flex h-full items-center lg:hidden">
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
            className="z-50 overflow-y-auto px-5 pb-8 pt-5 lg:hidden"
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
