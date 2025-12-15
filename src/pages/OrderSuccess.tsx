/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useState } from 'react'
import { useSearchParams, Link } from 'react-router-dom'
import api from '../utils/api'

export default function OrderSuccess() {
  const [searchParams] = useSearchParams()
  const orderId = searchParams.get('order_id')
  const [order, setOrder] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (orderId) {
      api
        .get(`/orders/${orderId}`)
        .then((res) => setOrder(res.data))
        .catch(() => setOrder(null))
        .finally(() => setLoading(false))
    }
  }, [orderId])

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center pt-28">
        <p>Carregando...</p>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[#f6f3f8] px-6 pt-28 pb-12">
      <div className="mx-auto max-w-2xl rounded-lg bg-white p-8 text-center shadow">
        <div className="mb-4 text-6xl">✅</div>
        <h1 className="mb-4 text-3xl font-bold text-[#00843d]">
          Pedido realizado com sucesso!
        </h1>
        {order && (
          <>
            <p className="mb-2 text-gray-700">
              <strong>Número do pedido:</strong> {order.id}
            </p>
            <p className="mb-2 text-gray-700">
              <strong>Status:</strong>{' '}
              {order.status === 'PAID' ? 'Pago' : 'Aguardando pagamento'}
            </p>
            <p className="mb-6 text-gray-700">
              Você receberá um email com os detalhes do seu pedido.
            </p>
          </>
        )}
        <Link
          to="/"
          className="inline-block rounded bg-[#00843d] px-6 py-3 font-semibold text-white hover:bg-[#006d32]"
        >
          Voltar para Home
        </Link>
      </div>
    </div>
  )
}
