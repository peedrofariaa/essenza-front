import { Link } from 'react-router-dom'

export default function OrderPending() {
  return (
    <div className="min-h-screen bg-[#f6f3f8] px-6 pt-36 pb-12">
      <div className="mx-auto max-w-2xl rounded-lg bg-white p-8 text-center shadow">
        <div className="mb-4 text-6xl">⏳</div>
        <h1 className="mb-4 text-3xl font-bold text-yellow-600">
          Pagamento pendente
        </h1>
        <p className="mb-6 text-gray-700">
          Seu pagamento está sendo processado. Você receberá um email quando for
          confirmado.
        </p>
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
