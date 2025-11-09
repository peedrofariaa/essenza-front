import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import {
  validateConfirmPassword,
  validateCPF,
  validateDate,
  validateEmail,
} from '../utils/validations'
import PasswordField from '../components/PasswordField'

type Strength = 'weak' | 'medium' | 'strong' | ''

export default function CreateUser() {
  const [strength, setStrength] = useState<Strength>('')
  const { signup } = useAuth()
  const navigate = useNavigate()

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

  const [form, setForm] = useState({
    name: '',
    cpf: '',
    birth: '',
    email: '',
    password: '',
    confirmPassword: '',
  })

  const [errors, setErrors] = useState({
    name: '',
    cpf: '',
    birth: '',
    email: '',
    password: '',
    confirmPassword: '',
  })

  const [loading, setLoading] = useState(false)

  function maskCPF(value: string): string {
    return value
      .replace(/\D/g, '')
      .replace(/(\d{3})(\d)/, '$1.$2')
      .replace(/(\d{3})(\d)/, '$1.$2')
      .replace(/(\d{3})(\d{1,2})$/, '$1-$2')
      .substring(0, 14)
  }

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    const { name, value } = e.target
    let newValue = value

    if (name === 'cpf') newValue = maskCPF(value)
    setForm({ ...form, [name]: newValue })
    setErrors({ ...errors, [name]: '' })
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (loading) return
    let valid = true
    const newErrors = {
      name: '',
      cpf: '',
      birth: '',
      email: '',
      password: '',
      confirmPassword: '',
    }

    if (!form.name) {
      newErrors.name = 'Este é um campo obrigatório.'
      valid = false
    }
    if (!form.cpf) {
      newErrors.cpf = 'Este é um campo obrigatório.'
      valid = false
    } else if (!validateCPF(form.cpf)) {
      newErrors.cpf = 'CPF é inválido.'
      valid = false
    }
    if (!form.birth) {
      newErrors.birth = 'Este é um campo obrigatório.'
      valid = false
    } else if (!validateDate(form.birth)) {
      newErrors.birth = 'Data inválida.'
      valid = false
    }
    if (!form.email) {
      newErrors.email = 'Este é um campo obrigatório'
      valid = false
    } else if (!validateEmail(form.email)) {
      newErrors.email =
        'Por favor insira um endereço de e-mail válido (Ex: exemplo@dominio.com).'
      valid = false
    }
    if (!form.password) {
      newErrors.password = 'Este é um campo obrigatório'
      valid = false
    }
    if (!form.confirmPassword) {
      newErrors.confirmPassword = 'Este é um campo obrigatório'
      valid = false
    } else if (!validateConfirmPassword(form.password, form.confirmPassword)) {
      newErrors.confirmPassword = 'Senhas não coincidem.'
      valid = false
    }

    setErrors(newErrors)
    if (!valid) return

    setLoading(true)
    try {
      await signup({
        name: form.name,
        cpf: form.cpf,
        birth: form.birth,
        email: form.email,
        password: form.password,
      })

      alert('Cadastro realizado com sucesso!')
      setForm({
        name: '',
        cpf: '',
        birth: '',
        email: '',
        password: '',
        confirmPassword: '',
      })
      navigate('/')
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (err: any) {
      const status = err?.response?.status
      const msg = err?.response?.data?.message
      if (status === 409) alert(msg || 'Email ou CPF já cadastrado.')
      else if (status === 400) alert(msg || 'Dados inválidos.')
      else alert(msg || 'Erro ao cadastrar.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex min-h-[calc(100vh-80px)] items-center justify-center bg-[#f6f3f8] py-12">
      <div className="mx-auto w-full max-w-3xl">
        <h2
          className="mb-8 text-center text-2xl font-bold tracking-widest"
          style={{ color: '#00843d' }}
        >
          CRIAR CONTA
        </h2>
        <div className="flex flex-col gap-8 rounded-xl bg-white p-8 shadow md:flex-row">
          <div className="flex-1">
            <h3 className="mb-4 text-lg font-semibold text-gray-800">
              Informações Pessoais
            </h3>
            <div className="flex flex-col gap-4">
              <div>
                <label className="mb-1 block text-sm text-gray-700">
                  Nome completo
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
                  type="text"
                  name="name"
                  value={form.name}
                  onChange={handleChange}
                  className="w-full rounded-[5px] border border-gray-200 bg-gray-50 px-3 py-2 outline-none focus:border-[#00843d]"
                  autoComplete="name"
                />
                {errors.name && (
                  <p className="mt-1 text-xs text-red-600">{errors.name}</p>
                )}
              </div>
              <div>
                <label className="mb-1 block text-sm text-gray-700">
                  CPF
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
                  type="text"
                  name="cpf"
                  value={form.cpf}
                  onChange={handleChange}
                  className="w-full rounded-[5px] border border-gray-200 bg-gray-50 px-3 py-2 outline-none focus:border-[#00843d]"
                  autoComplete="off"
                  maxLength={14}
                />
                {errors.cpf && (
                  <p className="mt-1 text-xs text-red-600">{errors.cpf}</p>
                )}
              </div>
              <div>
                <label className="mb-1 block text-sm text-gray-700">
                  Data de nascimento
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
                  type="date"
                  name="birth"
                  value={form.birth}
                  onChange={handleChange}
                  className="w-full rounded-[5px] border border-gray-200 bg-gray-50 px-3 py-2 outline-none focus:border-[#00843d]"
                  autoComplete="bday"
                />
                {errors.birth && (
                  <p className="mt-1 text-xs text-red-600">{errors.birth}</p>
                )}
              </div>
            </div>
          </div>
          <form
            className="flex flex-1 flex-col justify-between"
            onSubmit={handleSubmit}
            autoComplete="off"
          >
            <div>
              <h3 className="mb-4 text-lg font-semibold text-gray-800">
                Informações de acesso
              </h3>
              <div className="flex flex-col gap-4">
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
                <div>
                  <label className="mb-1 block text-sm text-gray-700">
                    Senha
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
                  <PasswordField
                    label=""
                    name="password"
                    value={form.password}
                    onChange={(e) => {
                      const v = e.target.value
                      setForm({ ...form, password: v })
                      setStrength(calcStrength(v))
                      setErrors({ ...errors, password: '' })
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
                  {errors.password && (
                    <p className="mt-1 text-xs text-red-600">
                      {errors.password}
                    </p>
                  )}
                </div>
                <div>
                  <label className="mb-1 block text-sm text-gray-700">
                    Confirmar senha
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
                  <PasswordField
                    label=""
                    name="confirmPassword"
                    value={form.confirmPassword}
                    onChange={(e) => {
                      setForm({ ...form, confirmPassword: e.target.value })
                      setErrors({ ...errors, confirmPassword: '' })
                    }}
                    autoComplete="new-password"
                  />
                  {errors.confirmPassword && (
                    <p className="mt-1 text-xs text-red-600">
                      {errors.confirmPassword}
                    </p>
                  )}
                </div>
              </div>
            </div>
            <button
              type="submit"
              className="mt-6 w-full cursor-pointer rounded-[5px] bg-[#00843d] py-3 text-base font-semibold text-white transition hover:bg-[#007336]"
            >
              Criar conta
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}
