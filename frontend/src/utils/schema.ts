import { business } from '../data/business'

export const autoDealerSchema = {
  '@context': 'https://schema.org',
  '@type': 'AutoDealer',
  '@id': `${business.website}/#dealership`,
  name: business.name,
  telephone: business.phone,
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
  url: `${business.website}/`,
  hasMap: business.mapsUrl,
  openingHoursSpecification: [
    {
      '@type': 'OpeningHoursSpecification',
      dayOfWeek: [
        'https://schema.org/Monday',
        'https://schema.org/Tuesday',
        'https://schema.org/Wednesday',
        'https://schema.org/Thursday',
        'https://schema.org/Friday',
      ],
      opens: '09:00',
      closes: '17:00',
    },
  ],
}
