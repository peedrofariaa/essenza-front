/* eslint-disable react-refresh/only-export-components */
import {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from 'react'

type CartItem = {
  productId: string
  variantId: string | null
  variantLabel?: string | null
  name: string
  price_in_cents: number
  quantity: number
  image?: string
  slug: string
}

type CartContextType = {
  items: CartItem[]
  addItem: (item: Omit<CartItem, 'quantity'>, quantity?: number) => void
  removeItem: (productId: string, variantId: string | null) => void
  updateQuantity: (
    productId: string,
    variantId: string | null,
    quantity: number,
  ) => void
  clearCart: () => void
  totalItems: number
  totalPrice: number
}

const CartContext = createContext<CartContextType | undefined>(undefined)

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>(() => {
    const stored = localStorage.getItem('essenza_cart')
    return stored ? JSON.parse(stored) : []
  })

  useEffect(() => {
    localStorage.setItem('essenza_cart', JSON.stringify(items))
  }, [items])

  const addItem = (item: Omit<CartItem, 'quantity'>, quantity = 1) => {
    setItems((prev) => {
      const existing = prev.find(
        (i) => i.productId === item.productId && i.variantId === item.variantId,
      )
      if (existing) {
        return prev.map((i) =>
          i.productId === item.productId && i.variantId === item.variantId
            ? { ...i, quantity: i.quantity + quantity }
            : i,
        )
      }
      return [...prev, { ...item, quantity }]
    })
  }

  const removeItem = (productId: string, variantId: string | null) => {
    setItems((prev) =>
      prev.filter(
        (i) => !(i.productId === productId && i.variantId === variantId),
      ),
    )
  }

  const updateQuantity = (
    productId: string,
    variantId: string | null,
    quantity: number,
  ) => {
    if (quantity <= 0) {
      removeItem(productId, variantId)
      return
    }
    setItems((prev) =>
      prev.map((i) =>
        i.productId === productId && i.variantId === variantId
          ? { ...i, quantity }
          : i,
      ),
    )
  }

  const clearCart = () => setItems([])

  const totalItems = items.reduce((sum, item) => sum + item.quantity, 0)
  const totalPrice = items.reduce(
    (sum, item) => sum + item.price_in_cents * item.quantity,
    0,
  )

  return (
    <CartContext.Provider
      value={{
        items,
        addItem,
        removeItem,
        updateQuantity,
        clearCart,
        totalItems,
        totalPrice,
      }}
    >
      {children}
    </CartContext.Provider>
  )
}

export function useCart() {
  const context = useContext(CartContext)
  if (!context) throw new Error('useCart must be used within CartProvider')
  return context
}
