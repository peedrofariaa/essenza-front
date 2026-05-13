import { useEffect, useRef, useState } from 'react'
import HeroCarousel, { type Slide } from '../components/HeroCarousel'
import EssenzaHero from '../assets/essenza-hero.jpeg'
import EssenzaHero2 from '../assets/essenza-hero2.jpeg'
import EssenzaHero3 from '../assets/essenza-hero3.jpeg'
import ProductCard from '../components/ProductCard'
import { useSEO } from '../utils/useSEO'
import { FiPackage } from 'react-icons/fi'

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
  const [kits, setKits] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [loadingKits, setLoadingKits] = useState(true)

  useEffect(() => {
    fetch(
      `${import.meta.env.VITE_API_URL}/products?page=1&per_page=8&sort=price_in_cents&order=desc`,
    )
      .then((r) => r.json())
      .then((json) => setItems(json.data ?? []))
      .finally(() => setLoading(false))
  }, [])

  useEffect(() => {
    fetch(
      `${import.meta.env.VITE_API_URL}/products?category=KITS&page=1&per_page=12&sort=price_in_cents&order=asc`,
    )
      .then((r) => r.json())
      .then((json) => setKits(json.data ?? []))
      .finally(() => setLoadingKits(false))
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
      title: 'VELA DE MASSAGEM',
      subtitle: 'Permita-se esse prazer',
      ctaLabel: 'CONFIRA',
      ctaAction: '/categoria/velas?tipo=massagem',
      align: 'left',
      ctaClassName: 'bg-[#8b5c2a]',
    },
  ]

  useSEO({
    title: 'Essenza: Velas, Aromatizadores e Produtos Artesanais',
    description:
      'Velas, aromatizadores, sabonetes e produtos artesanais feitos com alma. Compre online e receba em todo o Brasil.',
  })

  return (
    <main>
      <HeroCarousel slides={slides} autoPlayInterval={5000} />

      <section id="kits-presentes" className="bg-[#faf7f2] px-6 py-10">
        <div className="mx-auto max-w-6xl">
          {/* Cabeçalho */}
          <div className="mb-8 text-center">
            <div className="mb-3 flex items-center justify-center gap-2 text-[#8b5c2a]">
              <FiPackage size={18} />
              <p className="text-sm font-medium tracking-widest uppercase">
                Kits & Presentes
              </p>
              <FiPackage size={18} />
            </div>
            <h2 className="text-4xl text-[#5a3e1b] font-stretch-extra-expanded">
              ESCOLHA SEU KIT PERFEITO
            </h2>
            <p className="mx-auto mt-2 max-w-md text-sm text-gray-500">
              Combinações pensadas com cuidado para presentear ou se mimar. Cada
              kit é uma experiência completa.
            </p>
          </div>

          {/* Esqueleto de loading */}
          {loadingKits && (
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-3">
              {Array.from({ length: 6 }).map((_, i) => (
                <div key={i} className="animate-pulse">
                  <div className="aspect-square w-full rounded-lg bg-gray-200" />
                  <div className="mt-3 h-4 w-3/4 rounded bg-gray-200" />
                  <div className="mt-2 h-4 w-1/2 rounded bg-gray-200" />
                </div>
              ))}
            </div>
          )}

          {/* Grid de produtos */}
          {!loadingKits && kits.length > 0 && (
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-3">
              {kits.map((p) => (
                <ProductCard key={p.id} product={p} />
              ))}
            </div>
          )}

          {/* Empty state */}
          {!loadingKits && kits.length === 0 && (
            <div className="flex flex-col items-center py-16 text-center text-gray-400">
              <FiPackage size={40} className="mb-4 opacity-40" />
              <p className="text-sm">Novos kits em breve. Fique de olho!</p>
            </div>
          )}

          {/* CTA ver todos os kits */}
          {!loadingKits && kits.length > 0 && (
            <div className="mt-8 text-center">
              <a
                href="/categoria/kits"
                className="inline-block rounded-md border border-[#8b5c2a] px-6 py-2.5 text-sm text-[#8b5c2a] transition hover:bg-[#8b5c2a] hover:text-white"
              >
                Ver todos os kits
              </a>
            </div>
          )}
        </div>
      </section>

      <section ref={sectionRef} id="destaques" className="px-6 py-10">
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
