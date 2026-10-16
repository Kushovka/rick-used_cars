import { useRef, useState } from 'react'
import { FaCheck, FaTimes } from 'react-icons/fa'
import { LeadForm } from '../components/LeadForm'
import { Seo } from '../components/Seo'
import { trackContactCta } from '../utils/ctaTracking'

const expectations = [
  'Delivery coordination across the United States',
  'Transport suited to cars, trucks, and SUVs',
  'A delivery estimate before you commit',
  'Pickup and delivery communication',
  'Support from purchase through arrival',
]

export const DeliveryPage = () => {
  const quoteDialogRef = useRef<HTMLDialogElement>(null)
  const [quoteVisible, setQuoteVisible] = useState(false)

  const openQuoteDialog = () => {
    const dialog = quoteDialogRef.current
    if (!dialog || dialog.open) return

    dialog.showModal()
    window.requestAnimationFrame(() => setQuoteVisible(true))
  }

  const closeQuoteDialog = () => {
    const dialog = quoteDialogRef.current
    if (!dialog?.open) return

    setQuoteVisible(false)
    window.setTimeout(() => dialog.close(), 220)
  }

  return (
    <>
    <Seo title="Nationwide Vehicle Delivery" description="Coordinate nationwide vehicle delivery from Rick's Used Cars in Dallas, Pennsylvania." />
    <main className="bg-[var(--color-background)]">
      <section className="relative isolate h-[var(--subpage-hero-height)] overflow-hidden bg-[var(--color-primary)] text-[#fffdf8]">
        <img src="/images/delivery-transport-hero.webp" alt="Vehicle being loaded into an enclosed transport trailer" className="absolute inset-0 h-full w-full object-cover object-[62%_center] sm:object-center" fetchPriority="high" />
        <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(7,29,23,.97),rgba(7,29,23,.83)_55%,rgba(7,29,23,.28))] sm:bg-[linear-gradient(90deg,rgba(7,29,23,.98)_0%,rgba(7,29,23,.91)_29%,rgba(7,29,23,.41)_51%,rgba(7,29,23,.04)_76%)]" />
        <div className="relative mx-auto flex h-[var(--subpage-hero-height)] max-w-[1400px] items-center px-5 py-10 sm:px-8 lg:px-10 xl:px-9">
          <div className="max-w-[630px]">
            <p className="hero-page-label">Delivery <i /></p>
            <h1 className="mt-4 font-['Barlow_Condensed'] text-[48px] font-bold uppercase leading-[.88] tracking-[-.035em] sm:text-[64px] lg:text-[82px]">Nationwide<br /><span className="text-[var(--color-accent)]">vehicle delivery.</span></h1>
            <p className="mt-4 max-w-[630px] text-[15px] leading-6 text-white/90 sm:text-[17px] sm:leading-7">Found the right vehicle but live outside Dallas? Rick&apos;s Used Cars can coordinate delivery to your home, business, or another approved destination.</p>
            <button type="button" onClick={() => { trackContactCta('contact_form_click', 'Delivery Hero Estimate'); openQuoteDialog() }} className="mt-5 inline-flex min-h-11 items-center justify-center bg-[var(--color-accent)] px-5 text-sm font-bold text-white transition hover:bg-[var(--color-accent-dark)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white">Get a delivery estimate</button>
            <p className="mt-3 text-[11px] font-bold uppercase tracking-[0.12em] text-white/80">No financing available</p>
          </div>
        </div>
      </section>

      <section className="px-5 py-14 sm:px-8 sm:py-20 lg:px-10 xl:px-0">
        <div className="mx-auto grid max-w-[1380px] gap-12 lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)] lg:items-start lg:gap-20">
          <div className="max-w-[650px]">
            <h2 className="font-['Barlow_Condensed'] text-[48px] font-bold uppercase leading-[.88] tracking-[-.035em] text-[var(--color-primary)] sm:text-[64px]">Delivery made simple.</h2>
            <div className="mt-5 max-w-[640px] space-y-4 text-[16px] leading-7 text-[var(--color-muted)] sm:text-[18px] sm:leading-8">
              <p><strong className="font-bold text-[var(--color-text)]">Found the right vehicle but live outside Dallas?</strong> Rick&apos;s Used Cars can coordinate nationwide delivery to your home, business, or another approved destination.</p>
              <p>Our team works with experienced vehicle transport providers to arrange the pickup, route, delivery window, and handling requirements for your vehicle. We can also help remote buyers review available photos, video, paperwork, and purchase steps before transport is scheduled.</p>
            </div>
            <div className="mt-10">
              <h3 className="font-['Barlow_Condensed'] text-[31px] font-bold uppercase leading-none tracking-[-.025em] text-[var(--color-primary)] sm:text-[38px]">What you can expect</h3>
              <ul className="mt-5 divide-y divide-[var(--color-divider)] border-y border-[var(--color-divider)]">
                {expectations.map((expectation) => <li key={expectation} className="flex gap-4 py-3.5 text-[15px] leading-6 text-[var(--color-text)] sm:py-4 sm:text-base"><span className="mt-0.5 grid h-6 w-6 shrink-0 place-items-center rounded-full bg-[var(--color-primary)] text-[10px] text-white"><FaCheck aria-hidden="true" /></span>{expectation}</li>)}
              </ul>
            </div>
          </div>
          <div id="delivery-quote" className="scroll-mt-[calc(var(--header-height)+1rem)]">
            <LeadForm title="Request delivery quote" messagePlaceholder="Destination city, state, and ZIP code" />
          </div>
        </div>
      </section>
    </main>
    <dialog
      ref={quoteDialogRef}
      aria-labelledby="delivery-quote-title"
      className={`lead-form-dialog m-auto max-h-[90dvh] w-[calc(100%-2rem)] max-w-[600px] overflow-y-auto border border-[var(--color-border)] bg-[var(--color-background)] p-0 text-[var(--color-text)] shadow-[0_24px_80px_rgba(0,0,0,0.42)] ${quoteVisible ? 'is-visible' : ''}`}
      onCancel={(event) => { event.preventDefault(); closeQuoteDialog() }}
      onClick={(event) => { if (event.target === event.currentTarget) closeQuoteDialog() }}
    >
      <div className="flex items-start justify-between gap-5 border-b border-[var(--color-divider)] bg-[var(--color-surface)] px-5 py-4 sm:px-7">
        <div>
          <h2 id="delivery-quote-title" className="font-['Barlow_Condensed'] text-3xl font-bold uppercase leading-none tracking-[-.02em] text-[var(--color-primary)] sm:text-4xl">Request delivery quote</h2>
          <p className="mt-2 text-sm leading-6 text-[var(--color-muted)]">Tell us where you would like the vehicle delivered.</p>
        </div>
        <button type="button" aria-label="Close delivery estimate form" onClick={closeQuoteDialog} className="grid h-10 w-10 shrink-0 place-items-center text-[var(--color-muted)] transition hover:bg-[var(--color-hover)] hover:text-[var(--color-primary)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-accent)]">
          <FaTimes aria-hidden="true" />
        </button>
      </div>
      <div className="p-4 sm:p-6">
        <LeadForm title="Request delivery quote" messagePlaceholder="Destination city, state, and ZIP code" />
      </div>
    </dialog>
  </>
  )
}
