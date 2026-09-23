import type { GoogleReview } from '../api/reviews'

// Public five-star reviews selected from Rick's Used Cars' Google Maps listing.
// Kept as short excerpts for the homepage until the Google Places API is configured.
export const reviews: GoogleReview[] = [
  { author: 'Frank Perk', rating: 5, date: '9 months ago', text: 'Rick is the best. Always happy to help, great cars.' },
  { author: 'John Kluck', rating: 5, date: '9 months ago', text: 'The process could not be easier. Twenty minutes later, the registration is complete.' },
  { author: 'Dave Carey', rating: 5, date: '1 year ago', text: 'Very professional easy transaction. Thanks Rick.' },
  { author: 'Errol Hayden', rating: 5, date: '1 year ago', text: 'Great guy, quick, easy, knowledgeable, and great prices.' },
  { author: 'Val Andrews', rating: 5, date: '1 year ago', text: 'Always so very helpful! Best place for title and tag service.' },
  { author: 'Joshua Miller', rating: 5, date: '2 years ago', text: 'Always has a smile on his face and always makes you feel welcome!' },
]
