import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { IoBagOutline } from 'react-icons/io5'
import { useCart } from '../context/CartContext'
import {
  CANDLE_CARE,
  MASSAGE_CANDLE_INFO,
  shouldShowCandleCare,
  shouldShowMassageCandleInfo,
} from '../utils/productInfo'

type ProductImage = { id: string; url: string; alt?: string }
type Variant = {
  id: string
  label: string
  aroma?: string
  color?: string
  stock: number
  active: boolean
}

type Product = {
  id: string
  name: string
  slug: string
  price_in_cents: number
  description: string
  category: string
  stock: number
  images: ProductImage[]
  variants: Variant[]
}

function altMatchesVariant(alt: string, label: string): boolean {
  const altLower = alt.toLowerCase()
  return label
    .toLowerCase()
    .split(' / ')
    .some((part) => altLower.includes(part.trim()))
}

export default function Product() {
  const { slug } = useParams<{ slug: string }>()
  const [product, setProduct] = useState<Product | null>(null)
  const [loading, setLoading] = useState(true)
  const [selectedVariantId, setSelectedVariantId] = useState<string | null>(
    null,
  )
  const [quantity, setQuantity] = useState(1)
  const [selectedImageIndex, setSelectedImageIndex] = useState(0)
  const [manualImageSelect, setManualImageSelect] = useState(false)
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
        const sortedData = {
          ...data,
          variants: [...(data.variants ?? [])].sort((a: Variant, b: Variant) =>
            a.label.localeCompare(b.label, 'pt-BR'),
          ),
        }
        setProduct(sortedData)
        const firstImage = data.images?.[0]
        const matchingVariant = data.variants?.find((v: Variant) =>
          firstImage?.alt ? altMatchesVariant(firstImage.alt, v.label) : false,
        )
        if (matchingVariant) {
          setSelectedVariantId(matchingVariant.id)
        } else if (data.variants?.[0]?.id) {
          setSelectedVariantId(data.variants[0].id)
        }
      })
      .catch(() => setProduct(null))
      .finally(() => setLoading(false))
  }, [slug])

  const handleAddToCart = () => {
    if (!product) return

    const selectedVariant = product.variants.find(
      (v) => v.id === selectedVariantId,
    )

    addItem(
      {
        productId: product.id,
        variantId: selectedVariantId,
        variantLabel: selectedVariant?.label || null,
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

  const selectedVariant = product.variants.find(
    (v) => v.id === selectedVariantId,
  )
  const availableStock = selectedVariant ? selectedVariant.stock : product.stock
  const isOutOfStock = availableStock <= 0

  const activeImageIndex =
    !manualImageSelect && selectedVariant?.label
      ? product.images.findIndex((img) =>
          img.alt ? altMatchesVariant(img.alt, selectedVariant.label) : false,
        )
      : selectedImageIndex

  const displayIndex =
    activeImageIndex >= 0 ? activeImageIndex : selectedImageIndex

  return (
    <main className="px-6 pt-20 pb-12">
      <div className="mx-auto max-w-6xl pt-10">
        <div className="grid grid-cols-1 gap-10 lg:grid-cols-2">
          <div className="flex gap-4">
            {product.images.length > 1 && (
              <div className="flex flex-col gap-3">
                {product.images.map((img, index) => (
                  <button
                    key={img.id}
                    onClick={() => {
                      setSelectedImageIndex(index)
                      setManualImageSelect(true)
                      const matchingVariant = product.variants.find((v) =>
                        img.alt ? altMatchesVariant(img.alt, v.label) : false,
                      )
                      if (matchingVariant) {
                        setSelectedVariantId(matchingVariant.id)
                      }
                    }}
                    className={`h-20 w-20 cursor-pointer overflow-hidden rounded-lg border-2 transition ${
                      displayIndex === index
                        ? 'border-[#00843d]'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <img
                      src={img.url}
                      alt={img.alt ?? `${product.name} - Imagem ${index + 1}`}
                      className="h-full w-full object-cover"
                    />
                  </button>
                ))}
              </div>
            )}

            <div className="flex flex-1 items-start justify-center">
              {product.images[displayIndex] ? (
                <img
                  src={product.images[displayIndex].url}
                  alt={product.images[displayIndex].alt ?? product.name}
                  className="h-auto max-h-[600px] w-auto max-w-full rounded-lg object-cover shadow-sm"
                />
              ) : (
                <div className="flex h-96 w-full items-center justify-center rounded-lg bg-gray-100">
                  Sem imagem
                </div>
              )}
            </div>
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

            <div className="space-y-2">
              <h3 className="text-lg font-semibold text-gray-800">
                Descrição:
              </h3>
              <p className="text-base leading-relaxed text-gray-700">
                {product.description}
              </p>
            </div>

            {shouldShowCandleCare(product.category, product.name) && (
              <div className="rounded-lg border border-[#00843d]/20 bg-[#00843d]/5 p-4">
                <h3 className="mb-3 text-sm font-semibold text-[#00843d]">
                  {CANDLE_CARE.title}
                </h3>
                <ul className="space-y-2">
                  {CANDLE_CARE.tips.map((tip, i) => (
                    <li key={i} className="flex gap-2 text-sm text-gray-600">
                      <span className="mt-0.5 text-[#00843d]">•</span>
                      <span>{tip}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {shouldShowMassageCandleInfo(product.category, product.name) && (
              <div className="rounded-lg border border-[#c9a227]/20 bg-[#c9a227]/5 p-4">
                <h3 className="mb-3 text-sm font-semibold text-[#c9a227]">
                  {MASSAGE_CANDLE_INFO.title}
                </h3>
                <ul className="space-y-2">
                  {MASSAGE_CANDLE_INFO.tips.map((tip, i) => (
                    <li key={i} className="flex gap-2 text-sm text-gray-600">
                      <span className="mt-0.5 text-[#c9a227]">•</span>
                      <span>{tip}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {product.variants.length > 0 && (
              <div className="space-y-3">
                <h3 className="text-sm font-semibold tracking-wide text-gray-800 uppercase">
                  Escolha o aroma/cor
                </h3>
                <div className="flex flex-wrap gap-2">
                  {product.variants.map((v) => {
                    const variantOutOfStock = v.stock <= 0
                    return (
                      <button
                        key={v.id}
                        type="button"
                        onClick={() => {
                          setSelectedVariantId(v.id)
                          setManualImageSelect(false)
                          const imgIndex = product.images.findIndex((img) =>
                            img.alt
                              ? altMatchesVariant(img.alt, v.label)
                              : false,
                          )
                          if (imgIndex >= 0) setSelectedImageIndex(imgIndex)
                        }}
                        disabled={variantOutOfStock}
                        className={`cursor-pointer rounded-full border px-4 py-2 text-sm font-medium transition-all ${
                          selectedVariantId === v.id
                            ? 'border-[#00843d] bg-[#00843d] text-white shadow-md'
                            : variantOutOfStock
                              ? 'cursor-not-allowed border-gray-200 bg-gray-100 text-gray-400'
                              : 'border-gray-300 bg-white text-gray-800 hover:border-gray-400 hover:shadow-sm'
                        }`}
                      >
                        {v.label} {variantOutOfStock && '(Esgotado)'}
                      </button>
                    )
                  })}
                </div>
                <a
                  href="/aromas"
                  className="text-xs text-[#00843d] underline underline-offset-2 hover:opacity-80"
                >
                  Conheça mais sobre os aromas →
                </a>
              </div>
            )}

            {!isOutOfStock && (
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
                    −
                  </button>
                  <span className="px-4 py-1 text-base font-medium text-gray-900">
                    {quantity}
                  </span>
                  <button
                    type="button"
                    onClick={() =>
                      setQuantity((q) => Math.min(availableStock, q + 1))
                    }
                    disabled={quantity >= availableStock}
                    className="cursor-pointer px-3 py-1 text-lg font-semibold text-gray-700 hover:bg-gray-100 disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    +
                  </button>
                </div>
              </div>
            )}

            <button
              type="button"
              className={`mt-2 inline-flex w-full items-center justify-center gap-2 rounded border px-6 py-3 text-sm font-semibold tracking-wide uppercase transition ${
                isOutOfStock
                  ? 'cursor-not-allowed border-gray-300 bg-gray-200 text-gray-500'
                  : 'cursor-pointer border-[#00843d] bg-white text-[#00843d] hover:bg-[#00843d] hover:text-white'
              }`}
              onClick={handleAddToCart}
              disabled={isOutOfStock}
            >
              <IoBagOutline className="h-5 w-5" />
              {isOutOfStock ? 'Esgotado' : 'Adicionar à sacola'}
            </button>
          </div>
        </div>
      </div>
    </main>
  )
}
