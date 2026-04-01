import { useEffect, useRef, useState } from 'react'
import HeroCarousel, { type Slide } from '../components/HeroCarousel'
import EssenzaHero from '../assets/essenza-hero.jpeg'
import EssenzaHero2 from '../assets/essenza-hero2.jpeg'
import EssenzaHero3 from '../assets/essenza-hero3.jpeg'
import ProductCard from '../components/ProductCard'

/* eslint-disable @typescript-eslint/no-explicit-any */
type Product = {
  id: string
  name: string
  slug: string
  price_in_cents: number
  stock: number
  images?: { id: string; url: string; alt?: string }[]
  variants?: any[]
}

export default function Home() {
  const sectionRef = useRef<HTMLDivElement>(null)
  const [items, setItems] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch(
      `${import.meta.env.VITE_API_URL}/products?page=1&per_page=8&sort=price_in_cents&order=desc`,
    )
      .then((r) => r.json())
      .then((json) => setItems(json.data ?? []))
      .finally(() => setLoading(false))
  }, [])

  const slides: Slide[] = [
    {
      imageSrc: EssenzaHero,
      imageAlt: 'Velas Aromáticas',
      title: 'VELAS AROMÁTICAS',
      subtitle: 'Transforme qualquer ambiente',
      ctaLabel: 'DESCUBRA',
      ctaAction: '/categoria/velas?tipo=aromaticas',
      align: 'right',
      ctaClassName: 'bg-[#c9a227]',
    },
    {
      imageSrc: EssenzaHero2,
      imageAlt: 'Sabonetes artesanais',
      title: 'SABONETES ARTESANAIS GLICERINADOS',
      titleStack: true,
      subtitle: 'Cada banho uma nova experiência',
      ctaLabel: 'QUERO',
      ctaAction: '/categoria/corpo',
      align: 'left',
    },
    {
      imageSrc: EssenzaHero3,
      imageAlt: 'Velas de massagem',
      title: 'VELAS DE MASSAGEM',
      subtitle: 'Permita-se esse prazer',
      ctaLabel: 'CONFIRA',
      ctaAction: '/categoria/velas?tipo=massagem',
      align: 'left',
      ctaClassName: 'bg-[#8b5c2a]',
    },
  ]

  return (
    <main>
      <HeroCarousel slides={slides} autoPlayInterval={5000} />

      <section ref={sectionRef} id="colecao-natal" className="px-6 py-10">
        <div className="mx-auto max-w-6xl">
          <h2 className="mb-8 text-center text-4xl text-[#00843d] font-stretch-extra-expanded">
            DESTAQUES DA TEMPORADA
          </h2>

          {loading && <p className="text-gray-600">Carregando...</p>}

          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
            {items.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        </div>
      </section>
    </main>
  )
}
