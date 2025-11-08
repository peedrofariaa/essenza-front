import { useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import PasswordField from "../components/PasswordField";

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: "", password: "" });
  const [errors, setErrors] = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false);

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    setForm({ ...form, [e.target.name]: e.target.value });
    setErrors({ ...errors, [e.target.name]: "" });
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (loading) return;
    let valid = true;
    const newErrors = { email: "", password: "" };
    if (!form.email) {
      newErrors.email = "Este é um campo obrigatório.";
      valid = false;
    }
    if (!form.password) {
      newErrors.password = "Este é um campo obrigatório.";
      valid = false;
    }
    setErrors(newErrors);
    if (!valid) return;

    try {
      await login(form.email, form.password);
      alert("Login realizado!");
      navigate("/");
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (err: any) {
      const status = err?.response?.status;
      const msg = err?.response?.data?.message;
      if (status === 401) alert("Credenciais inválidas.");
      else alert(msg || "Erro ao entrar.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-[calc(100vh-80px)] flex items-center justify-center bg-[#f6f3f8] py-12">
      <div className="w-full max-w-3xl mx-auto">
        <h2
          className="text-2xl font-bold mb-8 text-center tracking-widest"
          style={{ color: "#00843d" }}
        >
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
                      style={{
                        color: "rgb(224, 43, 39)",
                        fontSize: "12px",
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
                    className="w-full border border-gray-200 rounded-[5px] py-2 px-3 bg-gray-50 focus:border-[#00843d] outline-none"
                    autoComplete="email"
                  />
                  {errors.email && (
                    <p className="text-red-600 text-xs mt-1">{errors.email}</p>
                  )}
                </div>
                <div>
                  <label className="block mb-1 text-sm text-gray-700">
                    Senha
                    <span
                      style={{
                        color: "rgb(224, 43, 39)",
                        fontSize: "12px",
                        fontWeight: 400,
                        marginLeft: 5,
                      }}
                    >
                      *
                    </span>
                  </label>
                  <div className="relative">
                    <PasswordField
                      label=""
                      name="password"
                      value={form.password}
                      onChange={handleChange}
                      autoComplete="current-password"
                    />
                  </div>
                  {errors.password && (
                    <p className="text-red-600 text-xs mt-1">
                      {errors.password}
                    </p>
                  )}
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
              onClick={() => {
                window.location.href = "/create-user";
              }}
            >
              Criar conta
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
