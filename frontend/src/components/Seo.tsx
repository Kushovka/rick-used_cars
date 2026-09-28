import { useEffect } from 'react'
import { useLocation } from 'react-router'
import { business } from '../data/business'

type SeoProps = {
  title: string
  description: string
  schema?: Record<string, unknown>
}

export const Seo = ({ title, description, schema }: SeoProps) => {
  const location = useLocation()

  useEffect(() => {
    document.title = `${title} | ${business.name}`

    const setMeta = (selector: string, attribute: 'name' | 'property', key: string, content: string) => {
      let meta = document.querySelector<HTMLMetaElement>(selector)
      if (!meta) {
        meta = document.createElement('meta')
        meta.setAttribute(attribute, key)
        document.head.appendChild(meta)
      }
      meta.content = content
    }

    const canonicalUrl = new URL(location.pathname, `${business.website}/`).toString()
    let canonical = document.querySelector<HTMLLinkElement>('link[rel="canonical"]')
    if (!canonical) {
      canonical = document.createElement('link')
      canonical.rel = 'canonical'
      document.head.appendChild(canonical)
    }
    canonical.href = canonicalUrl

    setMeta('meta[name="description"]', 'name', 'description', description)
    setMeta('meta[property="og:title"]', 'property', 'og:title', document.title)
    setMeta('meta[property="og:description"]', 'property', 'og:description', description)
    setMeta('meta[property="og:url"]', 'property', 'og:url', canonicalUrl)
    setMeta('meta[name="twitter:title"]', 'name', 'twitter:title', document.title)
    setMeta('meta[name="twitter:description"]', 'name', 'twitter:description', description)

    const existing = document.querySelector('#schema-json')
    existing?.remove()

    if (schema) {
      const script = document.createElement('script')
      script.id = 'schema-json'
      script.type = 'application/ld+json'
      script.textContent = JSON.stringify(schema)
      document.head.appendChild(script)
    }
  }, [description, location.pathname, schema, title])

  return null
}
