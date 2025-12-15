import { useEffect, useRef, useState } from 'react'
import Hero from '../components/Hero'
import HeroNatal from '../assets/hero-natal.jpg'
import ProductCard from '../components/ProductCard'
import { useCart } from '../context/CartContext'

type Product = {
  id: string
  name: string
  slug: string
  price_in_cents: number
  images?: { id: string; url: string; alt?: string }[]
}

export default function Home() {
  const sectionRef = useRef<HTMLDivElement>(null)
  const [items, setItems] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const { addItem } = useCart()

  useEffect(() => {
    fetch(
      `${import.meta.env.VITE_API_URL}/products?page=1&per_page=8&sort=createdAt&order=desc`,
    )
      .then((r) => r.json())
      .then((json) => setItems(json.data ?? []))
      .finally(() => setLoading(false))
  }, [])

  const scrollToCollection = () => {
    sectionRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }

  const handleAddToCart = (product: Product) => {
    addItem({
      productId: product.id,
      variantId: null,
      name: product.name,
      price_in_cents: product.price_in_cents,
      image: product.images?.[0]?.url,
      slug: product.slug,
    })
  }

  return (
    <main>
      <Hero
        imageSrc={HeroNatal}
        imageAlt="Coleção de Natal Essenza"
        title="GOLD COLLECTION"
        subtitle="Para um natal cheio de magia e encanto."
        ctaLabel="CONHEÇA A COLEÇÃO"
        onHeroClick={scrollToCollection}
        aspectMobile="aspect-[16/9]"
        aspectDesktop="aspect-[21/9]"
        overlayClassName="bg-black/30"
        centered
      />

      <section ref={sectionRef} id="colecao-natal" className="px-6 py-10">
        <div className="mx-auto max-w-6xl">
          <h2 className="mb-8 text-center text-4xl text-[#00843d] font-stretch-extra-expanded">
            DESTAQUES DA TEMPORADA
          </h2>

          {loading && <p className="text-gray-600">Carregando...</p>}

          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
            {items.map((p) => (
              <ProductCard
                key={p.id}
                product={p}
                onAddToCart={handleAddToCart}
              />
            ))}
          </div>
        </div>
      </section>
    </main>
  )
}
