import { useState } from "react";
import { Link,  } from "react-router-dom";

export default function Login(){
  const [form, setForm] = useState({ email: "", senha: "" });
  const [errors, setErrors] = useState({ email: "", senha: "" });
 // const navigate = useNavigate();

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    setForm({ ...form, [e.target.name]: e.target.value });
    setErrors({ ...errors, [e.target.name]: "" });
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    let valid = true;
    const newErrors = { email: "", senha: "" };
    if (!form.email) {
      newErrors.email = "Este é um campo obrigatório.";
      valid = false;
    }
    if (!form.senha) {
      newErrors.senha = "Este é um campo obrigatório.";
      valid = false;
    }
    setErrors(newErrors);
    if (valid) {
      // Chamar backend ou redirecionar
      alert("Login realizado! (Futuro: implementar autenticação)");
      // navigate("/area-protegida");
    }
  }

  return (
    <div className="min-h-[calc(100vh-80px)] flex items-center justify-center bg-[#f6f3f8] py-12">
      <div className="w-full max-w-3xl mx-auto">
        <h2 className="text-2xl font-bold mb-8 text-center tracking-widest" style={{ color: "#00843d" }}>
          ENTRE OU CADASTRE-SE
        </h2>
        <div className="bg-white rounded-xl shadow p-8 flex flex-col md:flex-row gap-8">
          <form
            className="flex-1 flex flex-col justify-between"
            onSubmit={handleSubmit}
            autoComplete="off"
          >
            <div>
              <h3 className="text-lg font-semibold mb-4 text-gray-800">
                Já tenho uma conta Essenza
              </h3>
              <div className="flex flex-col gap-4">
                <div>
                  <label className="block mb-1 text-sm text-gray-700">
                    E-mail
                    <span
                      style={{ color: "rgb(224, 43, 39)", fontSize: "12px", fontWeight: 400, marginLeft: 5 }}
                    >*</span>
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
                <div>
                  <label className="block mb-1 text-sm text-gray-700">
                    Senha
                    <span
                      style={{ color: "rgb(224, 43, 39)", fontSize: "12px", fontWeight: 400, marginLeft: 5 }}
                    >*</span>
                  </label>
                  <input
                    type="password"
                    name="senha"
                    value={form.senha}
                    onChange={handleChange}
                    className="w-full border border-gray-200 rounded-[5px] py-2 px-3 bg-gray-50 focus:border-[#00843d] outline-none"
                    autoComplete="current-password"
                  />
                  {errors.senha && <p className="text-red-600 text-xs mt-1">{errors.senha}</p>}
                </div>
              </div>
              <div className="mt-3 mb-5 text-right">
                <Link
                  to="/forgot-password"
                  className="text-sm text-[#00843d] hover:underline"
                >
                  Esqueceu a senha?
                </Link>
              </div>
            </div>
            <button
              type="submit"
              className="cursor-pointer w-full py-3 bg-[#00843d] text-white text-base font-semibold rounded-[5px] hover:bg-[#007336] transition"
            >
              Entrar
            </button>
          </form>

          <div className="flex-1 flex flex-col justify-between items-center border-t md:border-t-0 md:border-l border-gray-100 pt-8 md:pt-0 md:pl-8">
            <div>
              <h3 className="text-lg font-semibold mb-4 text-gray-800 text-center md:text-left">
                Ainda não tenho uma conta Essenza
              </h3>
            </div>
            <button
              className="cursor-pointer mt-4 w-full py-3 bg-[#00843d] text-white text-base font-semibold rounded-[5px] hover:bg-[#007336] transition"
              type="button"
              onClick={() => { window.location.href = "/create-user"; }}
            >
              Criar conta
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}