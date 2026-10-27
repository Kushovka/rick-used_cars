import { FaBan, FaCheck, FaCheckCircle, FaExclamation, FaShieldAlt } from 'react-icons/fa'
import { Seo } from '../components/Seo'

const covered = ['Internal engine components', 'Internal transmission components', 'Drive axles and axle shafts', 'Driveshaft', 'A/C and heating', 'Electrical: windows, locks, sensors, multimedia']
const notCovered = ['Brakes and tires', 'Suspension and steering', 'Battery, belts, hoses, filters', 'Cosmetic damage', 'Scheduled maintenance']
const voids = ['Aftermarket parts or tuning', 'Missed maintenance', 'Accident damage', 'Towing beyond rating, off-road use, or racing', 'Repair outside dealer-authorized service']

const leftTerms = [
  ['Money-back guarantee', 'Every vehicle purchase includes the same 72-hour / 250-mile money-back guarantee, starting at pickup or delivery. The window ends when either limit is reached first.'],
  ['Warranty start date', 'The 90-day warranty starts when you take possession of the vehicle, at pickup or delivery.'],
  ['Maintenance records', 'Keep all service and maintenance receipts to support warranty repairs.'],
]
const rightTerms = [
  ['Return process', 'For a return requested within the 72-hour / 250-mile window, Rick’s Used Cars coordinates the return and refund.'],
  ['Warranty term', 'Every vehicle includes the same 90-day / 3,000-mile warranty. Coverage ends when either limit is reached first.'],
  ['Written agreements', 'Keep all promises, approvals, and repair instructions in writing before authorizing work.'],
  ['Warranty support', "Contact Rick's Used Cars for help with warranty service."],
]

const TermsColumn = ({ terms }: { terms: string[][] }) => (
  <div className="warranty-terms-column">
    {terms.map(([title, text]) => <article key={title} className="warranty-term"><h3>{title}</h3><p>{text}</p></article>)}
  </div>
)

export const WarrantyPage = () => (
  <>
    <Seo title="Warranty and Returns" description="Review warranty and return policy details for used vehicles at Rick's Used Cars." />
    <main className="warranty-page">
      <section className="warranty-hero" aria-labelledby="warranty-hero-title">
        <div className="warranty-hero-shade" />
        <div className="warranty-container warranty-hero-container">
          <div className="warranty-hero-copy">
            <p className="hero-page-label">Warranty <i /></p>
            <h1 id="warranty-hero-title">Drive away <span>with confidence.</span></h1>
            <p className="warranty-hero-lead">Clear warranty and return terms, explained before you buy.</p>
            <p className="warranty-hero-subtitle">Straightforward coverage. Clear terms. Local support.</p>
          </div>
        </div>
      </section>

      <section className="warranty-summary" aria-label="Warranty summary">
        <div className="warranty-container">
          <div className="warranty-summary-grid">
            <article className="warranty-summary-item"><FaShieldAlt className="warranty-summary-shield" aria-hidden="true" /><span className="warranty-summary-number">01</span><div><h2>72-hour / 250-mile money-back guarantee</h2><p>Included with every vehicle purchase.</p></div></article>
            <article className="warranty-summary-item"><FaShieldAlt className="warranty-summary-shield" aria-hidden="true" /><span className="warranty-summary-number">02</span><div><h2>90-Day / 3,000-Mile Warranty</h2><p>Included with every vehicle purchase. See covered components below.</p></div></article>
          </div>
          <p className="warranty-summary-note">The same warranty and money-back guarantee apply to every vehicle. Each ends when its time or mileage limit is reached first.</p>
        </div>
      </section>

      <section className="warranty-coverage" aria-labelledby="coverage-title">
        <div className="warranty-container">
          <div className="warranty-coverage-intro"><div><p className="warranty-eyebrow">Coverage at a glance <i /></p><h2 id="coverage-title">Know what’s covered<br />before you drive away.</h2></div><p>We keep the important details easy to understand<br className="hidden lg:block" /> so you know what to expect.</p></div>
          <div className="warranty-cards">
            <article className="warranty-card warranty-card--covered"><header><FaCheckCircle aria-hidden="true" /><h3>Covered</h3></header><ul>{covered.map((item) => <li key={item}><span><FaCheck /></span>{item}</li>)}</ul><p className="warranty-card-note">These covered components are included<br />with every vehicle warranty.</p></article>
            <article className="warranty-card"><header><FaBan aria-hidden="true" /><h3>Not covered</h3></header><ul>{notCovered.map((item) => <li key={item}><FaBan />{item}</li>)}</ul><p className="warranty-card-note">These items are excluded from<br />every vehicle warranty.</p></article>
            <article className="warranty-card"><header><span className="warranty-warning"><FaExclamation /></span><h3>What voids coverage</h3></header><ul>{voids.map((item) => <li key={item}><FaBan />{item}</li>)}</ul><p className="warranty-card-note">These warranty conditions apply<br />to every vehicle.</p></article>
          </div>
        </div>
      </section>

      <section className="warranty-terms" aria-labelledby="terms-title"><div className="warranty-container"><div className="warranty-terms-panel"><h2 id="terms-title">Important buyer terms <i /></h2><div className="warranty-terms-grid"><TermsColumn terms={leftTerms} /><TermsColumn terms={rightTerms} /></div></div></div></section>
    </main>
  </>
)
