import { useState } from "react";
import api from "../utils/api";

export default function ForgotPassword(){
  const [form, setForm] = useState({ email: "" });
  const [errors, setErrors] = useState({ email: "" });
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    setForm({ email: e.target.value });
    setErrors({ email: "" });
    setSuccess(false);
  }

  function validateEmail(email: string) {
    const re = /^[\w.-]+@[\w.-]+\.\w+$/;
    return re.test(email);
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    let valid = true;
    const newErrors = { email: "" };

    if (!form.email) {
      newErrors.email = "Este é um campo obrigatório.";
      valid = false;
    } else if (!validateEmail(form.email)) {
      newErrors.email = "Por favor insira um endereço de e-mail válido (Ex: exemplo@gmail.com).";
      valid = false;
    }

    setErrors(newErrors);

    if (!valid) return;
    (async () => {
      try {
        setLoading(true)
        await api.post("/auth/forgot-password", { email: form.email });
        setSuccess(true);
      } catch {
        setSuccess(true);
      } finally {
        setLoading(false)
      }
    })();
  }

  return (
    <div className="min-h-[calc(100vh-80px)] flex items-center justify-center bg-[#f6f3f8] py-12">
      <div className="w-full max-w-md mx-auto">
        <h2 className="text-2xl font-bold mb-8 text-center tracking-widest" style={{ color: "#00843d" }}>
          ESQUECEU SUA SENHA?
        </h2>
        <div className="bg-white rounded-xl shadow p-8 flex flex-col gap-6">
          <p className="text-center text-gray-700 mb-2">
            Por favor, digite seu endereço de e-mail abaixo para receber o link para redefinição de senha.
          </p>
          <form onSubmit={handleSubmit} autoComplete="off" className="flex flex-col gap-4">
            <div>
              <label className="block mb-1 text-sm text-gray-700">
                E-mail
                <span style={{ color: "rgb(224, 43, 39)", fontSize: "12px", fontWeight: 400, marginLeft: 5 }}>*</span>
              </label>
              <input
                type="email"
                name="email"
                value={form.email}
                onChange={handleChange}
                className="w-full border border-gray-200 rounded-[5px] py-2 px-3 bg-gray-50 focus:border-[#00843d] outline-none"
                autoComplete="email"
              />
              {errors.email && <p className="text-red-600 text-xs mt-1">{errors.email}</p>}
            </div>
            <button
              type="submit"
              className="w-full py-3 bg-[#00843d] text-white text-base font-semibold rounded-[5px] hover:bg-[#007336] transition cursor-pointer"
            >
              {loading ? "Enviando..." : "Redefinir senha"}
            </button>
          </form>
          {success && (
            <p className="text-green-600 text-sm text-center mt-2">
              Se o e-mail estiver cadastrado, você receberá as instruções de redefinição em instantes.
            </p>
          )}
        </div>
      </div>
    </div>
  );
}