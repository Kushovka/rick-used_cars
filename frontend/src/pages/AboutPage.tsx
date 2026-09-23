import type { ReactNode } from 'react'
import { Seo } from '../components/Seo'

const facts = [
  { title: 'Dallas, PA', description: <>Proudly serving our local community<br className="hidden xl:block" /> and surrounding areas.</> },
  { title: 'Used cars, trucks & SUVs', description: <>A carefully selected inventory<br className="hidden xl:block" /> for real drivers.</> },
  { title: 'Family-owned since 2017', description: <>Local people. Long-term commitment<br className="hidden xl:block" /> to our community.</> },
]

const reasons = [
  { title: 'Straight answers.', description: <>We provide honest information<br className="hidden xl:block" /> about our vehicles, including<br className="hidden xl:block" /> condition, history, and pricing.</> },
  { title: 'A no-pressure process.', description: <>Take your time, ask questions,<br className="hidden xl:block" /> and make the decision that is<br className="hidden xl:block" /> right for you.</> },
  { title: 'Local support.', description: <>We’re here before, during, and<br className="hidden xl:block" /> after the sale, with a team that<br className="hidden xl:block" /> lives and works in this community.</> },
]

const AccentLabel = ({ children, light = false }: { children: ReactNode; light?: boolean }) => (
  <p className={`flex items-center gap-3 text-[10px] font-bold uppercase tracking-[0.15em] sm:text-[11px] ${light ? 'text-[#fffdf8]' : 'text-[var(--color-accent)]'}`}>
    <span className="h-px w-7 shrink-0 bg-[var(--color-accent)] sm:w-8" />{children}
  </p>
)

