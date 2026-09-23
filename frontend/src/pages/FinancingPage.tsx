import { Link } from 'react-router'
import { FaArrowRight, FaCarSide, FaCheck, FaDollarSign, FaFileAlt, FaShieldAlt, FaUsers } from 'react-icons/fa'
import { FinancingCalculator } from '../components/FinancingCalculator'
import { LeadForm } from '../components/LeadForm'
import { Seo } from '../components/Seo'

const benefits = [
  { icon: FaDollarSign, title: 'Competitive Rates', copy: 'We work with trusted lenders to get you the best terms.' },
  { icon: FaFileAlt, title: 'Fast Pre-Approval', copy: 'Get started in minutes, with no impact to your credit score.' },
  { icon: FaUsers, title: 'All Credit Situations', copy: "Good credit, bad credit, or no credit - we'll help you find a solution." },
  { icon: FaShieldAlt, title: 'No-Pressure Process', copy: "Transparent, straightforward, and focused on what's right for you." },
]

export const FinancingPage = () => (
  <>
    <Seo title="Flexible Financing Options" description="Get pre-approved for a used vehicle at Rick's Used Cars in Dallas, PA." />
    <section className="relative isolate min-h-[480px] overflow-hidden bg-[#102019] text-[#fffdf8] sm:min-h-[330px]">
      <img src="/images/financing-hero-bmw.png" alt="BMW sedan at sunset" className="absolute inset-0 -z-20 h-full w-full object-cover object-[61%_center] sm:object-[center_right]" />
      <div className="absolute inset-0 -z-10 bg-[linear-gradient(90deg,rgba(11,28,21,0.98)_0%,rgba(12,28,21,0.88)_31%,rgba(12,28,21,0.32)_57%,rgba(12,28,21,0.05)_78%)]" />
      <div className="mx-auto grid min-h-[480px] max-w-[1240px] items-center px-5 py-12 sm:min-h-[330px] sm:px-8 lg:px-10">
        <div className="max-w-[570px]">
          <p className="flex items-center gap-3 text-[10px] font-bold uppercase tracking-[0.18em] text-[#fffdf8]"><span>Financing</span><i className="block h-px w-9 bg-[var(--color-accent)]" /></p>
          <h1 className="mt-2.5 font-['Barlow_Condensed'] text-[55px] font-bold uppercase leading-[0.88] tracking-[-0.025em] sm:text-[70px]">
            <span className="block">Your next car</span><span className="block text-[var(--color-accent)]">within reach.</span>
          </h1>
          <p className="mt-3.5 max-w-[510px] text-[15px] leading-[1.48] text-[rgba(255,253,248,0.9)] sm:text-[17px]">Flexible financing options, competitive rates, and a simple process - so you can drive with confidence.</p>
        </div>
      </div>
    </section>

    <section className="bg-[#f7f3ea]">
      <div className="mx-auto grid max-w-[1240px] divide-y divide-[var(--color-divider)] px-5 sm:grid-cols-2 sm:px-8 lg:grid-cols-4 lg:divide-x lg:divide-y-0 lg:px-10">
        {benefits.map(({ icon: Icon, title, copy }) => (
          <article key={title} className="grid grid-cols-[36px_1fr] gap-3 py-6 first:lg:pl-0 lg:px-5 lg:py-6">
            <Icon className="mt-0.5 text-[27px] text-[var(--color-accent)]" aria-hidden="true" />
            <div><h2 className="text-[14px] font-bold tracking-[-0.02em] text-[var(--color-text)]">{title}</h2><p className="mt-1 text-[12px] leading-[1.38] text-[var(--color-muted)]">{copy}</p></div>
          </article>
        ))}
      </div>
    </section>

    <section className="bg-[var(--color-background)] px-5 py-[72px] sm:px-8 lg:py-[86px]">
      <div className="mx-auto grid max-w-[1240px] gap-12 lg:grid-cols-[0.42fr_0.58fr] lg:items-center lg:gap-16">
        <div>
          <p className="flex items-center gap-2.5 text-[10px] font-bold uppercase tracking-[0.17em] text-[var(--color-accent)]"><i className="block h-px w-6 bg-[var(--color-accent)]" />Estimate your payment</p>
          <h2 className="mt-4 max-w-[450px] text-[42px] font-medium leading-[1.02] tracking-[-0.045em] text-[var(--color-text)] sm:text-[52px]">See what your<br />payment could be.</h2>
          <p className="mt-4 max-w-[425px] text-[15px] leading-[1.52] text-[var(--color-muted)] sm:text-[16px]">Use our payment calculator to get an estimated monthly payment. Then, you can submit a quick request to get pre-approved.</p>
          <div className="mt-5 grid grid-cols-[52px_1fr] gap-x-3 rounded-[4px] bg-[rgba(233,227,215,0.62)] p-5 sm:mt-6">
            <FaCarSide className="mt-1 text-[33px] text-[var(--color-primary)]" aria-hidden="true" />
            <div><h3 className="text-[15px] font-bold tracking-[-0.025em] text-[var(--color-text)]">Not sure which vehicle?</h3><p className="mt-1 text-[12px] leading-[1.45] text-[var(--color-muted)]">That's okay. You can still get pre-approved and shop with confidence.</p><Link to="#pre-approval" className="mt-3 inline-flex h-9 min-w-[205px] items-center justify-center gap-3 border border-[var(--color-primary)] px-4 text-[11px] font-bold text-[var(--color-primary)] transition hover:bg-[var(--color-primary)] hover:text-[#fffdf8] active:translate-y-px">Get Pre-Approved <FaArrowRight /></Link></div>
          </div>
        </div>
        <FinancingCalculator />
      </div>
    </section>

    <section id="pre-approval" className="scroll-mt-24 bg-[#e9e3d7] px-5 py-[70px] sm:px-8 lg:py-[78px]">
      <div className="mx-auto grid max-w-[1240px] gap-10 lg:grid-cols-[0.42fr_0.58fr] lg:items-center lg:gap-16">
        <div>
          <p className="flex items-center gap-2.5 text-[10px] font-bold uppercase tracking-[0.17em] text-[var(--color-accent)]"><i className="block h-px w-6 bg-[var(--color-accent)]" />Get pre-approved</p>
          <h2 className="mt-4 max-w-[460px] text-[40px] font-medium leading-[1.04] tracking-[-0.045em] text-[var(--color-text)] sm:text-[50px]">Take the next step toward your next vehicle.</h2>
          <p className="mt-3 max-w-[430px] text-[15px] leading-[1.5] text-[var(--color-muted)] sm:text-[16px]">Fill out the form and our team will be in touch to discuss your options.</p>
          <ul className="mt-5 grid gap-3 text-[14px] text-[var(--color-text)]">{['Quick and easy application', 'No obligation', "We'll find the right option for you"].map((item) => <li key={item} className="flex items-center gap-3"><span className="grid h-5 w-5 place-items-center rounded-full bg-[var(--color-accent)] text-[10px] text-white"><FaCheck /></span>{item}</li>)}</ul>
        </div>
        <LeadForm title="Get Pre-Approved" fields="finance" variant="finance" />
      </div>
    </section>
  </>
)
