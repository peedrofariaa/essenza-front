import { useState } from "react"
import { validateConfirmPassword, validateCPF, validateDate, validateEmail } from "../utils/validations";

export default function CreateUser(){
  const [form, setForm] = useState({
    name: "",
    cpf: "",
    birth: "",
    email: "",
    password: "",
    confirmPassword: "",
  })

  const [errors, setErrors] = useState({
    name: "", cpf: "", birth: "",
    email: "", password: "", confirmPassword: ""
  });

  function maskCPF(value: string): string {
  return value
    .replace(/\D/g, "") 
    .replace(/(\d{3})(\d)/, "$1.$2")
    .replace(/(\d{3})(\d)/, "$1.$2")
    .replace(/(\d{3})(\d{1,2})$/, "$1-$2")
    .substring(0, 14);
  }

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    const { name, value } = e.target;
    let newValue = value;

    if (name === "cpf") {
        newValue = maskCPF(value);
    }

    setForm({ ...form, [name]: newValue });
    setErrors({ ...errors, [name]: "" });
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    let valid = true;
    const newErrors = { name: "", cpf: "", birth: "", email: "", password: "", confirmPassword: "" };

    if (!form.name) {
        newErrors.name = "Este é um campo obrigatório.";
        valid = false;
    }
    if (!form.cpf) {
        newErrors.cpf = "Este é um campo obrigatório.";
        valid = false;
    } else if (!validateCPF(form.cpf)) {
        newErrors.cpf = "CPF é inválido.";
        valid = false;
    }
    if (!form.birth) {
        newErrors.birth = "Este é um campo obrigatório.";
        valid = false;
    } else if (!validateDate(form.birth)) {
        newErrors.birth = "Data inválida.";
        valid = false;
    }
    if (!form.email) {
        newErrors.email = "Este é um campo obrigatório";
        valid = false;
    } else if (!validateEmail(form.email)) {
        newErrors.email = "Por favor insira um endereço de e-mail válido (Ex: exemplo@dominio.com).";
        valid = false;
    }
    if (!form.password) {
        newErrors.password = "Este é um campo obrigatório";
        valid = false;
    }
    if (!form.confirmPassword) {
        newErrors.confirmPassword = "Este é um campo obrigatório";
        valid = false;
    } else if (!validateConfirmPassword(form.password, form.confirmPassword)) {
        newErrors.confirmPassword = "Senhas não coincidem.";
        valid = false;
    }

    setErrors(newErrors);
    if (valid) {
      alert("Cadastro realizado com sucesso!");
       setForm({
        name: "",
        cpf: "",
        birth: "",
        email: "",
        password: "",
        confirmPassword: ""
      });
    }
  }

  return (
    <div className="min-h-[calc(100vh-80px)] flex items-center justify-center bg-[#f6f3f8] py-12">
      <div className="w-full max-w-3xl mx-auto">
        <h2 className="text-2xl font-bold mb-8 text-center tracking-widest" style={{ color: "#00843d" }}>
          CRIAR CONTA
        </h2>
        <div className="bg-white rounded-xl shadow p-8 flex flex-col md:flex-row gap-8">
          <div className="flex-1">
            <h3 className="text-lg font-semibold mb-4 text-gray-800">Informações Pessoais</h3>
            <div className="flex flex-col gap-4">
              <div>
                <label className="block mb-1 text-sm text-gray-700">
                    Nome completo
                    <span style={{
                    color: "rgb(224, 43, 39)", fontSize: "12px", fontWeight: 400, marginLeft: 5,
                    }}>*</span>
                </label>
                <input  
                  type="text"
                  name="name"
                  value={form.name}
                  onChange={handleChange}
                  className="w-full border border-gray-200 rounded-[5px] py-2 px-3 bg-gray-50 focus:border-[#00843d] outline-none"
                  autoComplete="name"
                />
                {errors.name && <p className="text-red-600 text-xs mt-1">{errors.name}</p>}
              </div>
              <div>
                <label className="block mb-1 text-sm text-gray-700">
                    CPF
                    <span style={{
                    color: "rgb(224, 43, 39)", fontSize: "12px", fontWeight: 400, marginLeft: 5,
                    }}>*</span>
                </label>
                <input
                  type="text"
                  name="cpf"
                  value={form.cpf}
                  onChange={handleChange}
                  className="w-full border border-gray-200 rounded-[5px] py-2 px-3 bg-gray-50 focus:border-[#00843d] outline-none"
                  autoComplete="off"
                  maxLength={14}
                />
                {errors.cpf && <p className="text-red-600 text-xs mt-1">{errors.cpf}</p>}
              </div>
              <div>
                <label className="block mb-1 text-sm text-gray-700">
                    Data de nascimento
                    <span style={{
                    color: "rgb(224, 43, 39)", fontSize: "12px", fontWeight: 400, marginLeft: 5,
                    }}>*</span>
                </label>
                <input
                  type="date"
                  name="birth"
                  value={form.birth}
                  onChange={handleChange}
                  className="w-full border border-gray-200 rounded-[5px] py-2 px-3 bg-gray-50 focus:border-[#00843d] outline-none"
                  autoComplete="bday"
                />
                {errors.birth && <p className="text-red-600 text-xs mt-1">{errors.birth}</p>}
              </div>
            </div>
          </div>
          <form
            className="flex-1 flex flex-col justify-between"
            onSubmit={handleSubmit}
            autoComplete="off"
          >
            <div>
              <h3 className="text-lg font-semibold mb-4 text-gray-800">Informações de acesso</h3>
              <div className="flex flex-col gap-4">
                <div>
                  <label className="block mb-1 text-sm text-gray-700">
                    E-mail
                    <span style={{
                    color: "rgb(224, 43, 39)", fontSize: "12px", fontWeight: 400, marginLeft: 5,
                    }}>*</span>
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
                    <span style={{
                    color: "rgb(224, 43, 39)", fontSize: "12px", fontWeight: 400, marginLeft: 5,
                    }}>*</span>
                  </label>
                  <input
                    type="password"
                    name="password"
                    value={form.password}
                    onChange={handleChange}
                    className="w-full border border-gray-200 rounded-[5px] py-2 px-3 bg-gray-50 focus:border-[#00843d] outline-none"
                    autoComplete="new-password"
                  />
                  {errors.password && <p className="text-red-600 text-xs mt-1">{errors.password}</p>}
                </div>
                <div>
                  <label className="block mb-1 text-sm text-gray-700">
                    Confirmar senha
                    <span style={{
                    color: "rgb(224, 43, 39)", fontSize: "12px", fontWeight: 400, marginLeft: 5,
                    }}>*</span>
                  </label>
                  <input
                    type="password"
                    name="confirmPassword"
                    value={form.confirmPassword}
                    onChange={handleChange}
                    className="w-full border border-gray-200 rounded-[5px] py-2 px-3 bg-gray-50 focus:border-[#00843d] outline-none"
                    autoComplete="new-password"
                  />
                  {errors.confirmPassword && <p className="text-red-600 text-xs mt-1">{errors.confirmPassword}</p>}
                </div>
              </div>
            </div>
            <button
              type="submit"
              className="cursor-pointer mt-6 w-full py-3 bg-[#00843d] text-white text-base font-semibold rounded-[5px] hover:bg-[#007336] transition"
            >
              Criar conta
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}