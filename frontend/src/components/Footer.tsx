import { motion } from 'framer-motion'
import { Link } from 'react-router'
import { FaArrowRight, FaMap, FaMapMarkerAlt, FaPhoneAlt } from 'react-icons/fa'

import { business } from '../data/business'
import { trackContactCta } from '../utils/ctaTracking'

const siteLinks = [
  ['Inventory', '/inventory'],
  ['Financing', '/financing'],
  ['Trade-In', '/trade-in'],
  ['Warranty', '/warranty'],
  ['About', '/about'],
  ['Contact', '/contact'],
]

const legalLinks = [
  ['Privacy Policy', '/privacy-policy'],
  ['Terms', '/terms'],
]

const phoneHref = business.phoneHref || business.contactHref

export const Footer = () => (
  <motion.footer
    className="home-footer"
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    transition={{ duration: 0.3, ease: 'easeOut' }}
  >
    <span className="home-footer-word" aria-hidden="true">Rick's</span>
    <div className="home-footer-container">
      <div className="home-footer-main">
        <section className="home-footer-brand" aria-label="Rick's Used Cars">
          <Link to="/" className="home-footer-brand-name">
            <span>Rick's</span><strong>Used cars</strong>
          </Link>
          <p className="home-footer-location">Dallas, Pennsylvania</p>
          <p className="home-footer-est">Est. local <i /></p>
          <p className="home-footer-description">
            A straightforward local dealership for used cars, trucks and SUVs — with clear listings and direct help when you need it.
          </p>
        </section>

        <nav className="home-footer-navigation" aria-label="Footer navigation">
          <p className="home-footer-label">Explore</p>
          <div>
            {siteLinks.map(([label, href]) => <Link key={href} to={href}>{label}</Link>)}
          </div>
        </nav>

        <section className="home-footer-contact" aria-label="Visit and contact">
          <p className="home-footer-label">Visit / contact</p>
          <div className="home-footer-contact-list">
            <a href={business.mapsUrl} target="_blank" rel="noreferrer" className="home-footer-contact-row" onClick={() => trackContactCta('directions_click', 'Footer Address')}>
              <FaMapMarkerAlt /><span>{business.address}<br />{business.cityState} {business.postalCode}</span>
            </a>
            <a href={phoneHref} target={business.phoneHref ? undefined : '_blank'} rel={business.phoneHref ? undefined : 'noreferrer'} className="home-footer-contact-row" onClick={() => trackContactCta('phone_click', 'Footer Call Now')}>
              <FaPhoneAlt /><span>{business.phone}</span>
            </a>
            <a href={business.mapsUrl} target="_blank" rel="noreferrer" className="home-footer-contact-row home-footer-directions" onClick={() => trackContactCta('directions_click', 'Footer Directions')}>
              <FaMap /><span>Get directions <FaArrowRight /></span>
            </a>
          </div>
        </section>
      </div>

      <div className="home-footer-legal">
        <p>© 2026 Rick's Used Cars. All rights reserved.</p>
        <div>
          {legalLinks.map(([label, href]) => <Link key={href} to={href}>{label}</Link>)}
        </div>
      </div>
    </div>
  </motion.footer>
)
