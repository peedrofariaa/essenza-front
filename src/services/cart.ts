import api from '../utils/api'

type CartItem = {
  productId: string
  variantId: string | null
  quantity: number
}

type ValidatedItem = {
  productId: string
  variantId: string | null
  variantLabel: string | null
  name: string
  slug: string
  price_in_cents: number
  quantity: number
  image: string | null
}

type ValidateResponse = {
  items: ValidatedItem[]
  subtotal: number
  totalItems: number
}

export async function validateCart(
  items: CartItem[],
): Promise<ValidateResponse> {
  const { data } = await api.post('/cart/validate', { items })
  return data
}
