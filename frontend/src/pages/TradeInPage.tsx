import { FaCarSide, FaClock, FaExchangeAlt, FaShieldAlt, FaTag, FaThumbsUp, FaUsers } from 'react-icons/fa'
import { LeadForm } from '../components/LeadForm'
import { Seo } from '../components/Seo'

const steps = [
  { number: '1', title: 'Tell Us About Your Vehicle', copy: 'Share a few quick details — make, model, year, mileage, and condition.' },
  { number: '2', title: 'Get Your Estimate', copy: "We'll provide a real market value based on current demand." },
  { number: '3', title: 'Trade In or Sell', copy: "Use your value toward a new vehicle or sell your car outright. It's up to you." },
]

const helpfulDetails = [
  { icon: FaTag, title: 'Real Market Value', copy: 'We use current market data to give you a fair estimate.' },
  { icon: FaClock, title: 'No Obligation', copy: 'Get your estimate with no pressure to buy from us.' },
  { icon: FaExchangeAlt, title: 'Apply Toward Any Vehicle', copy: 'Use your trade-in value toward any vehicle in our inventory.' },
]

const trustPoints = [
  { icon: FaCarSide, title: 'All Makes & Models', copy: 'Cars, trucks, SUVs — we take them all.' },
  { icon: FaShieldAlt, title: 'Transparent Process', copy: 'No hidden fees or surprises.' },
  { icon: FaUsers, title: 'Local & Trusted', copy: 'Proudly serving drivers in Pennsylvania.' },
  { icon: FaThumbsUp, title: 'Fast and Easy', copy: 'Get your estimate in minutes.' },
]

export const TradeInPage = () => (
  <>
    <Seo title="Trade-In Estimate" description="Tell Rick's Used Cars about your vehicle and get a straightforward trade-in estimate from our local team." />

    <section className="relative isolate min-h-[470px] overflow-hidden bg-[#102019] text-[#fffdf8] sm:min-h-[300px]">
      <img src="/images/trade-in-hero-pickup.png" alt="Gray pickup truck at sunset" className="absolute inset-0 -z-20 h-full w-full object-cover object-[65%_center] sm:object-[center_right]" />
      <div className="absolute inset-0 -z-10 bg-[linear-gradient(90deg,rgba(8,23,16,0.98)_0%,rgba(12,29,21,0.89)_32%,rgba(12,29,21,0.37)_58%,rgba(12,29,21,0.05)_81%)]" />
      <div className="mx-auto flex min-h-[470px] max-w-[1240px] items-center px-5 py-12 sm:min-h-[300px] sm:px-8 lg:px-10">
        <div className="max-w-[630px]">
          <p className="flex items-center gap-3 text-[10px] font-bold uppercase tracking-[0.18em] text-[#fffdf8]"><span>Trade-In</span><i className="block h-px w-9 bg-[var(--color-accent)]" /></p>
          <h1 className="mt-3 font-['Barlow_Condensed'] text-[56px] font-bold uppercase leading-[0.86] tracking-[-0.028em] sm:text-[58px]">
            <span className="block">Your car has value.</span><span className="block text-[var(--color-accent)]">Let's find out how much.</span>
          </h1>
          <p className="mt-4 max-w-[460px] text-[15px] leading-[1.55] text-[rgba(255,253,248,0.9)] sm:text-[16px]">Tell us about your current vehicle and we'll help you get a real trade-in estimate — fast, easy, and no obligation.</p>
        </div>
      </div>
    </section>

    <section className="bg-[#f7f3ea]">
      <div className="mx-auto grid max-w-[1240px] divide-y divide-[var(--color-divider)] px-5 sm:px-8 md:grid-cols-3 md:divide-x md:divide-y-0 lg:px-10">
        {steps.map(({ number, title, copy }) => (
          <article key={number} className="grid grid-cols-[42px_1fr] gap-3 py-6 first:md:pl-0 md:px-8 md:py-6">
            <span className="grid h-9 w-9 place-items-center rounded-full border-2 border-[var(--color-accent)] font-['Barlow_Condensed'] text-[25px] font-bold leading-none text-[var(--color-accent)]">{number}</span>
            <div><h2 className="text-[14px] font-bold tracking-[-0.02em] text-[var(--color-text)]">{title}</h2><p className="mt-1 text-[12px] leading-[1.4] text-[var(--color-muted)]">{copy}</p></div>
          </article>
        ))}
      </div>
    </section>

    <section className="bg-[var(--color-background)] px-5 py-[68px] sm:px-8 lg:py-[78px]">
      <div className="mx-auto grid max-w-[1240px] gap-12 lg:grid-cols-[0.42fr_0.58fr] lg:items-start lg:gap-7">
        <div>
          <p className="flex items-center gap-2.5 text-[10px] font-bold uppercase tracking-[0.17em] text-[var(--color-accent)]">Turn your car into<i className="block h-px w-8 bg-[var(--color-accent)]" />what's next</p>
          <h2 className="mt-4 max-w-[420px] text-[42px] font-medium leading-[1.02] tracking-[-0.045em] text-[var(--color-primary)] sm:text-[53px]">A better way<br />to move forward.</h2>
          <p className="mt-4 max-w-[395px] text-[15px] leading-[1.52] text-[var(--color-muted)] sm:text-[16px]">Trading in your vehicle is a simple way to put its value toward your next car. We make the process straightforward, transparent, and hassle-free.</p>
          <div className="mt-6 grid gap-5">
            {helpfulDetails.map(({ icon: Icon, title, copy }) => <article key={title} className="grid grid-cols-[48px_1fr] gap-3"><Icon className="mt-0.5 text-[31px] text-[var(--color-accent)]" aria-hidden="true" /><div><h3 className="text-[14px] font-bold text-[var(--color-text)]">{title}</h3><p className="mt-0.5 max-w-[245px] text-[13px] leading-[1.4] text-[var(--color-muted)]">{copy}</p></div></article>)}
          </div>
          <img src="/images/trade-in-key-handoff.png" alt="Driver holding a vehicle key in front of Rick's Used Cars" className="mt-8 aspect-[1.47/1] w-full max-w-[470px] rounded-[5px] object-cover object-top lg:h-[320px] lg:w-[calc(100%+36px)] lg:max-w-[506px] lg:aspect-auto" />
        </div>
        <LeadForm title="Get My Trade-In Estimate" fields="trade" variant="trade" />
      </div>
    </section>

    <section className="border-t border-[var(--color-divider)] bg-[#f7f3ea]">
      <div className="mx-auto grid max-w-[1240px] divide-y divide-[var(--color-divider)] px-5 sm:grid-cols-2 sm:px-8 lg:grid-cols-4 lg:divide-x lg:divide-y-0 lg:px-10">
        {trustPoints.map(({ icon: Icon, title, copy }) => (
          <article key={title} className="grid grid-cols-[39px_1fr] gap-3 py-7 first:lg:pl-0 lg:px-5">
            <Icon className="mt-0.5 text-[28px] text-[var(--color-accent)]" aria-hidden="true" />
            <div><h2 className="text-[14px] font-bold text-[var(--color-text)]">{title}</h2><p className="mt-1 text-[12px] leading-[1.4] text-[var(--color-muted)]">{copy}</p></div>
          </article>
        ))}
      </div>
    </section>
  </>
)
