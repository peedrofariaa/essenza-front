import { useEffect } from 'react'

interface SEOProps {
  title: string
  description?: string
  canonical?: string
  noindex?: boolean
}

const BASE_URL = 'https://essenzame.com.br'

export function useSEO({
  title,
  description,
  canonical,
  noindex = false,
}: SEOProps) {
  useEffect(() => {
    document.title = title

    let metaDesc = document.querySelector('meta[name="description"]')
    if (description) {
      if (!metaDesc) {
        metaDesc = document.createElement('meta')
        metaDesc.setAttribute('name', 'description')
        document.head.appendChild(metaDesc)
      }
      metaDesc.setAttribute('content', description)
    } else {
      metaDesc?.remove()
    }

    let linkCanonical = document.querySelector('link[rel="canonical"]')
    if (!linkCanonical) {
      linkCanonical = document.createElement('link')
      linkCanonical.setAttribute('rel', 'canonical')
      document.head.appendChild(linkCanonical)
    }
    linkCanonical.setAttribute(
      'href',
      canonical ?? `${BASE_URL}${window.location.pathname}`,
    )

    let metaRobots = document.querySelector('meta[name="robots"]')
    if (!metaRobots) {
      metaRobots = document.createElement('meta')
      metaRobots.setAttribute('name', 'robots')
      document.head.appendChild(metaRobots)
    }
    metaRobots.setAttribute(
      'content',
      noindex ? 'noindex, nofollow' : 'index, follow',
    )

    setOG('og:title', title)
    if (description) setOG('og:description', description)
    setOG('og:url', canonical ?? `${BASE_URL}${window.location.pathname}`)
    setOG('og:site_name', 'Essenza')
  }, [title, description, canonical, noindex])
}

function setOG(property: string, content: string) {
  let tag = document.querySelector(`meta[property="${property}"]`)
  if (!tag) {
    tag = document.createElement('meta')
    tag.setAttribute('property', property)
    document.head.appendChild(tag)
  }
  tag.setAttribute('content', content)
}
