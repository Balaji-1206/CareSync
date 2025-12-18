export type UserRole = 'admin' | 'doctor' | 'nurse';

export interface AuthState {
  role: UserRole;
  email: string;
}

const AUTH_ROLE_KEY = 'authRole';
const AUTH_EMAIL_KEY = 'authEmail';

export function setAuth(state: AuthState) {
  localStorage.setItem(AUTH_ROLE_KEY, state.role);
  localStorage.setItem(AUTH_EMAIL_KEY, state.email);
}

export function getAuth(): AuthState | null {
  const role = localStorage.getItem(AUTH_ROLE_KEY) as UserRole | null;
  const email = localStorage.getItem(AUTH_EMAIL_KEY);
  if (!role || !email) return null;
  return { role, email };
}

export function clearAuth() {
  localStorage.removeItem(AUTH_ROLE_KEY);
  localStorage.removeItem(AUTH_EMAIL_KEY);
}

export function inferRoleFromEmail(email: string): UserRole {
  const e = email.toLowerCase();
  if (e.includes('nurse')) return 'nurse';
  if (e.includes('admin')) return 'admin';
  return 'doctor';
}
