import { useMemo, useState } from 'react'
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion'
import { FaArrowLeft, FaArrowRight, FaGoogle, FaStar } from 'react-icons/fa'
import { business } from '../data/business'
import { reviews } from '../data/reviews'

const initials = (name: string) => name.split(' ').filter(Boolean).slice(0, 2).map((part) => part[0]).join('').toUpperCase()

const reviewExcerpt = (text: string) => {
  const normalized = text.trim()
  return normalized.length > 122 ? `${normalized.slice(0, 119).trimEnd()}…` : normalized
}

const Stars = () => (
  <span className="reviews-stars" aria-label="Five star rating">
    {Array.from({ length: 5 }).map((_, index) => <FaStar key={index} />)}
  </span>
)

export const ReviewCarousel = () => {
  const pages = useMemo(() => Array.from({ length: Math.ceil(reviews.length / 3) }, (_, index) => reviews.slice(index * 3, index * 3 + 3)), [])
  const [activePage, setActivePage] = useState(0)
  const [pageDirection, setPageDirection] = useState<1 | -1>(1)
  const prefersReducedMotion = useReducedMotion()
  const activeReviews = pages[activePage] ?? pages[0] ?? []
  const canPaginate = pages.length > 1
  const changePage = (direction: 1 | -1) => {
    setPageDirection(direction)
    setActivePage((page) => (page + direction + pages.length) % pages.length)
  }

  return (
    <section className="reviews-section" aria-labelledby="reviews-heading">
      <div className="reviews-container">
        <div className="reviews-intro">
          <div>
            <p className="reviews-kicker">Google reviews <i /></p>
            <h2 id="reviews-heading">Real people.<span>Real experiences.</span></h2>
            <p className="reviews-description">Don't just take our word for it. See what our customers have to say about their experience at Rick's Used Cars.</p>
          </div>
          <div className="reviews-actions">
            <div className="reviews-arrows hidden lg:flex" aria-label="Review carousel controls">
              <button type="button" onClick={() => changePage(-1)} disabled={!canPaginate} aria-label="Show previous reviews"><FaArrowLeft /></button>
              <button type="button" onClick={() => changePage(1)} disabled={!canPaginate} aria-label="Show next reviews"><FaArrowRight /></button>
            </div>
            <a href={business.reviewsUrl} target="_blank" rel="noreferrer" className="reviews-all-link">View all reviews <FaArrowRight /></a>
          </div>
        </div>

        <div className="reviews-composition">
          <aside className="reviews-rating-card">
            <div className="reviews-google-label"><FaGoogle /> <span>Google reviews</span></div>
            <div className="reviews-rating"><strong>4.8</strong><span>/5</span></div>
            <Stars />
            <p className="reviews-rating-copy">Based on Google reviews from drivers who visited the lot, asked questions, and worked with the team in person.</p>
            <p className="reviews-count">{activeReviews.length} recent {activeReviews.length === 1 ? 'review' : 'reviews'} shown</p>
            <a href={business.reviewsUrl} target="_blank" rel="noreferrer" className="reviews-google-link">View Google reviews</a>
          </aside>
          <div className="reviews-cards" aria-live="polite">
            <AnimatePresence initial={false} mode="wait">
              <motion.div
                key={activePage}
                className="reviews-cards-page"
                initial={{ opacity: 0, y: prefersReducedMotion ? 0 : pageDirection * 8, filter: prefersReducedMotion ? 'none' : 'blur(2px)' }}
                animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
                exit={{ opacity: 0, y: prefersReducedMotion ? 0 : pageDirection * -4, filter: prefersReducedMotion ? 'none' : 'blur(1px)' }}
                transition={{ duration: prefersReducedMotion ? 0.14 : 0.24, ease: [0.16, 1, 0.3, 1] }}
              >
                {activeReviews.map((review, index) => (
                <article className={`reviews-card reviews-card--${index + 1}`} key={`${review.author}-${review.date ?? review.publish_time ?? index}`}>
                  <Stars />
                  <p className="reviews-quote">“{reviewExcerpt(review.text)}”</p>
                  <div className="reviews-author">
                    <span className="reviews-avatar">{initials(review.author)}</span>
                    <div><p>{review.author}</p><small>{review.date ?? review.publish_time ?? 'Google review'}</small></div>
                  </div>
                </article>
                ))}
              </motion.div>
            </AnimatePresence>
          </div>
        </div>

        <div className="reviews-arrows flex justify-center pt-6 lg:hidden" aria-label="Review carousel controls">
          <button type="button" onClick={() => changePage(-1)} disabled={!canPaginate} aria-label="Show previous reviews"><FaArrowLeft /></button>
          <button type="button" onClick={() => changePage(1)} disabled={!canPaginate} aria-label="Show next reviews"><FaArrowRight /></button>
        </div>

        <div className="reviews-footer-mark reviews-footer-mark--left"><span>Est. local</span><i /></div>
        <div className="reviews-footer-mark reviews-footer-mark--right"><i /><span>Cars for<br />real life</span></div>
      </div>
    </section>
  )
}
