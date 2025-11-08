import api from "../utils/api";

export type SignupInput = {
  name: string;
  cpf: string;
  birth: string;
  email: string;
  password: string;
};

export type LoginInput = {
  email: string;
  password: string;
};

export type AuthUser = {
  id: number;
  name: string;
  email: string;
  cpf: string;
  birth: string;
  criadoEm: string;
};

export async function signup(input: SignupInput): Promise<{ user: AuthUser }> {
  const { data } = await api.post<{ user: AuthUser }>("/auth/signup", input);
  return data;
}

export async function login(input: LoginInput): Promise<{ user: AuthUser }> {
  const { data } = await api.post<{ user: AuthUser }>("/auth/login", input);
  return data;
}

export async function logout(): Promise<{ ok: true }> {
  const { data } = await api.post<{ ok: true }>("/auth/logout");
  return data;
}
