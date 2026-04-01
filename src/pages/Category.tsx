/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useState } from 'react'
import { useParams, useSearchParams } from 'react-router-dom'
import ProductCard from '../components/ProductCard'

type Product = {
  id: string
  name: string
  slug: string
  price_in_cents: number
  stock: number
  images?: { id: string; url: string; alt?: string }[]
  variants?: any[]
}

const CATEGORY_MAP: Record<string, string> = {
  velas: 'VELAS',
  corpo: 'CORPO_BANHO',
  decoracao: 'DECORACAO',
  aromatizadores: 'AROMATIZADORES',
}

const CATEGORY_TITLES: Record<string, string> = {
  velas: 'Velas',
  corpo: 'Corpo & Banho',
  decoracao: 'Decoração',
  aromatizadores: 'Aromatizadores',
}

const TIPO_TITLES: Record<string, string> = {
  aromaticas: 'Velas Aromáticas',
  massagem: 'Velas de Massagem',
}

export default function CategoryPage() {
  const { slug } = useParams<{ slug: string }>()
  const [searchParams] = useSearchParams()
  const tipo = searchParams.get('tipo')

  const [items, setItems] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)

  const categoryEnum = slug ? CATEGORY_MAP[slug] : undefined

  const title = tipo
    ? (TIPO_TITLES[tipo] ?? CATEGORY_TITLES[slug ?? ''] ?? 'Coleção')
    : (CATEGORY_TITLES[slug ?? ''] ?? 'Coleção')

  useEffect(() => {
    if (!categoryEnum) return
    setLoading(true)

    const params = new URLSearchParams({
      category: categoryEnum,
      page: '1',
      per_page: '100',
      sort: 'name',
      order: 'asc',
    })

    if (tipo === 'massagem') {
      params.set('search', 'massagem')
    }

    fetch(`${import.meta.env.VITE_API_URL}/products?${params.toString()}`)
      .then(async (r) => {
        if (!r.ok) return { data: [] }
        return r.json()
      })
      .then((json) => {
        let data: Product[] = json.data ?? []

        if (tipo === 'aromaticas') {
          data = data.filter((p) => !p.name.toLowerCase().includes('massagem'))
        }

        setItems(data)
      })
      .finally(() => setLoading(false))
  }, [categoryEnum, tipo])

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

        {tipo && (
          <div className="mb-6 flex items-center gap-2">
            <span className="rounded-full bg-[#00843d]/10 px-3 py-1 text-sm text-[#00843d]">
              {TIPO_TITLES[tipo] ?? tipo}
            </span>
            <a
              href={`/categoria/${slug}`}
              className="text-sm text-gray-400 underline hover:text-gray-600"
            >
              Ver todas as velas
            </a>
          </div>
        )}

        {loading && <p className="text-gray-600">Carregando...</p>}

        {!loading && items.length === 0 && (
          <p className="text-gray-500">Nenhum produto encontrado.</p>
        )}

        <div className="grid grid-cols-2 gap-6 sm:grid-cols-3 lg:grid-cols-4">
          {items.map((p) => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>
      </div>
    </main>
  )
}
