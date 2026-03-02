/* eslint-disable @typescript-eslint/no-explicit-any */
import { Link } from 'react-router-dom'

type ProductImage = { id: string; url: string; alt?: string }

type Product = {
  id: string
  name: string
  slug: string
  price_in_cents: number
  stock: number
  images?: ProductImage[]
  variants?: any[]
}

type Props = {
  product: Product
}

export default function ProductCard({ product }: Props) {
  const image = product.images?.[0]
  const hasVariants = (product.variants?.length ?? 0) > 0
  const isOutOfStock = product.stock <= 0 && !hasVariants

  return (
    <Link
      to={`/produto/${product.slug}`}
      className="group block rounded border border-gray-100 transition hover:shadow-lg"
    >
      <div className="aspect-[3/4] w-full overflow-hidden rounded-t">
        {image?.url ? (
          <img
            src={image.url}
            alt={image.alt ?? product.name}
            className="h-full w-full object-cover transition group-hover:scale-[1.05]"
          />
        ) : (
          <div className="flex h-full items-center justify-center text-gray-400">
            Sem imagem
          </div>
        )}
      </div>

      <div className="gap-1 p-4 text-center">
        <p className="text-base font-medium text-gray-950">{product.name}</p>
        <p className="mt-1 text-xl font-semibold">
          {(product.price_in_cents / 100).toLocaleString('pt-BR', {
            style: 'currency',
            currency: 'BRL',
          })}
        </p>

        {isOutOfStock ? (
          <div className="mt-3 inline-flex w-full items-center justify-center gap-2 rounded border border-gray-300 bg-gray-200 px-4 py-2 text-xs font-semibold tracking-wide text-gray-500 uppercase">
            <span className="flex items-center justify-center gap-1 text-lg">
              Esgotado
            </span>
          </div>
        ) : (
          <div className="mt-3 inline-flex w-full items-center justify-center gap-2 rounded border border-[#00843d] bg-white px-4 py-2 text-xs font-semibold tracking-wide text-[#00843d] uppercase transition hover:border-[#00843d] hover:bg-[#00843d] hover:text-white">
            <span className="flex items-center justify-center gap-1 text-lg">
              Ver produto
            </span>
          </div>
        )}
      </div>
    </Link>
  )
}
