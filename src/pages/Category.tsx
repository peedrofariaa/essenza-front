import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import ProductCard from '../components/ProductCard'

type Product = {
  id: string
  name: string
  slug: string
  price_in_cents: number
  images?: { id: string; url: string; alt?: string }[]
}

const CATEGORY_MAP: Record<string, string> = {
  velas: 'VELAS',
  corpo: 'CORPO',
  decoracao: 'DECORACAO',
  aromatizadores: 'AROMATIZADORES',
}

const CATEGORY_TITLES: Record<string, string> = {
  velas: 'Velas Aromáticas',
  corpo: 'Corpo & Banho',
  decoracao: 'Decoração',
  aromatizadores: 'Aromatizadores',
}

export default function CategoryPage() {
  const { slug } = useParams<{ slug: string }>()
  const [items, setItems] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)

  const categoryEnum = slug ? CATEGORY_MAP[slug] : undefined
  const title = slug ? (CATEGORY_TITLES[slug] ?? 'Coleção') : 'Coleção'

  useEffect(() => {
    if (!categoryEnum) return
    setLoading(true)
    fetch(
      `${import.meta.env.VITE_API_URL}/products?category=${categoryEnum}&page=1&per_page=12&sort=createdAt&order=desc`,
    )
      .then(async (r) => {
        if (!r.ok) return { data: [] }
        return r.json()
      })
      .then((json) => setItems(json.data ?? []))
      .finally(() => setLoading(false))
  }, [categoryEnum])

  if (!categoryEnum) {
    return (
      <p className="p-6 text-center text-gray-600">Categoria não encontrada.</p>
    )
  }

  return (
    <main className="px-6 pt-32 pb-10">
      <div className="mx-auto max-w-6xl">
        <h1 className="mb-6 text-5xl tracking-tight text-[#00843d] font-stretch-extra-expanded">
          {title}
        </h1>

        {loading && <p className="text-gray-600">Carregando...</p>}

        <div className="grid grid-cols-2 gap-6 sm:grid-cols-3 lg:grid-cols-4">
          {items.map((p) => (
            <ProductCard
              key={p.id}
              product={p}
              onAddToCart={(prod) => {
                // TODO carrinho
                console.log('Adicionar ao carrinho (categoria):', prod.slug)
              }}
            />
          ))}
        </div>
      </div>
    </main>
  )
}
