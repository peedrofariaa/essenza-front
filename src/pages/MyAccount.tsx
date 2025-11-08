import { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";

function formatDateBR(iso: string) {
  try {
    const d = new Date(iso);
    return d.toLocaleDateString("pt-BR", { timeZone: "UTC" });
  } catch {
    return iso;
  }
}

export default function MyAccount() {
  const { user, setUser } = useAuth();
  const [ editing, setEditing ] = useState(false);

  const [form, setForm] = useState({
    name: "",
    email: "",
    cpf: "",
    birth: "",
  });

  useEffect(() => {
    if (user) {
      setForm({
        name: user.name ?? "",
        email: user.email ?? "",
        cpf: user.cpf ?? "",
        birth: user.birth ? user.birth.slice(0, 10) : "",
      });
    }
  }, [user]);

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  }

  async function handleSalvar(e: React.FormEvent) {
    e.preventDefault();
    if (!user) return;
    const birthISO = new Date(`${form.birth}T00:00:00`).toISOString();

    setUser({
      id: user.id,
      name: form.name,
      email: form.email,
      cpf: form.cpf,
      birth: birthISO,
      criadoEm: user.criadoEm,
    });
    setEditing(false);
    alert("Dados atualizados (simulação). Em breve, integrar com endpoint de update.");
  }

  if (!user) {
    return (
      <div className="max-w-3xl mx-auto p-6">
        <h2 className="text-xl font-semibold mb-4">Minha conta</h2>
        <p>É necessário entrar para acessar esta página.</p>
      </div>
    );
  }

  return (
   <div className="max-w-3xl mx-auto p-6">
    <h2 className="text-xl font-semibold mb-6">Meus dados</h2>

  {!editing && (
    <div className="space-y-3">
      <div>
        <span className="font-medium">E-mail:</span> {user?.email}
      </div>
      <div>
        <span className="font-medium">Nome:</span> {user?.name}
      </div>
      <div>
        <span className="font-medium">CPF:</span> {user?.cpf}
      </div>
      <div>
        <span className="font-medium">Data de nascimento:</span> {formatDateBR(user.birth)}
      </div>

      <div className="mt-6 flex gap-3">
        <button onClick={() => setEditing(true)} className="py-2 px-4 rounded border border-black text-[#007336] hover:bg-[#007336] hover:text-white cursor-pointer">
          Editar
        </button>
        <button
          onClick={() => alert("Fluxo de mudança de senha em breve.")}
          className="py-2 px-4 rounded border border-black text-[#007336] hover:bg-[#007336] hover:text-white cursor-pointer"
        >
          Mudar senha
        </button>
      </div>
    </div>
  )}

  {editing && (
    <form onSubmit={handleSalvar} className="space-y-4">
      <div>
        <label className="block text-sm mb-1">E-mail</label>
        <input name="email" type="email" value={form.email} onChange={handleChange} className="w-full border rounded px-3 py-2" />
      </div>
      <div>
        <label className="block text-sm mb-1">Nome</label>
        <input name="name" type="text" value={form.name} onChange={handleChange} className="w-full border rounded px-3 py-2" />
      </div>
      <div>
        <label className="block text-sm mb-1">CPF</label>
        <input name="cpf" type="text" value={form.cpf} onChange={handleChange} className="w-full border rounded px-3 py-2" />
      </div>
      <div>
        <label className="block text-sm mb-1">Data de nascimento</label>
        <input name="birth" type="date" value={form.birth} onChange={handleChange} className="w-full border rounded px-3 py-2" />
      </div>

      <div className="flex gap-3">
        <button type="submit" className="py-2 px-4 rounded bg-[#00843d] text-white hover:bg-[#007336]">Salvar</button>
        <button type="button" onClick={() => setEditing(false)} className="py-2 px-4 rounded border border-gray-300 hover:bg-gray-50">Cancelar</button>
      </div>
    </form>
  )}
    </div>
  );
}