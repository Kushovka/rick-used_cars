import { AnimatePresence, motion, useReducedMotion } from 'framer-motion'
import { useEffect } from 'react'
import { useLocation, useOutlet } from 'react-router'
import { Header } from './Header'
import { Footer } from './Footer'
import { ScrollToTop } from './ScrollToTop'
import { CookieBanner } from './CookieBanner'
import { initMetaPixel, trackPageView } from '../utils/metaPixel'

export const Layout = () => {
  const location = useLocation()
  const outlet = useOutlet()
  const prefersReducedMotion = useReducedMotion()
  const horizontalOffset = prefersReducedMotion ? 0 : 8

  useEffect(() => {
    initMetaPixel()
    trackPageView()
  }, [location.pathname, location.search])

  return (
    <>
      <ScrollToTop />
      <Header />
      <div className="grid overflow-x-clip">
        <AnimatePresence initial={false} mode="sync">
          <motion.main
            key={location.pathname}
            style={{ gridArea: '1 / 1' }}
            initial={{ opacity: 0, x: horizontalOffset }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -horizontalOffset }}
            transition={{ duration: prefersReducedMotion ? 0.12 : 0.2, ease: [0.22, 1, 0.36, 1] }}
          >
            {outlet}
          </motion.main>
        </AnimatePresence>
      </div>
      <Footer />
      <CookieBanner />
    </>
  )
}
