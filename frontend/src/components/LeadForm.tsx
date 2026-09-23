import { motion, useReducedMotion } from 'framer-motion'
import { useMemo, useState } from 'react'
import { FaArrowRight, FaLock } from 'react-icons/fa'
import { createLead } from '../api/leads'
import { trackingConfig } from '../config/tracking'
import { createMetaEventId, getCookieValue, splitName, trackLead } from '../utils/metaPixel'

type LeadFormProps = {
  title: string
  vehicleId?: string
  vehicleName?: string
  vehicleValue?: number
  fields?: 'contact' | 'finance' | 'trade'
  showSubject?: boolean
  variant?: 'contact' | 'default' | 'vehicle' | 'finance' | 'trade'
}

const COUNTRY_CODE_PREFIX = '+1 '

const getPhoneDigits = (value: string) => {
  const digits = value.replace(/\D/g, '')
  const hasCountryCode = value.trim().startsWith('+1') || digits.length > 10
  const localDigits = hasCountryCode && digits.startsWith('1') ? digits.slice(1) : digits

  return localDigits.slice(0, 10)
}

const formatUsPhone = (value: string) => {
  const digits = getPhoneDigits(value)

  if (!digits) return ''
  if (digits.length <= 3) return `${COUNTRY_CODE_PREFIX}(${digits}`
  if (digits.length <= 6) return `${COUNTRY_CODE_PREFIX}(${digits.slice(0, 3)}) ${digits.slice(3)}`

  return `${COUNTRY_CODE_PREFIX}(${digits.slice(0, 3)}) ${digits.slice(3, 6)}-${digits.slice(6)}`
}

