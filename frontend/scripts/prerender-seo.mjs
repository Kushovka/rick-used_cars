import { mkdir, readFile, writeFile } from 'node:fs/promises'
import path from 'node:path'
import { loadEnv } from 'vite'

const siteUrl = 'https://ricksusedscars.com'
const outputRoot = path.resolve('dist')
const baseHtml = await readFile(path.join(outputRoot, 'index.html'), 'utf8')
const env = loadEnv('production', process.cwd(), 'VITE_')
const pages = [
  { path: '/inventory', title: 'Used Car Inventory', description: "Browse used cars, SUVs, trucks, and crossovers at Rick's Used Cars in Dallas, PA." },
  { path: '/delivery', title: 'Nationwide Vehicle Delivery', description: "Coordinate nationwide vehicle delivery from Rick's Used Cars in Dallas, Pennsylvania." },
  { path: '/warranty', title: 'Warranty and Returns', description: "Review warranty and return policy details for used vehicles at Rick's Used Cars." },
  { path: '/about', title: "About Rick's Used Cars", description: "Learn about Rick's Used Cars, a local used car dealership serving Dallas-area drivers with straightforward support." },
  { path: '/team', title: 'Our Team', description: "Meet the friendly team at Rick's Used Cars in Dallas, PA." },
  { path: '/contact', title: 'Contact', description: "Call, visit, or send a message to Rick's Used Cars in Dallas, PA." },
  { path: '/privacy-policy', title: 'Privacy Policy', description: "Read the Rick's Used Cars privacy policy for website leads, cookies, analytics, and dealership communication." },
  { path: '/terms', title: 'Terms', description: "Review Rick's Used Cars website terms for inventory, pricing, warranty, and website use." },
]

