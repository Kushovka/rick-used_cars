import { motion } from 'framer-motion'
import { Link } from 'react-router'
import { FaArrowRight, FaClock, FaMapMarkerAlt, FaPhoneAlt } from 'react-icons/fa'

import { business } from '../data/business'
import { trackContactCta } from '../utils/ctaTracking'

const inventoryLinks = [
  ['Inventory', '/inventory'],
  ['Warranty', '/warranty'],
]

const informationLinks = [
  ['About', '/about'],
  ['Our Team', '/team'],
  ['Contact Us', '/contact'],
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
    <div className="home-footer-container">
      <div className="home-footer-main">
        <section className="home-footer-contact" aria-label="Contact Rick's Used Cars">
          <p className="home-footer-label">Contact us</p>
          <a href={business.mapsUrl} target="_blank" rel="noreferrer" className="home-footer-address" onClick={() => trackContactCta('directions_click', 'Footer Address')}><FaMapMarkerAlt /><span>{business.address}<br />{business.cityState} {business.postalCode}</span></a>
          <a href={business.mapsUrl} target="_blank" rel="noreferrer" className="home-footer-directions" onClick={() => trackContactCta('directions_click', 'Footer Directions')}>Get directions <FaArrowRight /></a>
          <a href={phoneHref} target={business.phoneHref ? undefined : '_blank'} rel={business.phoneHref ? undefined : 'noreferrer'} className="home-footer-phone" onClick={() => trackContactCta('phone_click', 'Footer Call Now')}><FaPhoneAlt />{business.phone}</a>
        </section>

        <section className="home-footer-hours" aria-label="Business hours"><p className="home-footer-label">Business hours</p><div className="home-footer-hours-list"><FaClock />{business.hoursList.map(([day, hours]) => <p key={day}><span>{day}</span><strong>{hours}</strong></p>)}</div></section>

        <nav className="home-footer-links" aria-label="Inventory links"><p className="home-footer-label">Explore</p>{inventoryLinks.map(([label, href]) => <Link key={href} to={href}>{label}</Link>)}</nav>
        <nav className="home-footer-links" aria-label="Useful links"><p className="home-footer-label">Useful links</p>{informationLinks.map(([label, href]) => <Link key={href} to={href}>{label}</Link>)}</nav>
        <section className="home-footer-brand" aria-label="Rick's Used Cars"><Link to="/" className="home-footer-brand-name"><span>Rick's</span><strong>Used cars</strong></Link><p>{business.legalNote}</p><p>{business.shortLocation}</p></section>
      </div>

      <div className="home-footer-bottom">
        <p>For current availability and pricing, please call the dealership.</p>
        <div className="home-footer-legal"><span>© 2026 Rick's Used Cars. All rights reserved.</span>{legalLinks.map(([label, href]) => <Link key={href} to={href}>{label}</Link>)}</div>
      </div>
    </div>
  </motion.footer>
)