export const LeadForm = ({ title, vehicleId, vehicleName, vehicleValue, fields = 'contact', showSubject = false, variant = 'default' }: LeadFormProps) => {
  const prefersReducedMotion = useReducedMotion()
  const formStartedAt = useMemo(() => Date.now(), [])
  const [sent, setSent] = useState(false)
  const [error, setError] = useState('')
  const [phoneValue, setPhoneValue] = useState('')
  const [submitting, setSubmitting] = useState(false)

  return (
    <motion.form
      className={`surface-card p-5 sm:p-6 ${variant === 'contact' ? 'contact-form' : variant === 'vehicle' ? 'lg:p-7' : variant === 'finance' ? 'rounded-[5px] border-0 bg-[rgba(255,253,248,0.78)] shadow-none' : variant === 'trade' ? 'border-0 bg-[var(--color-primary)] p-5 text-white sm:p-7 lg:p-8' : 'rounded-md'}`}
      initial={prefersReducedMotion ? false : { opacity: 0, clipPath: 'inset(0 0 8% 0)' }}
      whileInView={{ opacity: 1, clipPath: 'inset(0 0 0% 0)' }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ duration: prefersReducedMotion ? 0.14 : 0.4, ease: [0.16, 1, 0.3, 1] }}
      onSubmit={async (event) => {
        event.preventDefault()
        const formElement = event.currentTarget
        setError('')
        setSent(false)
        setSubmitting(true)

        const form = new FormData(formElement)
        const firstName = String(form.get('firstName') ?? '').trim()
        const lastName = String(form.get('lastName') ?? '').trim()
        const phone = getPhoneDigits(phoneValue)
        const email = String(form.get('email') ?? '').trim()
        const subject = String(form.get('subject') ?? '').trim()
        const website = String(form.get('website') ?? '').trim()
        const preferredContact = String(form.get('preferredContact') ?? '').trim()
        const message = String(form.get('message') ?? '').trim()
        const customerName = `${firstName} ${lastName}`.trim()
        const leadType = fields === 'finance' ? 'financing' : fields === 'trade' ? 'trade-in' : vehicleId ? 'quote' : 'contact'
        const metaEventId = createMetaEventId('lead')
        const fbp = getCookieValue('_fbp')
        const fbc = getCookieValue('_fbc')
        const { firstName: metaFirstName, lastName: metaLastName } = splitName(customerName)
        const contentIds = [vehicleId ?? `${trackingConfig.meta.defaultLeadContentPrefix}-${leadType}`]
        const contentType = vehicleId ? trackingConfig.meta.productContentType : trackingConfig.meta.serviceContentType
        const contentName = vehicleName ?? `${leadType} request`
        const currency = trackingConfig.meta.currency
        const eventValue = vehicleValue ?? trackingConfig.meta.defaultLeadValue
        const tradeMake = String(form.get('make') ?? '').trim()
        const tradeModel = String(form.get('model') ?? '').trim()
        const tradeYear = String(form.get('year') ?? '').trim()
        const tradeMileage = String(form.get('mileage') ?? '').trim()
        const tradeVin = String(form.get('vin') ?? '').trim()
        const tradeCondition = String(form.get('condition') ?? '').trim()
        const financeDetails = fields === 'finance'
          ? `Desired vehicle: ${form.get('vehicle') ?? 'not provided'}. Monthly budget: ${form.get('budget') ?? 'not provided'}.`
          : ''

        if (phone.length !== 10) {
          setSubmitting(false)
          setError('Please enter a valid 10-digit US phone number.')
          return
        }

        try {
          await createLead({
            vehicleId,
            leadType,
            customerName,
            phone,
            email,
            subject: subject || undefined,
            preferredContact: preferredContact === 'Best time to contact' ? undefined : preferredContact,
            message: [message, financeDetails].filter(Boolean).join('\n\n'),
            tradeMake,
            tradeModel,
            tradeYear,
            tradeMileage,
            tradeVin,
            tradeCondition,
            metaEventId,
            fbp,
            fbc,
            userAgent: navigator.userAgent,
            eventSourceUrl: window.location.href,
            formStartedAt,
            website,
            contentIds,
            contentName,
            contentType,
            currency,
            value: eventValue ?? undefined,
          })
          try {
            trackLead({
              eventId: metaEventId,
              leadType,
              contentIds,
              contentName,
              contentType,
              currency,
              value: eventValue,
              advancedMatching: {
                email,
                phone,
                firstName: metaFirstName,
                lastName: metaLastName,
                externalId: email || phone,
                fbp,
                fbc,
              },
            })
          } catch {
            // Browser tracking can be blocked; the lead itself was already submitted.
          }
          setError('')
          setSent(true)
          setPhoneValue('')
          formElement.reset()
        } catch {
          setSent(false)
          setError('We could not send the request right now. Please call us or try again.')
        } finally {
          setSubmitting(false)
        }
      }}
    >
      {variant === 'default' ? <><p className="eyebrow">Quick request</p><h3 className="mt-2 text-2xl font-normal text-[var(--color-text)]">{title}</h3>{vehicleName ? <p className="mt-1 text-sm font-normal text-[var(--color-muted)]">{vehicleName}</p> : null}</> : null}
      {variant === 'trade' ? <><p className="text-[10px] font-bold uppercase tracking-[0.18em] text-[rgba(255,253,248,0.88)]">Get started</p><h3 className="mt-2 text-[31px] font-medium leading-[1.04] tracking-[-0.04em] text-[#fffdf8] sm:text-[35px]">{title}</h3><p className="mt-3 max-w-[440px] text-[13px] leading-[1.5] text-[rgba(255,253,248,0.78)]">Fill out the form below and we'll get back to you with a competitive offer.</p></> : null}
      <div className={`${variant === 'vehicle' || variant === 'finance' ? '' : 'mt-5'} grid gap-2.5 sm:grid-cols-2 ${variant === 'trade' ? 'trade-in-form-fields' : ''}`}>
        <div className="hidden" aria-hidden="true">
          <label>
            Website
            <input name="website" tabIndex={-1} autoComplete="off" />
          </label>
        </div>
        <input required aria-label="First name" className="input" name="firstName" placeholder="First name" />
        <input required aria-label="Last name" className="input" name="lastName" placeholder="Last name" />
        <input
          required
          aria-label="Phone"
          className="input"
          name="phone"
          placeholder="(570) 555-0100"
          type="tel"
          inputMode="numeric"
          autoComplete="tel"
          maxLength={17}
          pattern="\+1 \([0-9]{3}\) [0-9]{3}-[0-9]{4}"
          title="Enter a 10-digit US phone number"
          value={phoneValue}
          onChange={(event) => setPhoneValue(formatUsPhone(event.target.value))}
          onFocus={() => {
            if (!phoneValue) {
              setPhoneValue(COUNTRY_CODE_PREFIX)
            }
          }}
        />
        <input aria-label="Email" className="input" name="email" placeholder="Email" type="email" />
        {showSubject ? <input required className="input sm:col-span-2" name="subject" placeholder="Subject" /> : null}
        {fields === 'finance' ? (
          <>
            <input aria-label="Desired vehicle" className="input" name="vehicle" placeholder="Desired vehicle (optional)" />
            <input aria-label="Monthly budget" className="input" name="budget" placeholder="Monthly budget (optional)" />
          </>
        ) : null}
        {fields === 'trade' ? (
          <>
            <input required aria-label="Trade-in make" className="input" name="make" placeholder="Trade-in make" />
            <input required aria-label="Trade-in model" className="input" name="model" placeholder="Trade-in model" />
            <input required aria-label="Year" className="input" name="year" placeholder="Year" />
            <input required aria-label="Mileage" className="input" name="mileage" placeholder="Mileage" />
            <input aria-label="VIN" className="input sm:col-span-2" name="vin" placeholder="VIN (optional)" />
            <select required aria-label="Condition" className="input sm:col-span-2" name="condition" defaultValue="">
              <option value="" disabled>Condition</option>
              <option>Excellent</option>
              <option>Good</option>
              <option>Fair</option>
              <option>Needs work</option>
              <option>Not sure</option>
            </select>
          </>
        ) : null}
        <select aria-label="Best time to contact" className="input" name="preferredContact">
          <option>Best time to contact</option>
          <option>Morning</option>
          <option>Afternoon</option>
          <option>Evening</option>
        </select>
        <textarea aria-label="Message" className="input min-h-28 sm:col-span-2" name="message" placeholder={fields === 'trade' ? 'Additional notes (optional)' : 'Message (optional)'} />
      </div>
      <div className="mt-5">
        <button className={`inline-flex min-h-11 w-full items-center justify-center gap-3 rounded-[3px] px-5 py-3 text-sm font-bold text-white shadow-none transition active:translate-y-px disabled:cursor-wait disabled:bg-[var(--color-disabled)] ${variant === 'trade' ? 'bg-[var(--color-accent)] uppercase tracking-[0.025em] hover:bg-[var(--color-accent-dark)]' : 'bg-[var(--color-primary)] hover:bg-[var(--color-primary-dark)] sm:w-auto'}`} disabled={submitting} type="submit">
          {submitting ? 'Sending...' : fields === 'trade' ? <>Get My Trade-In Estimate <FaArrowRight aria-hidden="true" /></> : fields === 'finance' ? 'Get Pre-Approved' : <>{title} <FaArrowRight aria-hidden="true" /></>}
        </button>
      </div>
      {variant === 'trade' ? <p className="mt-4 flex items-center gap-2 text-[10px] leading-[1.45] text-[rgba(255,253,248,0.76)]"><FaLock aria-hidden="true" /> Your information is secure and will only be used for your trade-in estimate.</p> : null}
      {sent ? <p className="mt-4 rounded-md bg-[var(--color-hover)] px-4 py-3 text-sm font-normal text-[var(--color-link)]">Thanks. We received your request and will follow up shortly.</p> : null}
      {error ? <p className="mt-4 rounded-md bg-[var(--color-hover)] px-4 py-3 text-sm font-normal text-[var(--color-accent)]">{error}</p> : null}
    </motion.form>
  )
}
