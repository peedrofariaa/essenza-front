import { IoCloseOutline } from 'react-icons/io5'
import { useCart } from '../context/CartContext'
import { useAuth } from '../context/AuthContext'
import { Link, useNavigate } from 'react-router-dom'

type CartSidebarProps = {
  isOpen: boolean
  onClose: () => void
}

export default function CartSidebar({ isOpen, onClose }: CartSidebarProps) {
  const { items, updateQuantity, removeItem, totalItems, totalPrice } =
    useCart()
  const { user } = useAuth()
  const navigate = useNavigate()

  const handleCheckout = () => {
    if (!user) {
      onClose()
      navigate('/login', { state: { from: '/checkout' } })
      return
    }
    navigate('/checkout')
    onClose()
  }

  return (
    <>
      <div
        className={`fixed inset-0 z-40 bg-black/40 backdrop-blur-sm transition-opacity duration-300 ${
          isOpen ? 'opacity-100' : 'pointer-events-none opacity-0'
        }`}
        onClick={onClose}
      />

      <aside
        className={`fixed top-0 right-0 z-50 flex h-full w-full max-w-md flex-col bg-white shadow-xl transition-transform duration-300 ease-in-out ${
          isOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        <div className="flex items-center justify-between border-b p-4">
          <h2 className="text-lg font-bold text-gray-900">
            Sacola ({totalItems})
          </h2>
          <button
            type="button"
            onClick={onClose}
            className="cursor-pointer text-gray-600 hover:text-gray-900"
          >
            <IoCloseOutline className="h-6 w-6" />
          </button>
        </div>

        <div className="flex-1 space-y-4 overflow-y-auto p-4">
          {items.length === 0 ? (
            <p className="mt-8 text-center text-gray-500">
              Sua sacola está vazia
            </p>
          ) : (
            items.map((item) => (
              <div
                key={`${item.productId}-${item.variantId}`}
                className="flex gap-4 border-b pb-4"
              >
                {item.image && (
                  <img
                    src={item.image}
                    alt={item.name}
                    className="h-20 w-20 rounded object-cover"
                  />
                )}
                <div className="flex-1">
                  <Link
                    to={`/produto/${item.slug}`}
                    className="font-semibold text-gray-900 hover:text-[#00843d]"
                    onClick={onClose}
                  >
                    {item.name}
                  </Link>
                  {item.variantLabel && (
                    <p className="text-sm text-gray-600">{item.variantLabel}</p>
                  )}
                  <p className="text-sm text-gray-600">
                    {(item.price_in_cents / 100).toLocaleString('pt-BR', {
                      style: 'currency',
                      currency: 'BRL',
                    })}
                  </p>

                  <div className="mt-2 flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() =>
                        updateQuantity(
                          item.productId,
                          item.variantId,
                          item.quantity - 1,
                        )
                      }
                      className="cursor-pointer rounded border px-2 py-1 text-sm hover:bg-gray-100"
                    >
                      −
                    </button>
                    <span className="text-sm font-medium">{item.quantity}</span>
                    <button
                      type="button"
                      onClick={() =>
                        updateQuantity(
                          item.productId,
                          item.variantId,
                          item.quantity + 1,
                        )
                      }
                      className="cursor-pointer rounded border px-2 py-1 text-sm hover:bg-gray-100"
                    >
                      +
                    </button>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => removeItem(item.productId, item.variantId)}
                  className="cursor-pointer text-gray-400 hover:text-red-600"
                >
                  <IoCloseOutline className="h-5 w-5" />
                </button>
              </div>
            ))
          )}
        </div>

        {items.length > 0 && (
          <div className="space-y-3 border-t p-4">
            <div className="flex justify-between text-lg font-bold">
              <span>Subtotal:</span>
              <span>
                {(totalPrice / 100).toLocaleString('pt-BR', {
                  style: 'currency',
                  currency: 'BRL',
                })}
              </span>
            </div>
            <button
              type="button"
              onClick={handleCheckout}
              className="block w-full cursor-pointer rounded bg-[#00843d] py-3 text-center font-semibold text-white transition hover:bg-[#006d32]"
            >
              {user ? 'Finalizar Pedido' : 'Entrar para finalizar'}
            </button>
          </div>
        )}
      </aside>
    </>
  )
}
