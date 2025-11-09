import { useSearchParams, useNavigate } from 'react-router-dom'
import { useState } from 'react'
import api from '../utils/api'
import PasswordField from '../components/PasswordField'

type Strength = 'weak' | 'medium' | 'strong' | ''

export default function ResetPassword() {
  const [sp] = useSearchParams()
  const navigate = useNavigate()
  const token = sp.get('token') || ''
  const uid = sp.get('uid') || ''

  const [form, setForm] = useState({ password: '', confirm: '' })
  const [strength, setStrength] = useState<Strength>('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  function calcStrength(pw: string): Strength {
    if (!pw) return ''
    let score = 0
    if (pw.length >= 8) score++
    if (/[A-Z]/.test(pw)) score++
    if (/[a-z]/.test(pw)) score++
    if (/\d/.test(pw)) score++
    if (/[^A-Za-z0-9]/.test(pw)) score++
    if (score >= 4 && pw.length >= 10) return 'strong'
    if (score >= 3) return 'medium'
    return 'weak'
  }

  async function submit(e: React.FormEvent) {
    e.preventDefault()
    setError('')

    if (!form.password) {
      setError('Informe a nova senha.')
      return
    }
    if (form.password !== form.confirm) {
      setError('Senhas não coincidem.')
      return
    }

    try {
      setLoading(true)
      await api.post('/auth/reset-password', {
        uid: Number(uid),
        token,
        password: form.password,
      })
      alert('Senha redefinida. Faça login.')
      navigate('/login', { replace: true })
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (err: any) {
      const msg = err?.response?.data?.message || 'Link inválido ou expirado'
      setError(msg)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex min-h-[calc(100vh-80px)] items-center justify-center bg-[#f6f3f8] py-12">
      <div className="mx-auto w-full max-w-md">
        <h2
          className="mb-8 text-center text-2xl font-bold tracking-widest"
          style={{ color: '#00843d' }}
        >
          REDEFINIR SENHA
        </h2>

        <div className="flex flex-col gap-6 rounded-xl bg-white p-8 shadow">
          <p className="text-center text-gray-700">
            Defina sua nova senha abaixo para acessar sua conta novamente.
          </p>

          <form
            onSubmit={submit}
            autoComplete="off"
            className="flex flex-col gap-4"
          >
            <div>
              <PasswordField
                label="Nova senha"
                name="password"
                value={form.password}
                onChange={(e) => {
                  const value = e.target.value
                  setForm({ ...form, password: value })
                  setStrength(calcStrength(value))
                }}
                autoComplete="new-password"
              />

              {strength && (
                <div className="mt-1">
                  <div className="h-1.5 w-full rounded bg-gray-200">
                    <div
                      className={`h-1.5 rounded ${
                        strength === 'weak'
                          ? 'w-1/3 bg-red-500'
                          : strength === 'medium'
                            ? 'w-2/3 bg-yellow-500'
                            : 'w-full bg-green-600'
                      }`}
                    />
                  </div>
                  <p
                    className={`mt-1 text-xs ${
                      strength === 'weak'
                        ? 'text-red-600'
                        : strength === 'medium'
                          ? 'text-yellow-600'
                          : 'text-green-600'
                    }`}
                  >
                    {strength === 'weak'
                      ? 'Senha fraca'
                      : strength === 'medium'
                        ? 'Senha média'
                        : 'Senha forte'}
                  </p>
                </div>
              )}
            </div>

            <PasswordField
              label="Confirmar senha"
              name="confirm"
              value={form.confirm}
              onChange={(e) => setForm({ ...form, confirm: e.target.value })}
              autoComplete="new-password"
            />

            {error && (
              <p className="text-center text-sm text-red-600">{error}</p>
            )}

            <button
              type="submit"
              className="w-full cursor-pointer rounded-[5px] bg-[#00843d] py-3 text-base font-semibold text-white transition hover:bg-[#007336]"
            >
              {loading ? 'Enviando...' : 'Salvar nova senha'}
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}
