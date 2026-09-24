import { useEffect, useRef, useState } from 'react'
import { Link, useSearchParams } from 'react-router'
import { FaCar, FaChevronDown, FaChevronLeft, FaChevronRight, FaPhoneAlt, FaShieldAlt, FaThLarge, FaList, FaSlidersH, FaSearch, FaTimes } from 'react-icons/fa'
import { getVehicleFilters, listVehicles } from '../api/vehicles'
import { Seo } from '../components/Seo'
import { VehicleGridSkeleton } from '../components/Skeletons'
import { business } from '../data/business'
import type { Vehicle } from '../types/vehicle'
import { formatNumber, formatPrice } from '../utils/format'
import { trackContactCta } from '../utils/ctaTracking'

type SortKey = 'price-low' | 'price-high' | 'year' | 'mileage'
type ViewMode = 'grid' | 'list'
const PAGE_SIZE = 9
const toNumber = (value: string) => value === '' ? undefined : Number(value)
const numberValue = (value?: number) => value?.toString() ?? ''
const queryNumber = (value: string | null) => {
  if (!value) return undefined
  const parsed = Number(value)
  return Number.isFinite(parsed) && parsed >= 0 ? parsed : undefined
}
const phoneHref = business.phoneHref || business.contactHref
const selectClass = 'mt-1 h-10 w-full border border-white/15 bg-[#17221b] px-3 text-[12px] text-[#fffdf8] outline-none transition focus:border-[#d45a3d]'
const filterLabel = 'block text-[10px] font-bold uppercase tracking-[0.12em] text-white/70'

