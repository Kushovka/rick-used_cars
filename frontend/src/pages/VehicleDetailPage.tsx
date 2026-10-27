import { useEffect, useMemo, useRef, useState } from 'react'
import { useParams } from 'react-router'
import { FaArrowRight, FaCar, FaCheck, FaKey, FaPhoneAlt, FaShieldAlt, FaTimes } from 'react-icons/fa'
import { getVehicle } from '../api/vehicles'
import { Button } from '../components/Button'
import { LeadForm } from '../components/LeadForm'
import { Seo } from '../components/Seo'
import { VehicleDetailSkeleton } from '../components/Skeletons'
import { VehicleGallery } from '../components/VehicleGallery'
import { business } from '../data/business'
import type { Vehicle } from '../types/vehicle'
import { trackContactCta } from '../utils/ctaTracking'
import { formatNumber, formatPrice } from '../utils/format'
import { trackViewContent } from '../utils/metaPixel'

const phoneHref = business.phoneHref || business.contactHref

const featuresFromListingInfo = (content: string) => content
  .split('\n')
  .map((line) => line.trim())
  .filter((line) => line.startsWith('- '))
  .map((line) => line.slice(2).trim())
  .filter((item) => !/^(chassis:|vin:|\d+[\d,.]*k? miles$|.*\b(engine|transmission|dual-clutch|tiptronic|single-speed|v8|v6|v12|inline|turbodiesel|twin-turbocharged|supercharged)\b|.*\b(paint|metallic|upholstery|interior|leather)\b)/i.test(item))

const Feature = ({ feature }: { feature: string }) => (
  <p className="flex items-start gap-3 text-sm leading-6 text-[var(--color-text)]"><span className="mt-1 grid h-4 w-4 shrink-0 place-items-center rounded-full bg-[var(--color-accent)] text-[9px] text-white"><FaCheck /></span>{feature}</p>
)

const VehicleOverview = ({ vehicle }: { vehicle: Vehicle }) => <article className="border border-[var(--color-border)] bg-[var(--color-surface)] p-5 sm:p-6 lg:p-7">
  <h2 className="font-['Barlow_Condensed'] text-3xl font-semibold leading-none tracking-[-0.02em] text-[var(--color-primary)] sm:text-4xl">Vehicle overview</h2>
  <p className="mt-5 max-w-[68ch] whitespace-pre-line text-[15px] leading-7 text-[var(--color-muted)] sm:text-base">{vehicle.description}</p>
</article>

const PriceCard = ({ vehicle, onRequestInfo }: { vehicle: Vehicle; onRequestInfo: (contentName: string) => void }) => {
  const sold = vehicle.status?.toLowerCase() === 'sold'

  return <aside className={`h-fit p-5 text-[var(--color-surface)] sm:p-6 lg:sticky lg:top-[calc(var(--header-height)+1rem)] lg:self-start lg:p-7 ${sold ? 'bg-[#303a33]' : 'bg-[var(--color-primary)]'}`}>
  {sold ? <>
    <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-white/65">Vehicle status</p>
    <p className="mt-2 font-['Barlow_Condensed'] text-5xl font-bold uppercase leading-none tracking-[0.04em] text-[#f16a49] sm:text-6xl">Sold</p>
    <p className="mt-3 text-sm leading-6 text-white/75">This vehicle has been sold. Browse our current inventory to find your next car.</p>
    <a href="/inventory" className="mt-5 flex min-h-12 w-full items-center justify-center gap-3 bg-[var(--color-accent)] px-4 text-sm font-bold text-white transition hover:bg-[var(--color-accent-dark)]">Browse Inventory <FaArrowRight aria-hidden="true" /></a>
    <p className="mt-4 border-t border-white/20 pt-4 text-xs leading-5 text-white/60">Previously listed at {formatPrice(vehicle.price)}</p>
  </> : <>
    <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-white/70">Listed price</p>
    <p className="mt-2 font-['Barlow_Condensed'] text-5xl font-bold leading-none tracking-[-0.025em] sm:text-6xl">{formatPrice(vehicle.price)}</p>
    <p className="mt-3 flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.1em] text-[#f16a49]"><FaShieldAlt aria-hidden="true" />72 hours / 250 miles money-back guarantee</p>
    <p className="mt-3 text-xs leading-5 text-white/65">Price does not include tax, title, or fees.</p>
    <button type="button" className="mt-5 flex min-h-12 w-full items-center justify-center gap-3 bg-[var(--color-accent)] px-4 text-sm font-bold text-white transition hover:bg-[var(--color-accent-dark)]" onClick={() => onRequestInfo('Vehicle Price Card Request Info')}>Request Info <FaArrowRight aria-hidden="true" /></button>
    <p className="mt-3 text-center text-[10px] font-bold uppercase tracking-[0.12em] text-white/75">No financing available</p>
    <a href={phoneHref} className="mt-3 flex min-h-12 items-center justify-center gap-3 border border-white/70 px-4 text-sm font-medium text-white transition hover:border-white hover:bg-white/10" onClick={() => trackContactCta('phone_click', 'Vehicle Price Card Phone')}><FaPhoneAlt aria-hidden="true" /> {business.phone}</a>
  </>}
  <div className="mt-6 border-t border-white/20 pt-5"><ul className="grid gap-4 text-sm"><li className="flex items-center gap-3"><FaCar className="w-4 shrink-0 text-[var(--color-accent)]" />{vehicle.status || 'Available now'}</li><li className="flex items-center gap-3"><FaKey className="w-4 shrink-0 text-[var(--color-accent)]" />Clean title</li><li className="flex items-center gap-3"><FaShieldAlt className="w-4 shrink-0 text-[var(--color-accent)]" />Quality inspected</li></ul></div>
  </aside>
}

