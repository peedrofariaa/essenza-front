import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { IoBagOutline } from 'react-icons/io5'
import { useCart } from '../context/CartContext'

type ProductImage = { id: string; url: string; alt?: string }
type Variant = { id: string; label: string; aroma?: string; color?: string }

type Product = {
  id: string
  name: string
  slug: string
  price_in_cents: number
  description: string
  images: ProductImage[]
  variants: Variant[]
}

export default function Product() {
  const { slug } = useParams<{ slug: string }>()
  const [product, setProduct] = useState<Product | null>(null)
  const [loading, setLoading] = useState(true)
  const [selectedVariantId, setSelectedVariantId] = useState<string | null>(
    null,
  )
  const [quantity, setQuantity] = useState(1)
  const { addItem } = useCart()

  useEffect(() => {
    if (!slug) return
    setLoading(true)
    fetch(`${import.meta.env.VITE_API_URL}/products/${slug}`)
      .then(async (r) => {
        if (!r.ok) throw new Error('Not found')
        return r.json()
      })
      .then((data) => {
        setProduct(data)
        if (data.variants?.[0]?.id) {
          setSelectedVariantId(data.variants[0].id)
        }
      })
      .catch(() => setProduct(null))
      .finally(() => setLoading(false))
  }, [slug])

  const handleAddToCart = () => {
    if (!product) return
    addItem(
      {
        productId: product.id,
        variantId: selectedVariantId,
        name: product.name,
        price_in_cents: product.price_in_cents,
        image: product.images[0]?.url,
        slug: product.slug,
      },
      quantity,
    )
    setQuantity(1)
  }

  if (loading) {
    return <p className="p-6 text-center text-gray-600">Carregando...</p>
  }

  if (!product) {
    return (
      <p className="p-6 text-center text-gray-600">Produto não encontrado.</p>
    )
  }

  const mainImage = product.images[0]

  return (
    <main className="px-6 pt-20 pb-12">
      <div className="mx-auto max-w-6xl pt-10">
        <div className="grid grid-cols-1 gap-10 lg:grid-cols-2">
          <div className="flex items-start justify-center">
            {mainImage ? (
              <img
                src={mainImage.url}
                alt={mainImage.alt ?? product.name}
                className="h-auto max-h-[480px] w-auto max-w-full rounded-lg object-cover shadow-sm"
              />
            ) : (
              <div className="flex h-64 w-full items-center justify-center rounded-lg bg-gray-100">
                Sem imagem
              </div>
            )}
          </div>

          <div className="flex flex-col gap-6">
            <div>
              <h1 className="text-3xl font-bold tracking-tight text-[#00843d]">
                {product.name}
              </h1>
              <p className="mt-3 text-3xl font-black text-gray-900">
                {(product.price_in_cents / 100).toLocaleString('pt-BR', {
                  style: 'currency',
                  currency: 'BRL',
                })}
              </p>
            </div>

            <div className="space-y-3">
              <h3 className="text-lg font-semibold text-gray-800">
                Descrição:
              </h3>
              <p className="text-base leading-relaxed text-gray-700">
                {product.description}
              </p>
            </div>

            {product.variants.length > 0 && (
              <div className="space-y-3">
                <h3 className="text-sm font-semibold tracking-wide text-gray-800 uppercase">
                  Escolha o aroma
                </h3>
                <div className="flex flex-wrap gap-2">
                  {product.variants.map((v) => (
                    <button
                      key={v.id}
                      type="button"
                      onClick={() => setSelectedVariantId(v.id)}
                      className={`cursor-pointer rounded-full border px-4 py-2 text-sm font-medium transition-all ${
                        selectedVariantId === v.id
                          ? 'border-[#00843d] bg-[#00843d] text-white shadow-md'
                          : 'border-gray-300 bg-white text-gray-800 hover:border-gray-400 hover:shadow-sm'
                      }`}
                    >
                      {v.label}
                    </button>
                  ))}
                </div>
              </div>
            )}

            <div className="flex items-center gap-4">
              <span className="text-sm font-semibold text-gray-800">
                Quantidade:
              </span>
              <div className="flex items-center gap-2 rounded border border-gray-300">
                <button
                  type="button"
                  onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                  className="cursor-pointer px-3 py-1 text-lg font-semibold text-gray-700 hover:bg-gray-100"
                >
                  -
                </button>
                <span className="px-4 py-1 text-base font-medium text-gray-900">
                  {quantity}
                </span>
                <button
                  type="button"
                  onClick={() => setQuantity((q) => q + 1)}
                  className="cursor-pointer px-3 py-1 text-lg font-semibold text-gray-700 hover:bg-gray-100"
                >
                  +
                </button>
              </div>
            </div>

            <button
              type="button"
              className="mt-2 inline-flex w-full cursor-pointer items-center justify-center gap-2 rounded border border-[#00843d] bg-white px-6 py-3 text-sm font-semibold tracking-wide text-[#00843d] uppercase hover:bg-[#00843d] hover:text-white"
              onClick={handleAddToCart}
            >
              <IoBagOutline className="h-5 w-5" />
              Adicionar à sacola
            </button>
          </div>
        </div>
      </div>
    </main>
  )
}
