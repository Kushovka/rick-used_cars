import { FaArrowRight, FaClock, FaMap, FaMapMarkerAlt, FaPhoneAlt } from 'react-icons/fa'
import { LeadForm } from '../components/LeadForm'
import { Seo } from '../components/Seo'
import { business } from '../data/business'
import { trackContactCta } from '../utils/ctaTracking'

const phoneHref = business.phoneHref || business.contactHref

export const ContactPage = () => (
  <main className="contact-page">
    <Seo title="Contact" description="Call, visit, or send a message to Rick's Used Cars in Dallas, PA." />

    <section className="contact-hero" aria-labelledby="contact-hero-title">
      <div className="contact-hero-shade" />
      <div className="contact-container contact-hero-container">
        <div className="contact-hero-copy">
          <p className="hero-page-label">Contact <i /></p>
          <h1 id="contact-hero-title">Let’s get you <span>on the road.</span></h1>
          <p className="contact-hero-lead">Call, visit, or send us a message.<br />We’re here to help.</p>
        </div>
      </div>
    </section>

    <section className="contact-details" aria-labelledby="contact-details-title">
      <div className="contact-container contact-details-grid">
        <div className="contact-information">
          <p className="contact-eyebrow">Visit / contact <i /></p>
          <h2 id="contact-details-title">{business.name}</h2>

          <div className="contact-facts">
            <a href={business.mapsUrl} target="_blank" rel="noreferrer" className="contact-fact" onClick={() => trackContactCta('directions_click', 'Contact Page Address')}>
              <FaMapMarkerAlt aria-hidden="true" />
              <span>{business.address}<br />{business.cityState} {business.postalCode}</span>
            </a>
            <a href={phoneHref} target={business.phoneHref ? undefined : '_blank'} rel={business.phoneHref ? undefined : 'noreferrer'} className="contact-fact" onClick={() => trackContactCta('phone_click', 'Contact Page Contact')}>
              <FaPhoneAlt aria-hidden="true" />
              <span>{business.phone}</span>
            </a>
            <div className="contact-fact">
              <FaClock aria-hidden="true" />
              <span><strong>{business.hours}</strong><small>Hours may vary. Please call for the<br className="hidden lg:block" /> most up-to-date information.</small></span>
            </div>
          </div>

          <div className="contact-actions">
            <a href={phoneHref} target={business.phoneHref ? undefined : '_blank'} rel={business.phoneHref ? undefined : 'noreferrer'} className="contact-action contact-action-primary" onClick={() => trackContactCta('phone_click', 'Contact Page Call Now')}><FaPhoneAlt aria-hidden="true" /> Call now</a>
            <a href={business.mapsUrl} target="_blank" rel="noreferrer" className="contact-action contact-action-secondary" onClick={() => trackContactCta('directions_click', 'Contact Page Directions')}><FaMap aria-hidden="true" /> Get directions <FaArrowRight className="contact-action-arrow" aria-hidden="true" /></a>
          </div>
          <p className="contact-financing-note">No financing available</p>
        </div>

        <div className="contact-message">
          <p className="contact-eyebrow">Send us a message <i /></p>
          <h2>Have a question?<br />We’re here to help.</h2>
          <LeadForm title="Send a Message" variant="contact" />
        </div>
      </div>
    </section>

    <section className="contact-map-section" aria-labelledby="location-heading">
      <div className="contact-container">
        <div className="contact-map-heading">
          <div>
            <p className="contact-eyebrow">Visit the lot <i /></p>
            <h2 id="location-heading">Find Rick’s Used Cars in Dallas.</h2>
          </div>
          <a href={business.mapsUrl} target="_blank" rel="noreferrer" onClick={() => trackContactCta('directions_click', 'Contact Page Map Directions')}>{business.address}, {business.cityState} {business.postalCode}</a>
        </div>
        <iframe title="Rick's Used Cars map" className="contact-map" loading="eager" referrerPolicy="no-referrer-when-downgrade" src={business.mapEmbedUrl} />
      </div>
    </section>
  </main>
)