export const VehicleDetailPage = () => {
  const { slug } = useParams()
  const infoDialogRef = useRef<HTMLDialogElement>(null)
  const [infoDialogVisible, setInfoDialogVisible] = useState(false)
  const [vehicle, setVehicle] = useState<Vehicle | null>(null)
  const [loaded, setLoaded] = useState(false)
  const [loadError, setLoadError] = useState(false)
  useEffect(() => {
    let cancelled = false
    getVehicle(slug ?? '')
      .then(async (item) => {
        const [listingDescription, listingInfo] = await Promise.all([
          fetch(`/listing-descriptions/${item.slug}.txt`, { cache: 'no-store' }).then((response) => response.ok ? response.text() : '').catch(() => ''),
          fetch(`/listing-info/${item.slug}.txt`).then((response) => response.ok ? response.text() : '').catch(() => ''),
        ])
        if (!cancelled) {
          const sourceFeatures = featuresFromListingInfo(listingInfo)
          setVehicle({
            ...item,
            description: listingDescription.trim() || item.description,
            features: sourceFeatures.length ? sourceFeatures : item.features,
          })
          setLoadError(false)
          trackViewContent(item.stockNumber || item.id, `${item.year} ${item.make} ${item.model} ${item.trim}`, item.price)
        }
      })
      .catch(() => { if (!cancelled) { setVehicle(null); setLoadError(true) } })
      .finally(() => { if (!cancelled) setLoaded(true) })
    return () => { cancelled = true }
  }, [slug])
  const openRequestInfo = (contentName: string) => {
    const dialog = infoDialogRef.current
    if (!dialog || dialog.open) return

    trackContactCta('contact_form_click', contentName)
    dialog.showModal()
    window.requestAnimationFrame(() => setInfoDialogVisible(true))
  }
  const closeRequestInfo = () => {
    const dialog = infoDialogRef.current
    if (!dialog?.open) return

    setInfoDialogVisible(false)
    window.setTimeout(() => dialog.close(), 220)
  }
  const title = useMemo(() => vehicle ? `${vehicle.year} ${vehicle.make} ${vehicle.model} ${vehicle.trim}` : '', [vehicle])
  if (!vehicle && loaded && loadError) return <section className="section soft-band"><div className="mx-auto max-w-3xl px-4 text-center sm:px-6 lg:px-8"><div className="surface-card p-8"><h1 className="text-3xl text-[var(--color-text)]">Vehicle details are temporarily unavailable</h1><p className="mt-3 text-[var(--color-muted)]">Please try again later or call us for current vehicle information.</p><div className="mt-6 flex flex-col justify-center gap-3 sm:flex-row"><Button href="/inventory" variant="secondary">Back to Inventory</Button><Button href={phoneHref}><FaPhoneAlt /> Contact</Button></div></div></div></section>
  if (!vehicle) return <VehicleDetailSkeleton />
  const specs = [['Mileage', `${formatNumber(vehicle.mileage)} mi`], ['Body type', vehicle.bodyType], ['Drivetrain', vehicle.drivetrain], ['Engine', vehicle.engine], ['Transmission', vehicle.transmission], ['Exterior color', vehicle.exteriorColor], ['Interior color', vehicle.interiorColor]]
  const vehicleCanonical = `${business.website}/inventory/${vehicle.slug}/`
  const vehicleDescription = vehicle.shortDescription || `${title} for sale at Rick's Used Cars in Dallas, PA. Call or request info today.`
  const vehicleSchema = {
    '@context': 'https://schema.org',
    '@type': 'Vehicle',
    name: title,
    url: vehicleCanonical,
    image: vehicle.images,
    description: vehicleDescription,
    brand: { '@type': 'Brand', name: vehicle.make },
    model: vehicle.model,
    vehicleModelDate: String(vehicle.year),
    mileageFromOdometer: { '@type': 'QuantitativeValue', value: vehicle.mileage, unitCode: 'SMI' },
    ...(vehicle.price > 0 ? {
      offers: {
        '@type': 'Offer',
        url: vehicleCanonical,
        price: vehicle.price,
        priceCurrency: 'USD',
        availability: vehicle.status?.toLowerCase() === 'sold' ? 'https://schema.org/OutOfStock' : 'https://schema.org/InStock',
        seller: { '@id': `${business.website}/#dealership` },
      },
    } : {}),
  }
  return <><Seo title={title} description={vehicleDescription} image={vehicle.images[0] || business.heroImage} openGraphType="product" schema={vehicleSchema} /><main className="bg-[var(--color-background)]">
    <section className="px-4 pb-8 pt-6 sm:px-6 lg:px-8 lg:pb-10 lg:pt-8"><div className="mx-auto max-w-7xl"><nav className="flex flex-wrap gap-x-2 text-xs text-[var(--color-muted)]" aria-label="Breadcrumb"><a className="hover:text-[var(--color-accent)]" href="/inventory">Inventory</a><span>/</span><span>{vehicle.make}</span><span>/</span><span>{vehicle.model}</span><span>/</span><span className="text-[var(--color-text)]">{title}</span></nav><div className="mt-5">{vehicle.stockNumber ? <p className="flex items-center gap-3 text-[10px] font-bold uppercase tracking-[0.16em] text-[var(--color-muted)]">Stock #{vehicle.stockNumber}<span className="h-px w-8 bg-[var(--color-accent)]" /></p> : null}<h1 className={vehicle.stockNumber ? "mt-2 font-['Barlow_Condensed'] text-4xl font-bold leading-[.95] tracking-[-0.02em] text-[var(--color-primary)] sm:text-5xl lg:text-6xl" : "font-['Barlow_Condensed'] text-4xl font-bold leading-[.95] tracking-[-0.02em] text-[var(--color-primary)] sm:text-5xl lg:text-6xl"}>{title}</h1><p className="mt-3 text-sm text-[var(--color-muted)] sm:text-base">{vehicle.engine} <span className="px-1.5 text-[var(--color-divider)]">|</span> {vehicle.drivetrain} <span className="px-1.5 text-[var(--color-divider)]">|</span> {vehicle.transmission}</p></div><div className="mt-6 grid gap-5 lg:grid-cols-[minmax(0,1fr)_minmax(280px,.39fr)] lg:items-start"><VehicleGallery images={vehicle.images} imagesTotal={vehicle.imagesTotal} slug={vehicle.slug} title={title} /><PriceCard vehicle={vehicle} onRequestInfo={openRequestInfo} /></div><dl className="mt-5 grid border border-[var(--color-border)] bg-[var(--color-surface)] sm:grid-cols-2 lg:grid-cols-7">{specs.map(([label, value], index) => <div key={label} className={`min-w-0 p-4 ${index > 0 ? 'border-t border-[var(--color-divider)] sm:border-t-0 sm:border-l lg:border-t-0' : ''}`}><dt className="text-[9px] font-bold uppercase tracking-[0.14em] text-[var(--color-muted)]">{label}</dt><dd className="mt-2 text-sm leading-5 text-[var(--color-text)]">{value}</dd></div>)}</dl></div></section>
    <section className="px-4 pb-12 sm:px-6 lg:px-8 lg:pb-16"><div className="mx-auto grid max-w-7xl gap-5 lg:grid-cols-[minmax(0,1.5fr)_minmax(340px,1fr)] lg:items-start"><VehicleOverview vehicle={vehicle} /><article className="h-fit border border-[var(--color-border)] bg-[var(--color-surface)] p-5 sm:p-6 lg:sticky lg:top-[calc(var(--header-height)+1rem)] lg:self-start lg:p-7"><h2 className="font-['Barlow_Condensed'] text-3xl font-semibold leading-none tracking-[-0.02em] text-[var(--color-primary)] sm:text-4xl">Vehicle highlights</h2><div className="mt-6 grid gap-x-7 gap-y-3 sm:grid-cols-2">{vehicle.features.map((feature) => <Feature key={feature} feature={feature} />)}</div></article></div></section>
    <section id="request-info" className="bg-[var(--color-section)] px-4 py-12 sm:px-6 lg:px-8 lg:py-16"><div className="mx-auto grid max-w-7xl gap-8 lg:grid-cols-[minmax(0,.45fr)_minmax(0,.55fr)] lg:items-center"><div><p className="flex items-center gap-3 text-[10px] font-bold uppercase tracking-[0.16em] text-[var(--color-muted)]">Request info<span className="h-px w-8 bg-[var(--color-accent)]" /></p><h2 className="mt-4 max-w-md font-['Barlow_Condensed'] text-4xl font-bold leading-[.95] tracking-[-0.02em] text-[var(--color-primary)] sm:text-5xl">Send a quick question about this vehicle.</h2><p className="mt-5 max-w-sm text-[15px] leading-7 text-[var(--color-muted)]">The form still sends through the same lead system and keeps tracking intact.</p></div><LeadForm title="Request Info" vehicleId={vehicle.id} vehicleContentId={vehicle.stockNumber || vehicle.id} vehicleName={title} vehicleValue={vehicle.price} variant="vehicle" /></div></section>
  </main><div className="fixed inset-x-0 bottom-0 z-50 border-t border-[var(--color-border)] bg-[var(--color-background)] px-4 py-3 shadow-sm lg:hidden"><div className="mx-auto flex max-w-7xl items-center gap-3"><div className="min-w-0 flex-1"><p className="truncate text-sm text-[var(--color-text)]">{title}</p><p className={`font-medium ${vehicle.status?.toLowerCase() === 'sold' ? 'text-[var(--color-accent-dark)]' : 'text-[var(--color-primary)]'}`}>{vehicle.status?.toLowerCase() === 'sold' ? 'Sold' : formatPrice(vehicle.price)}</p></div>{vehicle.status?.toLowerCase() === 'sold' ? <a href="/inventory" className="inline-flex min-h-12 shrink-0 items-center justify-center gap-2 bg-[var(--color-primary)] px-4 text-sm font-bold text-white">Browse cars <FaArrowRight aria-hidden="true" /></a> : <><a href={phoneHref} className="inline-flex h-12 w-12 shrink-0 items-center justify-center bg-[var(--color-primary)] text-white" aria-label="Contact about this vehicle" onClick={() => trackContactCta('phone_click', 'Vehicle Sticky Contact')}><FaPhoneAlt /></a><button type="button" className="inline-flex h-12 w-12 shrink-0 items-center justify-center bg-[var(--color-accent)] text-white" aria-label="Request info about this vehicle" onClick={() => openRequestInfo('Vehicle Sticky Request Info')}><FaArrowRight /></button></>}</div></div>
  <dialog ref={infoDialogRef} aria-labelledby="vehicle-request-info-title" className={`lead-form-dialog m-auto max-h-[90dvh] w-[calc(100%-2rem)] max-w-[600px] overflow-y-auto border border-[var(--color-border)] bg-[var(--color-background)] p-0 text-[var(--color-text)] shadow-[0_24px_80px_rgba(0,0,0,0.42)] ${infoDialogVisible ? 'is-visible' : ''}`} onCancel={(event) => { event.preventDefault(); closeRequestInfo() }} onClick={(event) => { if (event.target === event.currentTarget) closeRequestInfo() }}>
    <div className="flex items-start justify-between gap-5 border-b border-[var(--color-divider)] bg-[var(--color-surface)] px-5 py-4 sm:px-7"><div><h2 id="vehicle-request-info-title" className="font-['Barlow_Condensed'] text-3xl font-bold uppercase leading-none tracking-[-.02em] text-[var(--color-primary)] sm:text-4xl">Request info</h2><p className="mt-2 text-sm leading-6 text-[var(--color-muted)]">Send a question about this vehicle.</p></div><button type="button" aria-label="Close request info form" onClick={closeRequestInfo} className="grid h-10 w-10 shrink-0 place-items-center text-[var(--color-muted)] transition hover:bg-[var(--color-hover)] hover:text-[var(--color-primary)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-accent)]"><FaTimes aria-hidden="true" /></button></div>
    <div className="p-4 sm:p-6"><LeadForm title="Request Info" vehicleId={vehicle.id} vehicleContentId={vehicle.stockNumber || vehicle.id} vehicleName={title} vehicleValue={vehicle.price} variant="vehicle" /></div>
  </dialog></>
}
