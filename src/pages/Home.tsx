import { useEffect, useRef, useState } from 'react'
import HeroCarousel, { type Slide } from '../components/HeroCarousel'
import HeroColeção from '../assets/hero.png'
import EssenzaHero from '../assets/essenza-hero.jpeg'
import EssenzaHero2 from '../assets/essenza-hero2.jpeg'
import EssenzaHero3 from '../assets/essenza-hero3.jpeg'
import ProductCard from '../components/ProductCard'
import { useSEO } from '../utils/useSEO'

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
      imageSrc: HeroColeção,
      imageAlt: 'Jardim da minha Mãe',
      title: 'JARDIM DA MINHA MÃE',
      subtitle:
        'Coleção especial de Dia das Mães: sensorial, afetiva e feita para cuidar',
      ctaLabel: 'VER COLEÇÃO ESPECIAL',
      ctaAction: '#colecao-dia-das-maes',
      align: 'center',
      ctaClassName: 'bg-[#9b7bb5]',
    },
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

      <section id="colecao-dia-das-maes" className="bg-[#fdf6fb] px-6 py-10">
        <div className="mx-auto max-w-6xl">
          <div className="mb-8 text-center">
            <p className="mb-2 text-sm font-medium tracking-widest text-[#9b7bb5] uppercase">
              Coleção Especial
            </p>
            <h2 className="text-4xl text-[#7a5a9a] font-stretch-extra-expanded">
              JARDIM DA MINHA MÃE 🌸
            </h2>
            <p className="mt-2 text-sm text-gray-500">
              Para quem faz tudo florescer
            </p>
          </div>

          {loadingKits && <p className="text-gray-600">Carregando...</p>}

          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
            {kits.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
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
