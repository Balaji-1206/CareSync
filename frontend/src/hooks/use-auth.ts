export type UserRole = 'admin' | 'doctor' | 'nurse' | 'patient' | 'staff';

export interface AuthState {
  role: UserRole;
  email: string;
  token: string;
  name?: string;
}

const AUTH_ROLE_KEY = 'authRole';
const AUTH_EMAIL_KEY = 'authEmail';
const AUTH_TOKEN_KEY = 'authToken';
const AUTH_NAME_KEY = 'authName';

export function setAuth(state: AuthState) {
  localStorage.setItem(AUTH_ROLE_KEY, state.role);
  localStorage.setItem(AUTH_EMAIL_KEY, state.email);
  localStorage.setItem(AUTH_TOKEN_KEY, state.token);
  if (state.name) localStorage.setItem(AUTH_NAME_KEY, state.name);
}

export function getAuth(): AuthState | null {
  const role = localStorage.getItem(AUTH_ROLE_KEY) as UserRole | null;
  const email = localStorage.getItem(AUTH_EMAIL_KEY);
  const token = localStorage.getItem(AUTH_TOKEN_KEY);
  const name = localStorage.getItem(AUTH_NAME_KEY) || undefined;
  if (!role || !email || !token) return null;
  return { role, email, token, name };
}

export function clearAuth() {
  localStorage.removeItem(AUTH_ROLE_KEY);
  localStorage.removeItem(AUTH_EMAIL_KEY);
  localStorage.removeItem(AUTH_TOKEN_KEY);
  localStorage.removeItem(AUTH_NAME_KEY);
}

// Kept for legacy logic if needed elsewhere
export function inferRoleFromEmail(email: string): UserRole {
  const e = email.toLowerCase();
  if (e.includes('nurse')) return 'nurse';
  if (e.includes('admin')) return 'admin';
  return 'doctor';
}
