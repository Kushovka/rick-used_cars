import { Seo } from '../components/Seo'
import { teamPortraits } from '../data/team'

export const TeamPage = () => (
  <main>
    <Seo title="Our Team" description="Meet the friendly team at Rick's Used Cars in Dallas, PA." />
    <section className="bg-[var(--color-background)]">
      <div className="mx-auto max-w-[1400px] px-5 py-14 sm:px-8 sm:py-16 lg:px-12 lg:py-20 xl:px-0">
        <div className="grid gap-7 border-b border-[var(--color-divider)] pb-9 sm:gap-8 lg:grid-cols-[minmax(0,1fr)_360px] lg:items-end lg:pb-11">
          <h1 className="max-w-[670px] font-['Barlow_Condensed'] text-[52px] font-bold uppercase leading-[.88] tracking-[-0.035em] text-[var(--color-primary)] sm:text-[61px] lg:text-[68px]">Our team.<br /><span className="text-[var(--color-accent)]">Here to help.</span></h1>
          <p className="max-w-[350px] text-[16px] leading-[1.45] tracking-[-0.015em] text-[var(--color-text)] sm:text-[17px] lg:justify-self-end">Friendly people, straightforward conversations, and support when you need it.</p>
        </div>
        <div className="mt-7 grid grid-cols-2 gap-4 sm:mt-8 sm:gap-5 lg:grid-cols-4 lg:gap-6">
          {teamPortraits.map((member, index) => (
            <article key={member.src} className="group overflow-hidden rounded-[14px] bg-[var(--color-surface)] shadow-[0_10px_26px_rgba(31,40,33,0.12)]">
              <div className="relative aspect-[4/5] overflow-hidden bg-[var(--color-accent)]">
                <img src={member.src} alt={member.alt} loading={index > 3 ? 'lazy' : 'eager'} className="absolute inset-0 h-full w-full object-cover object-center transition duration-500 ease-out motion-safe:group-hover:scale-[1.035]" />
              </div>
              <div className="px-4 py-4 sm:px-5 sm:py-5">
                <h2 className="font-['Barlow_Condensed'] text-[25px] font-bold uppercase leading-none tracking-[-0.025em] text-[var(--color-primary)] sm:text-[29px]">{member.label}</h2>
                <p className="mt-1 text-[13px] font-medium text-[var(--color-accent)] sm:text-[14px]">{member.role}</p>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  </main>
)
