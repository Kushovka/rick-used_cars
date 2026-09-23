import { useMemo, useState } from 'react'
import { formatPrice } from '../utils/format'

export const FinancingCalculator = () => {
  const [price, setPrice] = useState(35000)
  const [down, setDown] = useState(5000)
  const [term, setTerm] = useState(72)
  const [rate, setRate] = useState(6.9)

  const monthly = useMemo(() => {
    const principal = Math.max(price - down, 0)
    const monthlyRate = rate / 100 / 12
    if (monthlyRate === 0) {
      return principal / term
    }
    return (principal * monthlyRate) / (1 - (1 + monthlyRate) ** -term)
  }, [down, price, rate, term])

  return (
    <section className="financing-calculator rounded-[5px] bg-[#10251c] p-6 text-[#fffdf8] sm:p-8">
      <p className="text-[11px] font-bold uppercase tracking-[0.17em] text-[rgba(255,253,248,0.72)]">Payment calculator</p>
      <h2 className="mt-1 text-[21px] font-medium tracking-[-0.03em]">Estimate your monthly payment</h2>
      <div className="mt-5 grid gap-3.5">
        <label className="grid gap-1.5 text-[10px] font-bold uppercase tracking-[0.14em] text-[rgba(255,253,248,0.75)]">Vehicle price<input className="h-11 rounded-[2px] border-0 bg-[#fffdf8] px-3 text-[15px] font-medium text-[var(--color-text)] outline-none ring-2 ring-transparent transition focus:ring-[var(--color-accent)]" type="number" value={price} onChange={(event) => setPrice(Number(event.target.value))} /></label>
        <label className="grid gap-1.5 text-[10px] font-bold uppercase tracking-[0.14em] text-[rgba(255,253,248,0.75)]">Down payment<input className="h-11 rounded-[2px] border-0 bg-[#fffdf8] px-3 text-[15px] font-medium text-[var(--color-text)] outline-none ring-2 ring-transparent transition focus:ring-[var(--color-accent)]" type="number" value={down} onChange={(event) => setDown(Number(event.target.value))} /></label>
        <div className="grid gap-3.5 sm:grid-cols-2">
          <label className="grid gap-1.5 text-[10px] font-bold uppercase tracking-[0.14em] text-[rgba(255,253,248,0.75)]">Term<select className="h-11 rounded-[2px] border-0 bg-[#fffdf8] px-3 text-[15px] font-medium text-[var(--color-text)] outline-none ring-2 ring-transparent transition focus:ring-[var(--color-accent)]" value={term} onChange={(event) => setTerm(Number(event.target.value))}><option value={48}>48 months</option><option value={60}>60 months</option><option value={72}>72 months</option></select></label>
          <label className="grid gap-1.5 text-[10px] font-bold uppercase tracking-[0.14em] text-[rgba(255,253,248,0.75)]">Interest rate<input className="h-11 rounded-[2px] border-0 bg-[#fffdf8] px-3 text-[15px] font-medium text-[var(--color-text)] outline-none ring-2 ring-transparent transition focus:ring-[var(--color-accent)]" type="number" step="0.1" value={rate} onChange={(event) => setRate(Number(event.target.value))} /></label>
        </div>
      </div>
      <div className="mt-5 border-t border-[rgba(255,253,248,0.25)] pt-3.5">
        <p className="text-[12px] font-bold text-[var(--color-accent)]">Estimated monthly payment</p>
        <p className="mt-1 font-['Barlow_Condensed'] text-[47px] font-bold leading-none tracking-[-0.02em]">{formatPrice(monthly)}</p>
        <p className="mt-2 max-w-md text-[11px] leading-[1.45] text-[rgba(255,253,248,0.65)]">This is an estimate only. Actual rates and payments may vary based on credit, lender, and vehicle.</p>
      </div>
    </section>
  )
}
