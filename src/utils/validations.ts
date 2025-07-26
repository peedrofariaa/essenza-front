export function validateEmail(email: string): boolean {
  const regex = /^[\w.-]+@[\w.-]+\.\w+$/;
  return regex.test(email);
}

export function validateCPF(cpf: string): boolean {
  cpf = cpf.replace(/[^\d]+/g, "");
  if (cpf.length !== 11) return false;

  if (/^(\d)\1{10}$/.test(cpf)) return false;

  let sum = 0;
  let rest;
  for (let i = 1; i <= 9; i++) sum += parseInt(cpf[i - 1]) * (11 - i);
  rest = (sum * 10) % 11;
  if (rest === 10 || rest === 11) rest = 0;
  if (rest !== parseInt(cpf[9])) return false;

  sum = 0;
  for (let i = 1; i <= 10; i++) sum += parseInt(cpf[i - 1]) * (12 - i);
  rest = (sum * 10) % 11;
  if (rest === 10 || rest === 11) rest = 0;
  if (rest !== parseInt(cpf[10])) return false;

  return true;
}

export function validateDate(dateStr: string): boolean {
  if (!dateStr) return false;
  const date = new Date(dateStr);
  const now = new Date();
  if (isNaN(date.getTime())) return false;
  return date <= now;
}

export function validateConfirmPassword(password: string, confirmPassword: string): boolean {
  return password === confirmPassword && password.length > 0;
}