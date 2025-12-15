import { Link } from 'react-router-dom'

export default function OrderFailure() {
  return (
    <div className="min-h-screen bg-[#f6f3f8] px-6 pt-28 pb-12">
      <div className="mx-auto max-w-2xl rounded-lg bg-white p-8 text-center shadow">
        <div className="mb-4 text-6xl">❌</div>
        <h1 className="mb-4 text-3xl font-bold text-red-600">
          Pagamento não autorizado
        </h1>
        <p className="mb-6 text-gray-700">
          Houve um problema com seu pagamento. Por favor, tente novamente.
        </p>
        <Link
          to="/checkout"
          className="mr-4 inline-block rounded bg-[#00843d] px-6 py-3 font-semibold text-white hover:bg-[#006d32]"
        >
          Tentar novamente
        </Link>
        <Link
          to="/"
          className="inline-block rounded border border-[#00843d] px-6 py-3 font-semibold text-[#00843d] hover:bg-[#00843d] hover:text-white"
        >
          Voltar para Home
        </Link>
      </div>
    </div>
  )
}
