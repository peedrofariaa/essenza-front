import { useState } from 'react'
import api from '../utils/api'

export default function ForgotPassword() {
  const [form, setForm] = useState({ email: '' })
  const [errors, setErrors] = useState({ email: '' })
  const [success, setSuccess] = useState(false)
  const [loading, setLoading] = useState(false)

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    setForm({ email: e.target.value })
    setErrors({ email: '' })
    setSuccess(false)
  }

  function validateEmail(email: string) {
    const re = /^[\w.-]+@[\w.-]+\.\w+$/
    return re.test(email)
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    let valid = true
    const newErrors = { email: '' }

    if (!form.email) {
      newErrors.email = 'Este é um campo obrigatório.'
      valid = false
    } else if (!validateEmail(form.email)) {
      newErrors.email =
        'Por favor insira um endereço de e-mail válido (Ex: exemplo@gmail.com).'
      valid = false
    }

    setErrors(newErrors)

    if (!valid) return
    ;(async () => {
      try {
        setLoading(true)
        await api.post('/auth/forgot-password', { email: form.email })
        setSuccess(true)
      } catch {
        setSuccess(true)
      } finally {
        setLoading(false)
      }
    })()
  }

  return (
    <div className="flex min-h-[calc(100vh-80px)] items-center justify-center bg-[#f6f3f8] py-12">
      <div className="mx-auto w-full max-w-md">
        <h2
          className="mb-8 text-center text-2xl font-bold tracking-widest"
          style={{ color: '#00843d' }}
        >
          ESQUECEU SUA SENHA?
        </h2>
        <div className="flex flex-col gap-6 rounded-xl bg-white p-8 shadow">
          <p className="mb-2 text-center text-gray-700">
            Por favor, digite seu endereço de e-mail abaixo para receber o link
            para redefinição de senha.
          </p>
          <form
            onSubmit={handleSubmit}
            autoComplete="off"
            className="flex flex-col gap-4"
          >
            <div>
              <label className="mb-1 block text-sm text-gray-700">
                E-mail
                <span
                  style={{
                    color: 'rgb(224, 43, 39)',
                    fontSize: '12px',
                    fontWeight: 400,
                    marginLeft: 5,
                  }}
                >
                  *
                </span>
              </label>
              <input
                type="email"
                name="email"
                value={form.email}
                onChange={handleChange}
                className="w-full rounded-[5px] border border-gray-200 bg-gray-50 px-3 py-2 outline-none focus:border-[#00843d]"
                autoComplete="email"
              />
              {errors.email && (
                <p className="mt-1 text-xs text-red-600">{errors.email}</p>
              )}
            </div>
            <button
              type="submit"
              className="w-full cursor-pointer rounded-[5px] bg-[#00843d] py-3 text-base font-semibold text-white transition hover:bg-[#007336]"
            >
              {loading ? 'Enviando...' : 'Redefinir senha'}
            </button>
          </form>
          {success && (
            <p className="mt-2 text-center text-sm text-green-600">
              Se o e-mail estiver cadastrado, você receberá as instruções de
              redefinição em instantes.
            </p>
          )}
        </div>
      </div>
    </div>
  )
}
