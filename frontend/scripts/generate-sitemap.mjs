import { readdir, writeFile } from 'node:fs/promises'
import { dirname, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'

const frontendDir = resolve(dirname(fileURLToPath(import.meta.url)), '..')
const listingsDir = resolve(frontendDir, 'public/listing-descriptions')
const sitemapPath = resolve(frontendDir, 'public/sitemap.xml')
const baseUrl = 'https://ricksusedscars.com'
const staticPaths = [
  '/',
  '/inventory',
  '/delivery',
  '/warranty',
  '/about',
  '/team',
  '/contact',
  '/privacy-policy',
  '/terms',
]

const listingFiles = await readdir(listingsDir)
const vehiclePaths = listingFiles
  .filter((file) => file.endsWith('.txt'))
  .map((file) => `/inventory/${encodeURIComponent(file.slice(0, -4))}`)
  .sort()

const urls = [...staticPaths, ...vehiclePaths]
  .map((path) => `  <url><loc>${baseUrl}${path}</loc></url>`)
  .join('\n')

await writeFile(
  sitemapPath,
  `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls}\n</urlset>\n`,
)

console.log(`Generated sitemap with ${urls ? urls.split('\n').length : 0} URLs at ${sitemapPath}`)