const InventoryVehicleCard = ({ vehicle }: { vehicle: Vehicle }) => (
  <article className="group flex min-w-0 flex-col border border-[var(--color-border)] bg-[var(--color-surface)] transition duration-200 hover:-translate-y-0.5 hover:border-[var(--color-primary)]">
    <Link to={`/inventory/${vehicle.slug}`} className="relative block aspect-[4/3] overflow-hidden bg-[var(--color-primary)]">
      <img src={vehicle.images[0]} alt={`${vehicle.year} ${vehicle.make} ${vehicle.model}`} className="h-full w-full object-cover transition duration-500 group-hover:scale-[1.025]" loading="lazy" />
      <span className="absolute left-0 top-0 bg-[var(--color-primary)] px-3 py-2 text-[9px] font-bold uppercase tracking-[0.08em] text-[#fffdf8]">{vehicle.bodyType}</span>
    </Link>
    <div className="flex flex-1 flex-col p-3.5 sm:p-4">
      {vehicle.stockNumber ? <p className="text-[9px] font-bold uppercase tracking-[0.11em] text-[var(--color-muted)]">Stock #{vehicle.stockNumber}</p> : null}
      <h3 className="mt-1.5 min-h-[2.45rem] font-['Barlow_Condensed'] text-[22px] font-bold leading-[0.92] text-[var(--color-text)]">{vehicle.year} {vehicle.make} {vehicle.model}</h3>
      <p className="mt-1 h-4 truncate text-[11px] text-[var(--color-muted)]">{vehicle.trim}</p>
      <p className="mt-3 font-['Barlow_Condensed'] text-[28px] font-bold leading-none tracking-tight text-[var(--color-primary)]">{formatPrice(vehicle.price)}</p>
      <p className="mt-2 flex items-center gap-1.5 text-[9px] font-bold uppercase tracking-[0.07em] text-[var(--color-accent)]"><FaShieldAlt aria-hidden="true" />72-hour money-back guarantee</p>
      <p className="mt-3 min-h-9 border-t border-[var(--color-divider)] pt-2.5 text-[10px] leading-[1.45] text-[var(--color-muted)]">{formatNumber(vehicle.mileage)} mi <span className="px-1 text-[var(--color-accent)]">•</span> {vehicle.drivetrain} <span className="px-1 text-[var(--color-accent)]">•</span> {vehicle.transmission}</p>
      <div className="mt-auto grid grid-cols-[minmax(0,1fr)_76px] gap-2 pt-3">
        <Link to={`/inventory/${vehicle.slug}`} className="inline-flex h-9 items-center justify-center bg-[var(--color-primary)] px-2 text-[10px] font-bold uppercase tracking-[0.035em] text-white transition hover:bg-[var(--color-accent)] active:translate-y-px">View Details</Link>
        <a href={phoneHref} target={business.phoneHref ? undefined : '_blank'} rel={business.phoneHref ? undefined : 'noreferrer'} className="inline-flex h-9 items-center justify-center gap-1.5 border border-[var(--color-primary)] px-2 text-[10px] font-bold uppercase tracking-[0.035em] text-[var(--color-primary)] transition hover:bg-[var(--color-hover)] active:translate-y-px" onClick={() => trackContactCta('phone_click', 'Inventory Vehicle Card Contact')}><FaPhoneAlt className="text-[var(--color-accent)]" /> Call</a>
      </div>
    </div>
  </article>
)

const InventoryVehicleListItem = ({ vehicle }: { vehicle: Vehicle }) => (
  <article className="group grid min-w-0 gap-4 border border-[var(--color-border)] bg-[var(--color-surface)] p-3 transition hover:border-[var(--color-primary)] sm:grid-cols-[170px_minmax(0,1fr)_auto] sm:items-center sm:p-4">
    <Link to={`/inventory/${vehicle.slug}`} className="relative block aspect-[4/3] overflow-hidden bg-[var(--color-primary)] sm:aspect-[5/3]"><img src={vehicle.images[0]} alt={`${vehicle.year} ${vehicle.make} ${vehicle.model}`} className="h-full w-full object-cover transition duration-500 group-hover:scale-[1.025]" loading="lazy" /><span className="absolute left-0 top-0 bg-[var(--color-primary)] px-2.5 py-1.5 text-[9px] font-bold uppercase tracking-[0.08em] text-[#fffdf8]">{vehicle.bodyType}</span></Link>
    <div className="min-w-0">{vehicle.stockNumber ? <p className="text-[9px] font-bold uppercase tracking-[0.11em] text-[var(--color-muted)]">Stock #{vehicle.stockNumber}</p> : null}<h3 className="mt-1 font-['Barlow_Condensed'] text-[26px] font-bold leading-none text-[var(--color-text)]">{vehicle.year} {vehicle.make} {vehicle.model}</h3><p className="mt-1 truncate text-[11px] text-[var(--color-muted)]">{vehicle.trim}</p><p className="mt-3 text-[10px] leading-[1.45] text-[var(--color-muted)]">{formatNumber(vehicle.mileage)} mi <span className="px-1 text-[var(--color-accent)]">•</span> {vehicle.drivetrain} <span className="px-1 text-[var(--color-accent)]">•</span> {vehicle.transmission}</p></div>
    <div className="grid grid-cols-[1fr_auto] items-center gap-3 border-t border-[var(--color-divider)] pt-3 sm:block sm:border-t-0 sm:pt-0 sm:text-right"><p className="font-['Barlow_Condensed'] text-[30px] font-bold leading-none tracking-tight text-[var(--color-primary)]">{formatPrice(vehicle.price)}</p><Link to={`/inventory/${vehicle.slug}`} className="inline-flex h-9 items-center justify-center bg-[var(--color-primary)] px-4 text-[10px] font-bold uppercase tracking-[0.06em] text-white transition hover:bg-[var(--color-accent)]">View details</Link></div>
  </article>
)

export const InventoryPage = () => {
  const [searchParams] = useSearchParams()
  const resultsRef = useRef<HTMLDivElement | null>(null)
  const [make, setMake] = useState(() => searchParams.get('make') ?? '')
  const [model, setModel] = useState(() => searchParams.get('model') ?? '')
  const [yearFrom, setYearFrom] = useState<number | undefined>(() => queryNumber(searchParams.get('yearFrom')))
  const [priceMin, setPriceMin] = useState<number | undefined>(() => queryNumber(searchParams.get('priceMin')))
  const [priceMax, setPriceMax] = useState<number | undefined>(() => queryNumber(searchParams.get('priceMax')))
  const [bodyType, setBodyType] = useState('')
  const [transmission, setTransmission] = useState('')
  const [drivetrain, setDrivetrain] = useState('')
  const [search, setSearch] = useState('')
  const [viewMode, setViewMode] = useState<ViewMode>('grid')
  const [sort, setSort] = useState<SortKey>('year')
  const [page, setPage] = useState(1)
  const [items, setItems] = useState<Vehicle[]>([])
  const [total, setTotal] = useState(0)
  const [loading, setLoading] = useState(true)
  const [inventoryError, setInventoryError] = useState(false)
  const [makes, setMakes] = useState<string[]>([])
  const [models, setModels] = useState<string[]>([])
  const [years, setYears] = useState<number[]>([])
  const [bodyTypes, setBodyTypes] = useState<string[]>([])
  const [transmissions, setTransmissions] = useState<string[]>([])
  const [drivetrains, setDrivetrains] = useState<string[]>([])
  const [prices, setPrices] = useState<number[]>([])
  const [filtersOpen, setFiltersOpen] = useState(false)

  useEffect(() => {
    setSearch(searchParams.get('q') ?? '')
    setPage(1)
  }, [searchParams])

  useEffect(() => {
    let cancelled = false
    getVehicleFilters().then((filters) => { if (!cancelled) { setMakes(filters.makes); setModels(filters.models); setYears(filters.years); setBodyTypes(filters.bodyTypes); setTransmissions(filters.transmissions); setDrivetrains(filters.drivetrains); setPrices(filters.prices); setPriceMin((current) => current !== undefined && !filters.prices.includes(current) ? undefined : current); setPriceMax((current) => current !== undefined && !filters.prices.includes(current) ? undefined : current) } }).catch(() => undefined)
    return () => { cancelled = true }
  }, [])
  useEffect(() => {
    let cancelled = false
    getVehicleFilters(make).then((filters) => { if (!cancelled) { setModels(filters.models); setPrices(filters.prices); setPriceMin((current) => current !== undefined && !filters.prices.includes(current) ? undefined : current); setPriceMax((current) => current !== undefined && !filters.prices.includes(current) ? undefined : current) } }).catch(() => { if (!cancelled) setModels([]) })
    return () => { cancelled = true }
  }, [make])
  useEffect(() => {
    let cancelled = false
    Promise.resolve().then(() => { if (!cancelled) setLoading(true) })
    listVehicles({ make, model, q: search, yearFrom, bodyType, transmission, drivetrain, priceMin, priceMax, page, pageSize: PAGE_SIZE, sort: sort === 'price-low' ? 'price_asc' : sort === 'price-high' ? 'price_desc' : sort === 'mileage' ? 'mileage_asc' : 'year_desc' })
      .then((response) => { if (!cancelled) { setItems(response.items); setTotal(response.total); setInventoryError(false) } })
      .catch(() => { if (!cancelled) { setItems([]); setTotal(0); setInventoryError(true) } })
      .finally(() => { if (!cancelled) setLoading(false) })
    return () => { cancelled = true }
  }, [bodyType, drivetrain, make, model, page, priceMax, priceMin, search, sort, transmission, yearFrom])

  const resetFilters = () => { setPage(1); setMake(''); setModel(''); setSearch(''); setYearFrom(undefined); setPriceMin(undefined); setPriceMax(undefined); setBodyType(''); setTransmission(''); setDrivetrain('') }
  const totalPages = Math.max(1, Math.ceil(total / PAGE_SIZE))
  const pageNumbers = Array.from({ length: totalPages }, (_, index) => index + 1)
  const goToPage = (nextPage: number) => { setPage(Math.min(totalPages, Math.max(1, nextPage))); window.setTimeout(() => resultsRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' }), 0) }
  const filterChange = <T,>(setter: (value: T) => void, value: T) => { setPage(1); setter(value) }
  const filters = <aside className="h-fit bg-[var(--color-primary)] p-5 text-white lg:sticky lg:top-[calc(var(--header-height)+1rem)]">
    <button type="button" className="flex min-h-11 w-full items-center justify-between gap-3 text-left lg:hidden" aria-expanded={filtersOpen} aria-controls="inventory-filters" onClick={() => setFiltersOpen((open) => !open)}>
      <span className="flex items-center gap-2"><FaSlidersH className="text-[var(--color-accent)]" /><span className="text-[11px] font-bold uppercase tracking-[0.15em]">Filter inventory</span></span>
      <FaChevronDown className={`transition-transform ${filtersOpen ? 'rotate-180' : ''}`} />
    </button>
    <div className="hidden items-center gap-2 border-b border-white/15 pb-4 lg:flex"><FaSlidersH className="text-[var(--color-accent)]" /><h2 className="text-[11px] font-bold uppercase tracking-[0.15em]">Filter inventory</h2></div>
    <div id="inventory-filters" className={`${filtersOpen ? 'block' : 'hidden'} lg:block`}>
    <div className="mt-5 space-y-4">
      <label className={filterLabel}>Make<select className={selectClass} value={make} onChange={(event) => { filterChange(setMake, event.target.value); setModel('') }}><option value="">All makes</option>{makes.map((item) => <option key={item}>{item}</option>)}</select></label>
      <label className={filterLabel}>Model<select className={selectClass} value={model} disabled={!make} onChange={(event) => filterChange(setModel, event.target.value)}><option value="">{make ? 'All models' : 'Select make'}</option>{models.map((item) => <option key={item}>{item}</option>)}</select></label>
      <label className={filterLabel}>Price<select className={selectClass} value={numberValue(priceMin)} onChange={(event) => { const price = toNumber(event.target.value); filterChange(setPriceMin, price); filterChange(setPriceMax, price) }}><option value="">Any price</option>{prices.map((price) => <option key={price} value={price}>{formatPrice(price)}</option>)}</select></label>
      <label className={filterLabel}>Year<select className={selectClass} value={numberValue(yearFrom)} onChange={(event) => filterChange(setYearFrom, toNumber(event.target.value))}><option value="">Any year</option>{years.map((item) => <option key={item} value={item}>{item}+</option>)}</select></label>
      <label className={filterLabel}>Body type<select className={selectClass} value={bodyType} onChange={(event) => filterChange(setBodyType, event.target.value)}><option value="">All body types</option>{bodyTypes.map((item) => <option key={item}>{item}</option>)}</select></label>
      <label className={filterLabel}>Drivetrain<select className={selectClass} value={drivetrain} onChange={(event) => filterChange(setDrivetrain, event.target.value)}><option value="">All drivetrains</option>{drivetrains.map((item) => <option key={item}>{item}</option>)}</select></label>
      <label className={filterLabel}>Transmission<select className={selectClass} value={transmission} onChange={(event) => filterChange(setTransmission, event.target.value)}><option value="">All transmissions</option>{transmissions.map((item) => <option key={item}>{item}</option>)}</select></label>
    </div>
    <button className="mt-6 inline-flex h-10 w-full items-center justify-center gap-2 bg-[var(--color-accent)] text-[10px] font-bold uppercase tracking-[0.08em] transition hover:bg-[#c14b30] active:translate-y-px" onClick={() => resultsRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' })} type="button"><FaSlidersH /> Apply filters</button>
    <button className="mt-3 w-full text-center text-[11px] text-white/75 underline underline-offset-4 transition hover:text-white" onClick={resetFilters} type="button">Clear all</button>
    </div>
  </aside>

  return <>
    <Seo title="Used Car Inventory" description="Browse used cars, SUVs, trucks, and crossovers at Rick's Used Cars in Dallas, PA." />
    <section className="relative isolate h-[220px] overflow-hidden bg-[#0c1610] text-[#fffdf8] sm:h-[230px]">
      <img src="/images/inventory-hero-original.webp" alt="Front of a black Ford Super Duty truck" className="absolute inset-0 h-full w-full object-cover object-center" />
      <div className="relative mx-auto flex h-full max-w-[1380px] items-center px-5 sm:px-8 lg:px-10"><div className="max-w-[650px]"><p className="hero-page-label"><span>Inventory</span><i /></p><h1 className="mt-3 font-['Barlow_Condensed'] text-[44px] font-bold uppercase leading-[0.87] tracking-[-0.025em] sm:text-[60px] lg:text-[68px]">Quality vehicles.<span className="block text-[var(--color-accent)]">Ready for the road.</span></h1><p className="mt-3 text-[12px] text-white/90 sm:text-sm">Explore our current selection of used cars, trucks, and SUVs in Dallas, PA.</p></div></div>
    </section>
    <section className="bg-[var(--color-background)] px-5 py-8 sm:px-8 sm:py-10 lg:px-10"><div className="mx-auto max-w-[1380px]">
      <div className="mb-7 flex flex-col gap-5 border-b border-[var(--color-divider)] pb-6 lg:flex-row lg:items-center lg:justify-between"><div className="flex items-center gap-4"><h2 className="font-['Barlow_Condensed'] text-[30px] font-bold leading-none text-[var(--color-primary)] sm:text-[34px]">{loading ? 'Vehicles available' : `${total} vehicles available`}</h2><i className="h-px w-11 bg-[var(--color-accent)]" /></div><div className="flex flex-wrap gap-x-6 gap-y-3 text-[11px] font-medium text-[var(--color-text)]"><span className="inline-flex items-center gap-2"><FaCar />Updated regularly</span><span className="inline-flex items-center gap-2"><FaShieldAlt />Quality inspected</span></div></div>
      <div className="grid gap-7 lg:grid-cols-[280px_minmax(0,1fr)] lg:gap-8">{loading ? <div className="hidden lg:block"><div className="h-[520px] animate-pulse bg-[var(--color-primary)]" /></div> : filters}<div ref={resultsRef} className="min-w-0 scroll-mt-[calc(var(--header-height)+1rem)]">
        <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:gap-4">
          <label className="flex shrink-0 items-center gap-3 text-[11px] font-bold text-[var(--color-text)]">Sort by<select className="h-9 min-w-36 border border-[var(--color-border)] bg-[var(--color-surface)] px-3 text-[11px] font-normal outline-none focus:border-[var(--color-primary)]" value={sort} onChange={(event) => filterChange(setSort, event.target.value as SortKey)}><option value="year">Newest first</option><option value="price-low">Price low-high</option><option value="price-high">Price high-low</option><option value="mileage">Lowest mileage</option></select></label>
          <label className="relative block min-w-0 flex-1"><span className="sr-only">Search by vehicle name</span><FaSearch aria-hidden="true" className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-[11px] text-[var(--color-muted)]" /><input className="h-9 w-full border border-[var(--color-border)] bg-[var(--color-surface)] py-0 pl-8 pr-9 text-[11px] text-[var(--color-text)] outline-none placeholder:text-[var(--color-muted)] focus:border-[var(--color-primary)]" type="text" inputMode="search" value={search} onChange={(event) => filterChange(setSearch, event.target.value)} placeholder="Search by vehicle name" />{search ? <button type="button" aria-label="Clear vehicle search" onClick={() => filterChange(setSearch, '')} className="absolute right-0 top-0 grid h-9 w-9 place-items-center text-[var(--color-muted)] transition hover:text-[var(--color-primary)]"><FaTimes aria-hidden="true" /></button> : null}</label>
          <div className="hidden shrink-0 items-center border border-[var(--color-divider)] text-[11px] sm:flex" aria-label="Choose inventory view"><button type="button" aria-label="Grid view" aria-pressed={viewMode === 'grid'} onClick={() => setViewMode('grid')} className={`inline-flex h-9 items-center gap-2 px-3 font-bold transition ${viewMode === 'grid' ? 'bg-[var(--color-section)] text-[var(--color-text)]' : 'text-[var(--color-muted)] hover:bg-[var(--color-section)] hover:text-[var(--color-text)]'}`}><FaThLarge /> Grid</button><button type="button" aria-label="List view" aria-pressed={viewMode === 'list'} onClick={() => setViewMode('list')} className={`inline-flex h-9 items-center gap-2 px-3 transition ${viewMode === 'list' ? 'bg-[var(--color-section)] font-bold text-[var(--color-text)]' : 'text-[var(--color-muted)] hover:bg-[var(--color-section)] hover:text-[var(--color-text)]'}`}><FaList /> List</button></div>
        </div>
        <div className={viewMode === 'grid' ? 'grid items-stretch gap-4 sm:grid-cols-2 xl:grid-cols-3' : 'grid gap-3'}>{loading ? <VehicleGridSkeleton count={PAGE_SIZE} /> : inventoryError ? <div className="border border-[var(--color-border)] bg-[var(--color-surface)] p-7 text-center text-sm text-[var(--color-muted)]">Inventory is temporarily unavailable. Please try again later or call us for current vehicles.</div> : items.length ? items.map((vehicle) => viewMode === 'grid' ? <InventoryVehicleCard key={vehicle.id} vehicle={vehicle} /> : <InventoryVehicleListItem key={vehicle.id} vehicle={vehicle} />) : <div className="border border-[var(--color-border)] bg-[var(--color-surface)] p-7 text-center text-sm text-[var(--color-muted)]">No vehicles match these filters right now.</div>}</div>
        {!loading && totalPages > 1 ? <div className="relative mt-7 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-center"><div className="flex items-center justify-center gap-1.5"><button aria-label="Previous page" className="grid h-8 w-8 place-items-center border border-[var(--color-border)] transition hover:bg-[var(--color-section)] disabled:opacity-35" disabled={page === 1} onClick={() => goToPage(page - 1)} type="button"><FaChevronLeft /></button>{pageNumbers.map((pageNumber) => <button key={pageNumber} aria-label={`Page ${pageNumber}`} className={`grid h-8 min-w-8 place-items-center px-2 text-[11px] ${pageNumber === page ? 'bg-[var(--color-primary)] text-white' : 'hover:bg-[var(--color-section)]'}`} onClick={() => goToPage(pageNumber)} type="button">{pageNumber}</button>)}<button aria-label="Next page" className="grid h-8 w-8 place-items-center border border-[var(--color-border)] transition hover:bg-[var(--color-section)] disabled:opacity-35" disabled={page === totalPages} onClick={() => goToPage(page + 1)} type="button"><FaChevronRight /></button></div><p className="text-center text-[10px] text-[var(--color-muted)] sm:absolute sm:right-0">Showing {((page - 1) * PAGE_SIZE) + 1}-{Math.min(page * PAGE_SIZE, total)} of {total} vehicles</p></div> : null}
      </div></div>
    </div></section>
  </>
}
