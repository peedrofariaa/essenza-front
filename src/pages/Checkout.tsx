/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { useCart } from '../context/CartContext'
import api from '../utils/api'

type ShippingOption = {
  id: number
  name: string
  company: string
  price: number
  delivery_time: number
}

export default function Checkout() {
  const { user } = useAuth()
  const { items, totalPrice, clearCart } = useCart()
  const navigate = useNavigate()

  const [shippingForm, setShippingForm] = useState({
    firstName: '',
    lastName: '',
    phone: '',
    cep: '',
    address: '',
    number: '',
    complement: '',
    neighborhood: '',
    city: '',
    state: '',
  })

  const [shippingOptions, setShippingOptions] = useState<ShippingOption[]>([])
  const [selectedShipping, setSelectedShipping] =
    useState<ShippingOption | null>(null)
  const [loadingShipping, setLoadingShipping] = useState(false)
  const [paymentMethod, setPaymentMethod] = useState<
    'pix' | 'credit_card' | 'boleto' | null
  >(null)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (!user) {
      navigate('/login', { state: { from: '/checkout' } })
    }
    if (items.length === 0) {
      navigate('/')
    }
  }, [user, items, navigate])

  const handleShippingChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    let newValue = value

    if (name === 'cep') {
      newValue = value.replace(/\D/g, '').substring(0, 8)
    }
    if (name === 'phone') {
      newValue = value.replace(/\D/g, '').substring(0, 11)
    }

    setShippingForm({ ...shippingForm, [name]: newValue })
  }

  const calculateShipping = async () => {
    if (shippingForm.cep.length !== 8) {
      alert('CEP inválido')
      return
    }

    setLoadingShipping(true)
    try {
      const itemsData = items.map(() => ({
        quantity: 1,
        weight: 0.3,
        height: 10,
        width: 8,
        length: 8,
      }))

      const { data } = await api.post('/shipping/calculate', {
        cep_destino: shippingForm.cep,
        items: itemsData,
      })

      setShippingOptions(data.options)
      setSelectedShipping(data.options[0])
    } catch (error: any) {
      alert(error.response?.data?.error || 'Erro ao calcular frete')
      setShippingOptions([])
    } finally {
      setLoadingShipping(false)
    }
  }

  const handleFinishOrder = async () => {
    if (!selectedShipping) {
      alert('Selecione um método de entrega')
      return
    }
    if (!paymentMethod) {
      alert('Selecione uma forma de pagamento')
      return
    }

    setLoading(true)
    try {
      // TODO: Criar endpoint /orders/create que cria pedido e retorna link de pagamento do Mercado Pago
      const { data } = await api.post('/orders/create', {
        items: items.map((item) => ({
          productId: item.productId,
          variantId: item.variantId,
          name: item.name,
          quantity: item.quantity,
          price_in_cents: item.price_in_cents,
        })),
        subtotal_cents: totalPrice,
        shipping_cents: selectedShipping.price,
        total_cents: totalPrice + selectedShipping.price,
        paymentMethod,
        shippingAddress: shippingForm,
        shippingService: selectedShipping.name,
        shippingDays: selectedShipping.delivery_time,
      })

      // Redirecionar para página de pagamento do Mercado Pago
      window.location.href = data.paymentUrl
      clearCart()
    } catch (error: any) {
      alert(error.response?.data?.error || 'Erro ao finalizar pedido')
    } finally {
      setLoading(false)
    }
  }

  if (!user || items.length === 0) return null

  const totalWithShipping = totalPrice + (selectedShipping?.price || 0)

  return (
    <main className="min-h-screen bg-[#f6f3f8] px-6 pt-32 pb-12">
      <div className="mx-auto max-w-7xl">
        <h1 className="mb-8 text-3xl font-bold text-[#00843d]">
          Finalizar Pedido
        </h1>

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
          {/* Coluna Esquerda - Formulários */}
          <div className="space-y-6 lg:col-span-2">
            {/* 1. Dados Pessoais */}
            <div className="rounded-lg bg-white p-6 shadow">
              <h2 className="mb-4 text-xl font-semibold text-gray-800">
                1. Dados Pessoais
              </h2>
              <div className="grid grid-cols-2 gap-4 text-sm text-gray-700">
                <div>
                  <span className="font-medium">Nome:</span> {user.name}
                </div>
                <div>
                  <span className="font-medium">Email:</span> {user.email}
                </div>
                <div>
                  <span className="font-medium">CPF:</span> {user.cpf}
                </div>
                <div>
                  <span className="font-medium">Data de Nasc:</span>{' '}
                  {new Date(user.birth).toLocaleDateString('pt-BR')}
                </div>
              </div>
            </div>

            {/* 2. Dados de Entrega */}
            <div className="rounded-lg bg-white p-6 shadow">
              <h2 className="mb-4 text-xl font-semibold text-gray-800">
                2. Dados de Entrega
              </h2>
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <input
                  type="text"
                  name="firstName"
                  placeholder="Nome*"
                  value={shippingForm.firstName}
                  onChange={handleShippingChange}
                  className="rounded border px-3 py-2 outline-none focus:border-[#00843d]"
                />
                <input
                  type="text"
                  name="lastName"
                  placeholder="Sobrenome*"
                  value={shippingForm.lastName}
                  onChange={handleShippingChange}
                  className="rounded border px-3 py-2 outline-none focus:border-[#00843d]"
                />
                <input
                  type="text"
                  name="phone"
                  placeholder="Telefone* (11999999999)"
                  value={shippingForm.phone}
                  onChange={handleShippingChange}
                  className="rounded border px-3 py-2 outline-none focus:border-[#00843d]"
                />
                <div className="flex gap-2">
                  <input
                    type="text"
                    name="cep"
                    placeholder="CEP*"
                    value={shippingForm.cep}
                    onChange={handleShippingChange}
                    className="flex-1 rounded border px-3 py-2 outline-none focus:border-[#00843d]"
                  />
                  <button
                    type="button"
                    onClick={calculateShipping}
                    disabled={loadingShipping}
                    className="disabled:opacity- cursor-pointer rounded bg-[#00843d] px-4 py-2 text-white hover:bg-[#006d32]"
                  >
                    {loadingShipping ? 'Calculando...' : 'Calcular'}
                  </button>
                </div>
                <input
                  type="text"
                  name="address"
                  placeholder="Endereço*"
                  value={shippingForm.address}
                  onChange={handleShippingChange}
                  className="rounded border px-3 py-2 outline-none focus:border-[#00843d] md:col-span-2"
                />
                <input
                  type="text"
                  name="number"
                  placeholder="Número*"
                  value={shippingForm.number}
                  onChange={handleShippingChange}
                  className="rounded border px-3 py-2 outline-none focus:border-[#00843d]"
                />
                <input
                  type="text"
                  name="complement"
                  placeholder="Complemento"
                  value={shippingForm.complement}
                  onChange={handleShippingChange}
                  className="rounded border px-3 py-2 outline-none focus:border-[#00843d]"
                />
                <input
                  type="text"
                  name="neighborhood"
                  placeholder="Bairro*"
                  value={shippingForm.neighborhood}
                  onChange={handleShippingChange}
                  className="rounded border px-3 py-2 outline-none focus:border-[#00843d]"
                />
                <input
                  type="text"
                  name="city"
                  placeholder="Cidade*"
                  value={shippingForm.city}
                  onChange={handleShippingChange}
                  className="rounded border px-3 py-2 outline-none focus:border-[#00843d]"
                />
                <input
                  type="text"
                  name="state"
                  placeholder="Estado* (SP)"
                  value={shippingForm.state}
                  onChange={handleShippingChange}
                  maxLength={2}
                  className="rounded border px-3 py-2 outline-none focus:border-[#00843d]"
                />
              </div>
            </div>

            {/* Método de Entrega */}
            {shippingOptions.length > 0 && (
              <div className="rounded-lg bg-white p-6 shadow">
                <h3 className="mb-3 text-lg font-semibold text-gray-800">
                  Método de Entrega
                </h3>
                <div className="space-y-2">
                  {shippingOptions.map((option) => (
                    <label
                      key={option.id}
                      className="flex cursor-pointer items-center justify-between rounded border p-3 hover:bg-gray-50"
                    >
                      <div className="flex items-center gap-3">
                        <input
                          type="radio"
                          name="shipping"
                          checked={selectedShipping?.id === option.id}
                          onChange={() => setSelectedShipping(option)}
                        />
                        <div>
                          <p className="font-medium">
                            {option.name} - {option.company}
                          </p>
                          <p className="text-sm text-gray-600">
                            Entrega em até {option.delivery_time} dias úteis
                          </p>
                        </div>
                      </div>
                      <span className="font-semibold">
                        {(option.price / 100).toLocaleString('pt-BR', {
                          style: 'currency',
                          currency: 'BRL',
                        })}
                      </span>
                    </label>
                  ))}
                </div>
              </div>
            )}

            {/* 3. Forma de Pagamento */}
            {selectedShipping && (
              <div className="rounded-lg bg-white p-6 shadow">
                <h2 className="mb-4 text-xl font-semibold text-gray-800">
                  3. Forma de Pagamento
                </h2>
                <div className="space-y-2">
                  <label className="flex cursor-pointer items-center gap-3 rounded border p-3 hover:bg-gray-50">
                    <input
                      type="radio"
                      name="payment"
                      checked={paymentMethod === 'pix'}
                      onChange={() => setPaymentMethod('pix')}
                    />
                    <span>PIX</span>
                  </label>
                  <label className="flex cursor-pointer items-center gap-3 rounded border p-3 hover:bg-gray-50">
                    <input
                      type="radio"
                      name="payment"
                      checked={paymentMethod === 'credit_card'}
                      onChange={() => setPaymentMethod('credit_card')}
                    />
                    <span>Cartão de Crédito</span>
                  </label>
                  <label className="flex cursor-pointer items-center gap-3 rounded border p-3 hover:bg-gray-50">
                    <input
                      type="radio"
                      name="payment"
                      checked={paymentMethod === 'boleto'}
                      onChange={() => setPaymentMethod('boleto')}
                    />
                    <span>Boleto</span>
                  </label>
                </div>
              </div>
            )}
          </div>

          {/* Coluna Direita - Resumo do Pedido */}
          <div className="lg:col-span-1">
            <div className="sticky top-28 rounded-lg bg-white p-6 shadow">
              <h2 className="mb-4 text-xl font-semibold text-gray-800">
                Resumo do Pedido
              </h2>
              <div className="mb-4 space-y-3">
                {items.map((item) => (
                  <div
                    key={`${item.productId}-${item.variantId}`}
                    className="flex gap-3 text-sm"
                  >
                    {item.image && (
                      <img
                        src={item.image}
                        alt={item.name}
                        className="h-16 w-16 rounded object-cover"
                      />
                    )}
                    <div className="flex-1">
                      <p className="font-medium">{item.name}</p>
                      <p className="text-gray-600">Qtd: {item.quantity}</p>
                      <p className="font-semibold">
                        {(
                          (item.price_in_cents * item.quantity) /
                          100
                        ).toLocaleString('pt-BR', {
                          style: 'currency',
                          currency: 'BRL',
                        })}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
              <div className="space-y-2 border-t pt-4 text-sm">
                <div className="flex justify-between">
                  <span>Subtotal:</span>
                  <span>
                    {(totalPrice / 100).toLocaleString('pt-BR', {
                      style: 'currency',
                      currency: 'BRL',
                    })}
                  </span>
                </div>
                {selectedShipping && (
                  <div className="flex justify-between">
                    <span>Frete:</span>
                    <span>
                      {(selectedShipping.price / 100).toLocaleString('pt-BR', {
                        style: 'currency',
                        currency: 'BRL',
                      })}
                    </span>
                  </div>
                )}
                <div className="flex justify-between border-t pt-2 text-lg font-bold">
                  <span>Total:</span>
                  <span>
                    {(totalWithShipping / 100).toLocaleString('pt-BR', {
                      style: 'currency',
                      currency: 'BRL',
                    })}
                  </span>
                </div>
              </div>
              <button
                type="button"
                onClick={handleFinishOrder}
                disabled={loading || !selectedShipping || !paymentMethod}
                className="mt-6 w-full cursor-pointer rounded bg-[#00843d] py-3 font-semibold text-white hover:bg-[#006d32] disabled:cursor-not-allowed disabled:opacity-50"
              >
                {loading ? 'Processando...' : 'Concluir Compra'}
              </button>
            </div>
          </div>
        </div>
      </div>
    </main>
  )
}