export const AboutPage = () => (
  <>
    <Seo title="About Rick's Used Cars" description="Learn about Rick's Used Cars, a local used car dealership serving Dallas-area drivers with straightforward support." />
    <section className="relative isolate min-h-[326px] overflow-hidden bg-[#10231d] bg-[url('/images/ricks-used-cars-hero.webp')] bg-[position:center_54%] bg-cover text-[#fffdf8] sm:min-h-[342px] lg:min-h-[330px]">
      <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(10,28,22,.97)_0%,rgba(10,28,22,.89)_34%,rgba(10,28,22,.46)_56%,rgba(10,28,22,.08)_78%,rgba(10,28,22,.02)_100%)]" />
      <div className="absolute inset-y-0 right-0 w-[32%] bg-gradient-to-l from-[#071c16]/75 via-[#071c16]/35 to-transparent" />
      <div className="relative mx-auto flex min-h-[326px] max-w-[1400px] items-center px-5 py-10 sm:min-h-[342px] sm:px-8 lg:min-h-[330px] lg:px-12 xl:px-0">
        <div className="max-w-[580px] pt-1"><AccentLabel light>About Rick&apos;s Used Cars</AccentLabel><h1 className="mt-3 font-['Barlow_Condensed'] text-[47px] font-bold uppercase leading-[.88] tracking-[-0.035em] sm:text-[56px] lg:text-[58px]"><span className="block">A local Dallas</span><span className="block">dealership <strong className="font-inherit text-[var(--color-accent)]">built on</strong></span><strong className="block font-inherit text-[var(--color-accent)]">straight answers.</strong></h1><p className="mt-3 max-w-[490px] text-[14px] leading-6 text-white/90 sm:text-[16px] sm:leading-7">Quality used vehicles, honest information, and real support<br className="hidden lg:block" /> for drivers in our community.</p></div>
      </div>
    </section>
    <section className="bg-[var(--color-surface)]"><div className="mx-auto grid max-w-[1400px] px-5 py-7 sm:px-8 lg:grid-cols-3 lg:px-12 lg:py-8 xl:px-0">{facts.map((fact, index) => <div key={fact.title} className={`py-4 text-center lg:min-h-[78px] lg:px-12 lg:py-0 ${index > 0 ? 'border-t border-[var(--color-divider)] lg:border-l lg:border-t-0' : ''} ${index === 0 ? 'lg:pl-0' : ''}`}><h2 className="text-[15px] font-bold uppercase leading-5 text-[var(--color-text)] sm:text-[16px]">{fact.title}</h2><p className="mt-1.5 text-[14px] leading-5 text-[var(--color-muted)] sm:text-[15px]">{fact.description}</p></div>)}</div></section>
    <section className="bg-[var(--color-background)]"><div className="mx-auto grid max-w-[1400px] gap-10 px-5 py-12 sm:px-8 md:gap-12 lg:grid-cols-[1.16fr_.84fr] lg:items-center lg:gap-12 lg:px-12 lg:py-[72px] xl:px-0"><div className="relative min-h-[360px] overflow-hidden sm:min-h-[460px] lg:min-h-[526px]"><img src="/images/ricks-used-cars-notary.webp" alt="Rick's Used Cars notary building and vehicle lot" className="absolute inset-0 h-full w-full object-cover object-center" /><span className="absolute left-5 top-5 bg-[var(--color-primary)] px-3 py-2 text-[9px] font-bold uppercase tracking-[0.13em] text-[#fffdf8]">Dallas, PA</span></div><div className="max-w-[475px] lg:justify-self-end"><AccentLabel>Our story</AccentLabel><h2 className="mt-3 font-['Barlow_Condensed'] text-[53px] font-bold uppercase leading-[.88] tracking-[-0.032em] text-[var(--color-primary)] sm:text-[61px] lg:text-[64px]">Built for this<br />community.</h2><div className="mt-5 space-y-4 text-[15px] leading-[1.42] text-[var(--color-text)] sm:text-[16px] sm:leading-[1.45]"><p>Rick&apos;s Used Cars was founded on a simple idea: treat people right, offer dependable vehicles, and make the car buying process straightforward.</p><p>We&apos;re proud to serve Dallas-area drivers with a local, no-pressure approach and a focus on long-term relationships. Whether you&apos;re buying your first car, upgrading for your family, or adding a truck to your fleet, we&apos;re here to help with honest answers and personalized support.</p></div></div></div></section>
    <section className="bg-[var(--color-surface)]"><div className="mx-auto max-w-[1400px] px-5 py-10 sm:px-8 lg:px-12 lg:py-11 xl:px-0"><div className="flex justify-start"><AccentLabel>Why Rick&apos;s</AccentLabel></div><div className="mt-5 grid lg:grid-cols-3">{reasons.map((reason, index) => <div key={reason.title} className={`py-5 text-center lg:min-h-[96px] lg:px-12 lg:py-0 ${index > 0 ? 'border-t border-[var(--color-divider)] lg:border-l lg:border-t-0' : ''} ${index === 0 ? 'lg:pl-0' : ''}`}><h2 className="text-[21px] font-bold leading-7 tracking-[-0.035em] text-[var(--color-text)] sm:text-[24px]">{reason.title}</h2><p className="mt-1.5 text-[14px] leading-[1.43] text-[var(--color-muted)] sm:text-[15px]">{reason.description}</p></div>)}</div></div></section>
    <section className="bg-[var(--color-background)]"><div className="mx-auto grid max-w-[1400px] gap-9 px-5 py-11 sm:px-8 lg:grid-cols-[1.38fr_.82fr] lg:gap-12 lg:px-12 lg:py-12 xl:px-0"><div><AccentLabel>Local cars. Real people.</AccentLabel><h2 className="mt-3 font-['Barlow_Condensed'] text-[48px] font-bold uppercase leading-[.88] tracking-[-0.035em] sm:text-[56px] lg:text-[60px]"><span className="block text-[var(--color-primary)]">Straight answers</span><span className="block text-[var(--color-accent)]">drive everything we do.</span></h2></div><div className="border-t border-[var(--color-divider)] pt-7 lg:border-l lg:border-t-0 lg:pl-12 lg:pt-2"><p className="max-w-[405px] text-[16px] leading-[1.45] tracking-[-0.015em] text-[var(--color-text)] sm:text-[17px]">Rick&apos;s Used Cars is part of the Dallas community. Our goal is simple: help local drivers find reliable vehicles and have a better car buying experience.</p></div></div></section>
  </>
)
