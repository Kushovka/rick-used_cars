import { FaCheckCircle, FaClipboardCheck, FaFileSignature, FaHandshake, FaShieldAlt, FaTruck, FaUserCheck } from 'react-icons/fa'
import { Button } from '../components/Button'
import { SectionHeading } from '../components/SectionHeading'
import { Seo } from '../components/Seo'
import { business } from '../data/business'

const steps = [
  ['Choose Vehicle', 'Select the vehicle and confirm availability.'],
  ['Confirm Terms', 'Review delivery timing, route, carrier details, and final cost.'],
  ['Paperwork & Payment', 'Complete documents and payment before transport is scheduled.'],
  ['Enclosed Transport', 'The vehicle is loaded into an enclosed carrier for protected transport.'],
  ['Customer Delivery', 'The carrier coordinates arrival and handoff with the customer.'],
]

const stepIcons = [FaClipboardCheck, FaHandshake, FaFileSignature, FaTruck, FaUserCheck]

const deliveryPhotos = [
  ['Pickup area', 'Vehicles are prepared and staged from the dealership lot.'],
  ['Dealership location', 'Customers can confirm the exact Dallas pickup point.'],
  ['Pre-delivery check', 'Condition and readiness are reviewed before handoff.'],
]

export const DeliveryPage = () => (
  <>
    <Seo title="Vehicle Delivery" description="Learn about insured vehicle delivery options from Rick's Used Cars." />
    <section className="section soft-band">
      <SectionHeading eyebrow="Delivery" title="Delivery for out-of-area buyers" text="Enclosed trailer delivery, insured transport, and clear timing make buying from another city or state more straightforward." />
      <div className="mx-auto grid max-w-7xl gap-6 px-4 sm:px-6 lg:grid-cols-2 lg:px-8">
        <div className="surface-card rounded-md p-6">
          <h2 className="text-3xl font-normal text-[var(--color-text)]">How delivery works</h2>
          <div className="mt-6 grid gap-4">
            {steps.map(([title, text], index) => {
              const Icon = stepIcons[index]

              return (
              <div key={title} className="flex gap-4">
                <span className="grid h-10 w-10 shrink-0 place-items-center rounded-md bg-[var(--color-primary)] text-white shadow-sm">
                  <Icon />
                </span>
                <div>
                  <p className="font-normal text-[var(--color-text)]">Step {index + 1}: {title}</p>
                  <p className="mt-1 text-sm font-normal leading-6 text-[var(--color-muted)]">{text}</p>
                </div>
              </div>
              )
            })}
          </div>
          <div className="mt-6 grid gap-2 font-normal text-[var(--color-muted)]">
            <p className="flex gap-2"><FaCheckCircle className="mt-1 text-[var(--color-accent)]" /> Enclosed trailer delivery available</p>
            <p className="flex gap-2"><FaShieldAlt className="mt-1 text-[var(--color-accent)]" /> Insured cargo transport with coverage confirmed before pickup</p>
            <p className="flex gap-2"><FaCheckCircle className="mt-1 text-[var(--color-accent)]" /> Estimated 7-14 business days after payment</p>
          </div>
          <p className="mt-5 text-sm font-normal leading-7 text-[var(--color-muted)]">
            Delivery timing, carrier availability, pickup window, and final transport cost are confirmed before paperwork is completed.
          </p>
          <div className="mt-6"><Button href="/contact">Ask About Delivery</Button></div>
        </div>
        <img className="h-full min-h-[420px] rounded-md object-cover shadow-sm" src={business.streetViewImage} alt="Rick's Used Cars storefront and vehicle lot" />
      </div>
      <div className="mx-auto mt-8 max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="surface-card rounded-md p-6">
          <h2 className="text-2xl font-normal text-[var(--color-text)]">Delivery photo references</h2>
          <p className="mt-2 text-sm font-normal leading-7 text-[var(--color-muted)]">
            Final carrier photos and optional captions can be added when real transport photos are provided.
          </p>
          <div className="mt-5 grid gap-4 md:grid-cols-3">
            {deliveryPhotos.map(([title, text]) => (
              <figure key={title} className="overflow-hidden rounded-md border border-[var(--color-border)] bg-[var(--color-surface)]">
                <img src={business.streetViewImage} alt={title} className="aspect-[4/3] w-full object-cover" loading="lazy" />
                <figcaption className="p-4">
                  <p className="font-normal text-[var(--color-text)]">{title}</p>
                  <p className="mt-1 text-sm font-normal leading-6 text-[var(--color-muted)]">{text}</p>
                </figcaption>
              </figure>
            ))}
          </div>
        </div>
      </div>
    </section>
  </>
)
