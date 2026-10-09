import { business } from '../data/business'

export const autoDealerSchema = {
  '@context': 'https://schema.org',
  '@type': 'AutoDealer',
  name: business.name,
  address: {
    '@type': 'PostalAddress',
    streetAddress: business.address,
    addressLocality: 'Dallas',
    addressRegion: 'PA',
    postalCode: business.postalCode,
    addressCountry: 'US',
  },
  geo: {
    '@type': 'GeoCoordinates',
    latitude: business.latitude,
    longitude: business.longitude,
  },
  url: business.website || business.mapsUrl,
  openingHours: 'Mo-Fr 09:00-17:00',
}
