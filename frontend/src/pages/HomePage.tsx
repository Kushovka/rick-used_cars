import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { Link, useNavigate } from "react-router";
import { FaArrowLeft, FaArrowRight, FaCar, FaCarSide, FaCog, FaMapMarkerAlt, FaRoad, FaShieldAlt, FaUsers } from "react-icons/fa";
import { getVehicleFilters, listVehicles } from "../api/vehicles";
import { Button } from "../components/Button";
import { ReviewCarousel } from "../components/ReviewCarousel";
import { Seo } from "../components/Seo";
import { business } from "../data/business";
import type { Vehicle } from "../types/vehicle";
import { formatNumber, formatPrice } from "../utils/format";
import { trackContactCta } from "../utils/ctaTracking";
import { autoDealerSchema } from "../utils/schema";

const SelectChevron = () => (
  <svg aria-hidden="true" className="pointer-events-none absolute right-4 top-1/2 h-5 w-3 -translate-y-1/2 text-white/70" viewBox="0 0 12 18" fill="none">
    <path d="M2 5L6 12L10 5" stroke="currentColor" strokeWidth="1.35" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

type HeroFilterOption = { value: string; label: string };

const HeroFilterSelect = ({
  ariaLabel,
  value,
  options,
  onChange,
  disabled = false,
}: {
  ariaLabel: string;
  value: string;
  options: HeroFilterOption[];
  onChange: (value: string) => void;
  disabled?: boolean;
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const controlRef = useRef<HTMLDivElement>(null);
  const selectedOption = options.find((option) => option.value === value) ?? options[0];

  useEffect(() => {
    const closeOnOutsidePointer = (event: PointerEvent) => {
      if (controlRef.current && !controlRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener("pointerdown", closeOnOutsidePointer);
    return () => document.removeEventListener("pointerdown", closeOnOutsidePointer);
  }, []);

  useEffect(() => {
    if (disabled) setIsOpen(false);
  }, [disabled]);

  return (
    <div ref={controlRef} className="relative flex flex-1">
      <button type="button" aria-label={ariaLabel} aria-expanded={isOpen} aria-haspopup="listbox" disabled={disabled} onClick={() => setIsOpen((open) => !open)} onKeyDown={(event) => { if (event.key === "Escape") setIsOpen(false); }} className="relative flex w-full items-center border border-white/15 bg-white/[0.04] px-4 pr-10 text-left text-base text-white transition hover:border-white/35 focus:border-[var(--color-accent)] focus:outline-none disabled:cursor-not-allowed disabled:text-white/40">
        {selectedOption?.label}
        <SelectChevron />
      </button>
      {isOpen && (
        <div role="listbox" aria-label={ariaLabel} className="absolute bottom-[calc(100%+0.5rem)] left-0 z-50 max-h-64 w-full overflow-y-auto border border-white/20 bg-[#1d2922] py-1 shadow-[0_14px_28px_rgba(10,16,12,0.38)]">
          {options.map((option) => (
            <button type="button" role="option" aria-selected={option.value === value} key={option.value} onClick={() => { onChange(option.value); setIsOpen(false); }} className={`flex w-full items-center px-4 py-2.5 text-left text-sm transition hover:bg-white/10 focus:bg-white/10 focus:outline-none ${option.value === value ? "bg-white/10 text-white" : "text-white/75"}`}>
              {option.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

const FeaturedVehicleShowcase = ({ vehicle }: { vehicle: Vehicle }) => {
  const title = `${vehicle.year} ${vehicle.make} ${vehicle.model}`;
  return (
    <article className="featured-vehicle-card group">
      <Link
        to={`/inventory/${vehicle.slug}`}
        className="featured-vehicle-card__image"
        aria-label={`View details for ${title}`}
      >
        <img
          src={vehicle.images[0]}
          alt={title}
          loading="lazy"
        />
        {vehicle.status?.toLowerCase() === "new arrival" ? <span className="featured-vehicle-card__badge">New arrival</span> : null}
      </Link>
      <div className="featured-vehicle-card__body">
        <div>
          <div className="featured-vehicle-card__meta"><span>{vehicle.bodyType}</span>{vehicle.stockNumber ? <span>#{vehicle.stockNumber}</span> : null}</div>
          <h3>{title}</h3>
          <p className="featured-vehicle-card__price">{formatPrice(vehicle.price)}</p>
          <p className="featured-vehicle-card__guarantee"><FaShieldAlt aria-hidden="true" />72-hour money-back guarantee</p>
          <div className="featured-vehicle-card__specs">
            <span><FaRoad />{formatNumber(vehicle.mileage)} mi</span>
            {vehicle.engine ? <span><FaCog />{vehicle.engine}</span> : null}
            {vehicle.drivetrain ? <span><FaCarSide />{vehicle.drivetrain}</span> : null}
          </div>
        </div>
        <Link to={`/inventory/${vehicle.slug}`} className="featured-vehicle-card__cta">View details <FaArrowRight /></Link>
      </div>
    </article>
  );
};

const FeaturedVehiclesSkeleton = () => (
  <div className="featured-vehicles-grid" aria-label="Loading featured vehicles">
    {Array.from({ length: 4 }).map((_, index) => <div className="h-[500px] animate-pulse bg-[var(--color-primary)]/15" key={index} />)}
  </div>
);

export const HomePage = () => {
  const navigate = useNavigate();
  const prefersReducedMotion = useReducedMotion();
  const [featured, setFeatured] = useState<Vehicle[]>([]);
  const [featuredPage, setFeaturedPage] = useState(0);
  const [featuredMobileIndex, setFeaturedMobileIndex] = useState(0);
  const [featuredLoading, setFeaturedLoading] = useState(true);
  const [featuredError, setFeaturedError] = useState(false);
  const [inventoryCount, setInventoryCount] = useState<number | null>(null);
  const [heroMake, setHeroMake] = useState("");
  const [heroModel, setHeroModel] = useState("");
  const [heroPrice, setHeroPrice] = useState("");
  const [heroYear, setHeroYear] = useState("");
  const [heroMakes, setHeroMakes] = useState<string[]>([]);
  const [heroModels, setHeroModels] = useState<string[]>([]);
  const [heroYears, setHeroYears] = useState<number[]>([]);
  const [heroPrices, setHeroPrices] = useState<number[]>([]);
  const [heroFiltersLoading, setHeroFiltersLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;

    listVehicles({ pageSize: 12 })
      .then(async (firstPage) => {
        const pageCount = Math.ceil(firstPage.total / firstPage.pageSize);
        if (pageCount === 1) return firstPage;

        const remainingPages = await Promise.all(
          Array.from({ length: pageCount - 1 }, (_, index) => listVehicles({ page: index + 2, pageSize: firstPage.pageSize })),
        );

        return {
          ...firstPage,
          items: [firstPage, ...remainingPages].flatMap((page) => page.items),
        };
      })
      .then((response) => {
        if (!cancelled) {
          setFeatured(response.items);
          setFeaturedError(false);
          setInventoryCount(response.total);
        }
      })
      .catch(() => {
        if (!cancelled) {
          setFeatured([]);
          setFeaturedError(true);
        }
      })
      .finally(() => {
        if (!cancelled) {
          setFeaturedLoading(false);
        }
      });

    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    let cancelled = false;

    getVehicleFilters()
      .then((filters) => {
        if (!cancelled) {
          setHeroMakes(filters.makes);
          setHeroYears(filters.years);
          setHeroPrices(filters.prices);
        }
      })
      .catch(() => undefined)
      .finally(() => {
        if (!cancelled) {
          setHeroFiltersLoading(false);
        }
      });

    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    let cancelled = false;
    setHeroModel("");

    if (!heroMake) {
      setHeroModels([]);
      return () => {
        cancelled = true;
      };
    }

    getVehicleFilters(heroMake)
      .then((filters) => {
        if (!cancelled) {
          setHeroModels(filters.models);
          setHeroPrices(filters.prices);
          setHeroPrice((currentPrice) => filters.prices.includes(Number(currentPrice)) ? currentPrice : "");
        }
      })
      .catch(() => {
        if (!cancelled) {
          setHeroModels([]);
        }
      });

    return () => {
      cancelled = true;
    };
  }, [heroMake]);

  const heroPriceOptions = heroPrices.map((price) => ({ value: String(price), label: formatPrice(price) }));

  const searchHeroInventory = () => {
    const params = new URLSearchParams();
    if (heroMake) params.set("make", heroMake);
    if (heroModel) params.set("model", heroModel);
    if (heroYear) {
      params.set("yearFrom", heroYear);
      params.set("yearTo", heroYear);
    }
    if (heroPrice) {
      params.set("priceMin", heroPrice);
      params.set("priceMax", heroPrice);
    }

    navigate({ pathname: "/inventory", search: params.toString() });
  };

  const featuredPageCount = Math.max(1, Math.ceil(featured.length / 4));
  const featuredStart = Math.min(featuredPage * 4, Math.max(0, featured.length - 4));
  const visibleFeaturedVehicles = featured.slice(featuredStart, featuredStart + 4);
  const mobileFeaturedVehicle = featured[featuredMobileIndex];
  const changeFeaturedPage = (direction: -1 | 1) => {
    setFeaturedPage((current) => (current + direction + featuredPageCount) % featuredPageCount);
  };
  const changeFeaturedMobileVehicle = (direction: -1 | 1) => {
    setFeaturedMobileIndex((current) => (current + direction + featured.length) % featured.length);
  };
  return (
    <>
      <Seo
        title="Used Cars in Dallas, PA"
        description="Rick's Used Cars is a local dealership in Dallas, PA. Browse inventory, call the lot, or get directions."
        schema={autoDealerSchema}
      />

      <section
        className="relative min-h-[680px] overflow-hidden bg-[var(--color-background)] text-[var(--color-text)] lg:min-h-[calc(100svh-78px)] xl:min-h-[calc(100svh-112px)]"
      >
        <img
          src={business.heroImage}
          alt="Rick's Used Cars at 601 Main Rd in Dallas, Pennsylvania"
          className="absolute inset-0 hidden h-full w-full object-cover object-[52%_center] lg:block"
          fetchPriority="high"
        />
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 z-[1] hidden bg-[linear-gradient(90deg,#f5f1e8_0%,#f5f1e8_32%,rgba(245,241,232,0.99)_36%,rgba(245,241,232,0.92)_41%,rgba(245,241,232,0.70)_46%,rgba(245,241,232,0.42)_50%,rgba(245,241,232,0.18)_54%,rgba(245,241,232,0.05)_58%,rgba(245,241,232,0)_62%)] lg:block"
        />

        <div className="relative z-10 mx-auto grid min-h-[650px] max-w-[1536px] content-start px-5 pb-12 pt-10 sm:px-8 lg:min-h-[calc(100svh-78px)] lg:content-start lg:px-[5.5rem] lg:pb-0 lg:pt-14 xl:min-h-[calc(100svh-112px)] xl:pt-16">
          <div className="max-w-[520px] bg-[var(--color-background)]/90 p-6 sm:p-9 lg:max-w-[500px] lg:bg-transparent lg:p-0 xl:max-w-[570px]">
            <p className="flex items-center gap-4 text-xs font-bold uppercase tracking-[0.32em] text-[var(--color-primary)] lg:text-[13px]">Dallas, Pennsylvania <span className="h-px w-10 bg-[var(--color-accent)]" /></p>
          <h1 className="mt-6 font-['Barlow_Condensed'] text-[64px] font-semibold uppercase leading-[0.88] tracking-[-0.035em] text-[var(--color-primary)] sm:text-[78px] lg:mt-5 lg:text-[84px] xl:text-[92px] min-[1024px]:max-[1320px]:text-[72px]">
            Quality<br />used cars<br /><span className="text-[var(--color-accent)]">real people.</span>
          </h1>
          <p className="mt-5 max-w-lg text-base leading-7 text-[var(--color-muted)] sm:text-lg lg:mt-4 lg:text-xl lg:leading-8 min-[1024px]:max-[1320px]:text-[17px] min-[1024px]:max-[1320px]:leading-7">
            Great vehicles. Fair prices. Local service you can trust.<br />Stop by Rick's Used Cars or browse our inventory online.
          </p>
          <div className="mt-7 flex flex-wrap gap-4 lg:mt-6">
            <Link
              to="/inventory"
              className="inline-flex h-[52px] items-center justify-center bg-[var(--color-primary)] px-7 text-sm font-bold uppercase tracking-[0.06em] text-white transition hover:bg-[var(--color-accent)] lg:h-14 lg:px-8 lg:text-[15px]"
            >
              Browse Inventory <FaArrowRight />
            </Link>
            <a
              href={business.mapsUrl}
              target="_blank"
              rel="noreferrer"
              className="inline-flex h-[52px] items-center justify-center gap-3 border border-[var(--color-primary)] px-6 text-sm font-bold uppercase tracking-[0.06em] text-[var(--color-primary)] transition hover:bg-[var(--color-hover)] lg:h-14 lg:px-7 lg:text-[15px]"
              onClick={() =>
                trackContactCta("directions_click", "Hero Directions")
              }
            >
              <FaMapMarkerAlt />
              Get Directions
            </a>
          </div>
          </div>
        </div>
        <div className="absolute right-[clamp(6.5rem,14vw,18.5rem)] top-24 z-10 hidden w-56 origin-top -translate-x-[190px] -translate-y-[70px] scale-[0.82] flex-col items-center text-[var(--color-primary)] lg:flex">
          <div className="origin-bottom -rotate-[8deg]">
            <p className="font-['Yellowtail'] text-[46px] font-normal leading-none tracking-[-0.015em]">Dallas, PA</p>
            <svg aria-hidden="true" className="mt-3 h-2 w-full text-[var(--color-primary)]" viewBox="0 0 224 8" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M2 6.25C53 4.35 118 4.85 222 1.75" stroke="currentColor" strokeWidth="1.45" strokeLinecap="round" />
            </svg>
          </div>
          <p className="ml-8 mt-7 self-start text-left text-[14px] font-medium uppercase leading-[1.8] tracking-[0.36em]">Drive<br />A better<br />Tomorrow</p>
        </div>
        <form onSubmit={(event) => { event.preventDefault(); searchHeroInventory(); }} className="absolute bottom-[52px] left-1/2 z-20 hidden w-[min(1200px,calc(100%-8rem))] -translate-x-1/2 rounded-md bg-[var(--color-primary)] p-5 text-white shadow-[0_22px_38px_rgba(20,28,23,0.28)] lg:block">
          <div className="flex items-center justify-between border-b border-white/15 pb-3 text-xs font-bold uppercase tracking-[0.08em]"><span className="border-b-2 border-[var(--color-accent)] pb-3">Search inventory</span><span className="text-white/70"><b className="mr-2 text-[var(--color-accent)]">•</b>{inventoryCount === null ? "Vehicles in stock" : `${inventoryCount} vehicles in stock`}</span></div>
          <div className="mt-4 grid grid-cols-[0.95fr_1.08fr_0.95fr_0.95fr_1.2fr] gap-4">
            <div className="flex h-16 flex-col gap-1 text-sm">
              <span className="leading-none text-white/50">Make</span>
              <HeroFilterSelect ariaLabel="Make" value={heroMake} disabled={heroFiltersLoading} onChange={setHeroMake} options={[{ value: "", label: "Any Make" }, ...heroMakes.map((make) => ({ value: make, label: make }))]} />
            </div>
            <div className="flex h-16 flex-col gap-1 text-sm">
              <span className="leading-none text-white/50">Model</span>
              <HeroFilterSelect ariaLabel="Model" value={heroModel} disabled={!heroMake || heroFiltersLoading} onChange={setHeroModel} options={[{ value: "", label: heroMake ? "Any Model" : "Select Make" }, ...heroModels.map((model) => ({ value: model, label: model }))]} />
            </div>
            <div className="flex h-16 flex-col gap-1 text-sm">
              <span className="leading-none text-white/50">Price</span>
              <HeroFilterSelect ariaLabel="Price" value={heroPrice} disabled={heroFiltersLoading} onChange={setHeroPrice} options={[{ value: "", label: "Any Price" }, ...heroPriceOptions]} />
            </div>
            <div className="flex h-16 flex-col gap-1 text-sm">
              <span className="leading-none text-white/50">Year</span>
              <HeroFilterSelect ariaLabel="Year" value={heroYear} disabled={heroFiltersLoading} onChange={setHeroYear} options={[{ value: "", label: "Any Year" }, ...heroYears.map((year) => ({ value: String(year), label: String(year) }))]} />
            </div>
            <button type="submit" className="h-[46px] self-end flex items-center justify-center gap-3 bg-[var(--color-accent)] text-sm font-bold uppercase tracking-[0.06em] transition hover:bg-[#ca5132] disabled:cursor-not-allowed disabled:opacity-60" disabled={heroFiltersLoading}>Search vehicles <FaArrowRight /></button>
          </div>
        </form>
        <div className="absolute bottom-5 left-[5.5rem] z-10 hidden items-center gap-3 text-[10px] font-bold uppercase tracking-[0.2em] text-[var(--color-primary)] lg:flex">
          <span>Est. local</span><i aria-hidden="true" className="h-px w-12 bg-[var(--color-accent)]" />
        </div>
      </section>

      <motion.section
        className="border-b border-[var(--color-primary)] bg-[var(--color-primary)] text-[#fffdf8]"
        initial={prefersReducedMotion ? false : { opacity: 0, clipPath: "inset(10% 0 0 0)" }}
        whileInView={{ opacity: 1, clipPath: "inset(0 0 0 0)" }}
        viewport={{ once: true, amount: 0.2 }}
        transition={{ duration: prefersReducedMotion ? 0.14 : 0.55, ease: [0.16, 1, 0.3, 1] }}
      >
        <div className="mx-auto grid max-w-[1440px] lg:grid-cols-[1.2fr_1fr_1fr]">
          <div className="border-b border-white/15 px-6 py-8 lg:border-b-0 lg:border-r lg:px-8">
            <p className="text-xs font-bold uppercase tracking-[0.14em] text-[#d2c9b7]">Start with what you need</p>
            <p className="mt-3 max-w-sm text-lg leading-7 text-white/76">Every vehicle, question, and next step starts with a direct conversation.</p>
          </div>
          {[
            ['Browse the lot', 'See current vehicles, prices, mileage, and details.', '/inventory'],
            ['Ask a question', 'Send us a message about a vehicle or your visit.', '/contact'],
          ].map(([title, text, href]) => (
            <Link key={href} to={href} className="group border-b border-white/15 px-6 py-8 transition hover:bg-white/10 lg:border-b-0 lg:border-r lg:last:border-r-0 lg:px-8">
              <span className="block font-['Barlow_Condensed'] text-3xl font-semibold uppercase leading-none tracking-[-0.02em]">{title}</span>
              <span className="mt-3 block max-w-[15rem] text-sm leading-6 text-white/64">{text}</span>
              <span className="mt-5 inline-flex items-center gap-2 text-xs font-bold uppercase tracking-[0.1em] text-[#e1b18e]">Open <FaArrowRight className="transition group-hover:translate-x-1" /></span>
            </Link>
          ))}
        </div>
      </motion.section>

      <motion.section
        className="featured-vehicles-section"
        initial={prefersReducedMotion ? false : { opacity: 0, clipPath: "inset(8% 0 0 0)" }}
        whileInView={{ opacity: 1, clipPath: "inset(0 0 0 0)" }}
        viewport={{ once: true, amount: 0.12 }}
        transition={{ duration: prefersReducedMotion ? 0.14 : 0.62, ease: [0.16, 1, 0.3, 1] }}
      >
        <div className="featured-vehicles-container">
          <div className="featured-vehicles-heading">
            <p className="featured-vehicles-kicker">Featured vehicles <i /></p>
            <h2>Quality vehicles.<br /><span>Ready for the road.</span></h2>
            <p className="featured-vehicles-description">Explore our latest arrivals. Clean titles, great prices, and vehicles you can count on, all here at Rick&apos;s Used Cars.</p>
          </div>
          <div className="featured-vehicles-aside">
            <div className="flex items-center justify-between lg:hidden">
              <span className="featured-vehicles-page-count" aria-live="polite"><b>{String(featuredMobileIndex + 1).padStart(2, "0")}</b><i />{String(featured.length).padStart(2, "0")}</span>
              <Link to="/inventory" className="featured-vehicles-inventory-link">View all inventory <FaArrowRight /></Link>
            </div>
            <div className="featured-vehicles-controls hidden lg:flex">
              <div className="featured-vehicles-arrows">
                <button type="button" aria-label="Show previous featured vehicles" disabled={featuredPageCount <= 1} onClick={() => changeFeaturedPage(-1)}><FaArrowLeft /></button>
                <button type="button" aria-label="Show next featured vehicles" disabled={featuredPageCount <= 1} onClick={() => changeFeaturedPage(1)}><FaArrowRight /></button>
                <span className="featured-vehicles-page-count" aria-live="polite"><b>{String(featuredPage + 1).padStart(2, "0")}</b><i />{String(featuredPageCount).padStart(2, "0")}</span>
              </div>
              <Link to="/inventory" className="featured-vehicles-inventory-link">View all inventory <FaArrowRight /></Link>
            </div>
            <div className="featured-vehicles-trust">
              <span><FaCar />Quality<br />inspected</span><i />
              <span><FaShieldAlt />Fair<br />pricing</span><i />
              <span><FaUsers />Local<br />dealership</span>
            </div>
          </div>

          <div className="featured-vehicles-content lg:hidden">
            {featuredLoading ? <FeaturedVehiclesSkeleton /> : featuredError ? (
              <div className="featured-vehicles-message">Inventory is temporarily unavailable. Please try again later or call us for current vehicles.</div>
            ) : mobileFeaturedVehicle ? (
              <AnimatePresence initial={false} mode="wait">
                <motion.div
                  key={mobileFeaturedVehicle.id}
                  className="featured-vehicles-mobile-grid"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: prefersReducedMotion ? 0.08 : 0.18, ease: [0.16, 1, 0.3, 1] }}
                >
                  <FeaturedVehicleShowcase vehicle={mobileFeaturedVehicle} />
                </motion.div>
              </AnimatePresence>
            ) : <div className="featured-vehicles-message">No featured vehicles are available right now. Please check the full inventory or call us.</div>}
          </div>

          <div className="flex justify-center pt-5 lg:hidden">
            <div className="featured-vehicles-arrows">
              <button type="button" aria-label="Show previous featured vehicle" disabled={featured.length <= 1} onClick={() => changeFeaturedMobileVehicle(-1)}><FaArrowLeft /></button>
              <button type="button" aria-label="Show next featured vehicle" disabled={featured.length <= 1} onClick={() => changeFeaturedMobileVehicle(1)}><FaArrowRight /></button>
            </div>
          </div>

          <div className="featured-vehicles-content hidden lg:block">
            {featuredLoading ? <FeaturedVehiclesSkeleton /> : featuredError ? (
              <div className="featured-vehicles-message">Inventory is temporarily unavailable. Please try again later or call us for current vehicles.</div>
            ) : visibleFeaturedVehicles.length ? (
              <AnimatePresence initial={false} mode="wait">
                <motion.div
                  key={featuredPage}
                  className="featured-vehicles-grid"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: prefersReducedMotion ? 0.08 : 0.18, ease: [0.16, 1, 0.3, 1] }}
                >
                  {visibleFeaturedVehicles.map((vehicle) => <FeaturedVehicleShowcase key={vehicle.id} vehicle={vehicle} />)}
                </motion.div>
              </AnimatePresence>
            ) : <div className="featured-vehicles-message">No featured vehicles are available right now. Please check the full inventory or call us.</div>}
          </div>

          <div className="featured-vehicles-bottom"><Link to="/inventory">View all vehicles <FaArrowRight /></Link></div>
          <div className="featured-vehicles-footer-mark featured-vehicles-footer-mark--left"><span>Est. local</span><i /></div>
          <div className="featured-vehicles-footer-mark featured-vehicles-footer-mark--right"><i /><span>Cars for<br />real life</span></div>
        </div>
      </motion.section>

      <ReviewCarousel />

      <section className="visit-dealership-section">
        <div className="visit-dealership-container">
          <div className="visit-dealership-block">
            <div className="visit-dealership-photo">
              <img
                src="/images/ricks-used-cars-notary.webp"
                alt="Rick's Used Cars dealership in Dallas, Pennsylvania"
                loading="lazy"
              />
              <span className="visit-dealership-location"><FaMapMarkerAlt />Dallas, PA</span>
            </div>

            <div className="visit-dealership-content">
              <p className="visit-dealership-kicker">Visit the dealership <i /></p>
              <h2>Visit a real local <span>dealership in Dallas.</span></h2>
              <p className="visit-dealership-description">
                See the vehicles in person, ask direct questions, and work with a local team that knows the lot.
              </p>
              <ul className="visit-dealership-facts">
                <li><FaMapMarkerAlt />Local Dallas dealership</li>
                <li><FaCar />Used cars, trucks &amp; SUVs</li>
                <li><FaRoad />Directions available on Google Maps</li>
              </ul>
              <div className="visit-dealership-actions">
                <Button href={business.mapsUrl} className="visit-dealership-button visit-dealership-button--primary">Get directions <FaArrowRight /></Button>
                <Button href="/contact" variant="secondary" className="visit-dealership-button visit-dealership-button--secondary">Contact us</Button>
              </div>
            </div>
          </div>

          <div className="visit-dealership-mark visit-dealership-mark--bottom-left"><span>Est. local</span><i /></div>
          <div className="visit-dealership-mark visit-dealership-mark--bottom-right"><i /><span>Cars for<br />real life</span></div>
        </div>
      </section>
    </>
  );
};