const escapeHtml = (value) => String(value).replaceAll('&', '&amp;').replaceAll('<', '&lt;').replaceAll('>', '&gt;').replaceAll('"', '&quot;').replaceAll("'", '&#39;')
const upsertMeta = (html, key, value, kind = 'name') => {
  const escapedKey = key.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
  const pattern = new RegExp(`<meta\\s+[^>]*${kind}=["']${escapedKey}["'][^>]*>`, 'i')
  const tag = `<meta ${kind}="${escapeHtml(key)}" content="${escapeHtml(value)}" />`
  return pattern.test(html) ? html.replace(pattern, tag) : html.replace('</head>', `  ${tag}\n  </head>`)
}
const upsertCanonical = (html, url) => {
  const tag = `<link rel="canonical" href="${escapeHtml(url)}" />`
  const pattern = /<link\s+[^>]*rel=["']canonical["'][^>]*>/i
  return pattern.test(html) ? html.replace(pattern, tag) : html.replace('</head>', `  ${tag}\n  </head>`)
}
const setPageHead = (html, { path: pagePath, title, description, image = '/images/ricks-used-cars-hero.webp', schema, type = 'website' }) => {
  const fullTitle = title.includes("Rick's Used Cars") ? title : `${title} | Rick's Used Cars`
  const normalizedPath = pagePath === '/' ? '/' : `/${pagePath.split('/').filter(Boolean).join('/')}/`
  const canonical = `${siteUrl}${normalizedPath}`
  const absoluteImage = image.startsWith('http') ? image : `${siteUrl}${image}`
  let result = html.replace(/<title>.*?<\/title>/i, `<title>${escapeHtml(fullTitle)}</title>`)
  result = upsertMeta(result, 'description', description)
  result = upsertMeta(result, 'robots', 'index, follow')
  result = upsertMeta(result, 'og:type', type, 'property')
  result = upsertMeta(result, 'og:title', fullTitle, 'property')
  result = upsertMeta(result, 'og:description', description, 'property')
  result = upsertMeta(result, 'og:url', canonical, 'property')
  result = upsertMeta(result, 'og:image', absoluteImage, 'property')
  result = upsertMeta(result, 'twitter:card', 'summary_large_image')
  result = upsertMeta(result, 'twitter:title', fullTitle)
  result = upsertMeta(result, 'twitter:description', description)
  result = upsertMeta(result, 'twitter:image', absoluteImage)
  result = upsertCanonical(result, canonical)
  result = result.replace(/\s*<script id="dealership-schema-json"[\s\S]*?<\/script>/i, '')
  result = result.replace(/\s*<script id="page-schema-json"[\s\S]*?<\/script>/i, '')
  if (schema) {
    const json = JSON.stringify(schema).replaceAll('<', '\\u003c')
    result = result.replace('</head>', `  <script id="page-schema-json" type="application/ld+json">${json}</script>\n  </head>`)
  }
  return result
}

if (env.VITE_MAINTENANCE_MODE === 'true') {
  let maintenanceHtml = baseHtml.replace(/<title>.*?<\/title>/i, `<title>${escapeHtml("Rick's Used Cars | Website Update")}</title>`)
  maintenanceHtml = upsertMeta(maintenanceHtml, 'robots', 'noindex, nofollow')
  maintenanceHtml = upsertMeta(maintenanceHtml, 'description', "Rick's Used Cars is improving the website. Please check back soon.")
  maintenanceHtml = maintenanceHtml.replace(/\s*<script id="dealership-schema-json"[\s\S]*?<\/script>/i, '')
  await writeFile(path.join(outputRoot, 'index.html'), maintenanceHtml)
  console.log('SEO build: maintenance mode is enabled; generated a noindex entry page only.')
  process.exit(0)
}

for (const page of pages) {
  const html = setPageHead(baseHtml, page)
  const destination = path.join(outputRoot, page.path.slice(1), 'index.html')
  await mkdir(path.dirname(destination), { recursive: true })
  await writeFile(destination, html)
}

const configuredApi = (env.VITE_API_URL || 'http://127.0.0.1:8001').replace(/\/+$/, '')
const apiBase = configuredApi.startsWith('/') ? `${siteUrl}${configuredApi}` : configuredApi
let prerenderedVehicles = 0
try {
  const vehicles = []
  for (let page = 1; ; page += 1) {
    const response = await fetch(`${apiBase}/vehicles?page=${page}&page_size=50`, { signal: AbortSignal.timeout(4000) })
    if (!response.ok) throw new Error(`HTTP ${response.status}`)
    const inventory = await response.json()
    vehicles.push(...(inventory.items ?? []))
    if (vehicles.length >= inventory.total || !inventory.items?.length) break
  }
  for (const vehicle of vehicles) {
    if (!vehicle.slug || vehicle.status?.toLowerCase() === 'hidden') continue
    const title = `${vehicle.year} ${vehicle.make} ${vehicle.model}${vehicle.trim ? ` ${vehicle.trim}` : ''}`
    const description = vehicle.short_description || `${title} for sale at Rick's Used Cars in Dallas, PA.`
    const canonicalPath = `/inventory/${vehicle.slug}/`
    const canonical = `${siteUrl}${canonicalPath}`
    const image = vehicle.images?.[0] || '/images/ricks-used-cars-hero.webp'
    const schema = {
      '@context': 'https://schema.org',
      '@type': 'Vehicle',
      name: title,
      url: canonical,
      image: [image.startsWith('http') ? image : `${siteUrl}${image}`],
      description,
      brand: { '@type': 'Brand', name: vehicle.make },
      model: vehicle.model,
      vehicleModelDate: String(vehicle.year),
      mileageFromOdometer: { '@type': 'QuantitativeValue', value: vehicle.mileage, unitCode: 'SMI' },
      ...(vehicle.price > 0 ? {
        offers: {
          '@type': 'Offer',
          url: canonical,
          price: vehicle.price,
          priceCurrency: 'USD',
          availability: vehicle.status?.toLowerCase() === 'sold' ? 'https://schema.org/OutOfStock' : 'https://schema.org/InStock',
          seller: { '@id': `${siteUrl}/#dealership` },
        },
      } : {}),
    }
    const html = setPageHead(baseHtml, { path: canonicalPath, title, description, image, schema, type: 'product' })
    const destination = path.join(outputRoot, 'inventory', vehicle.slug, 'index.html')
    await mkdir(path.dirname(destination), { recursive: true })
    await writeFile(destination, html)
    prerenderedVehicles += 1
  }
} catch (error) {
  console.warn(`SEO build: inventory could not be pre-rendered (${error.message}); vehicle pages will use client-rendered metadata.`)
}

console.log(`SEO build: generated HTML metadata for ${pages.length} static routes and ${prerenderedVehicles} vehicle routes.`)
