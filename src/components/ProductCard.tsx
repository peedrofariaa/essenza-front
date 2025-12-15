import { Link } from 'react-router-dom'
import { IoBagOutline } from 'react-icons/io5'

type ProductImage = { id: string; url: string; alt?: string }

type Product = {
  id: string
  name: string
  slug: string
  price_in_cents: number
  images?: ProductImage[]
}

type Props = {
  product: Product
  onAddToCart?: (p: Product) => void
}

export default function ProductCard({ product, onAddToCart }: Props) {
  const image = product.images?.[0]

  const handleAdd = (e: React.MouseEvent) => {
    e.preventDefault()
    onAddToCart?.(product)
  }

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

        <button
          type="button"
          onClick={handleAdd}
          className="mt-3 inline-flex w-full cursor-pointer items-center justify-center gap-2 rounded border border-[#00843d] bg-white px-4 py-2 text-xs font-semibold tracking-wide text-[#00843d] uppercase hover:border-[#00843d] hover:bg-[#00843d] hover:text-white"
        >
          <span className="flex items-center justify-center gap-1 text-lg">
            <IoBagOutline className="h-5 w-5" />
            Adicionar
          </span>
        </button>
      </div>
    </Link>
  )
}
