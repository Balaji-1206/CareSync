// Lightweight API client for backend authentication
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:5000";

export type LoginResponse = {
  success: boolean;
  message?: string;
  data?: {
    token: string;
    user: {
      id: string;
      email: string;
      name: string;
      role: "patient" | "doctor" | "nurse" | "admin" | "staff";
    };
  };
};

async function request<T>(path: string, options: RequestInit = {}): Promise<T> {
  const res = await fetch(`${API_BASE_URL}${path}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...(options.headers || {}),
    },
    credentials: "include",
  });
  const body = await res.json().catch(() => ({}));
  if (!res.ok) {
    throw new Error(body?.message || "Request failed");
  }
  return body as T;
}

export const api = {
  baseUrl: API_BASE_URL,

  async login(email: string, password: string) {
    return request<LoginResponse>("/api/auth/login", {
      method: "POST",
      body: JSON.stringify({ email, password }),
    });
  },

  async register(name: string, email: string, password: string, role?: string) {
    return request<LoginResponse>("/api/auth/register", {
      method: "POST",
      body: JSON.stringify({ name, email, password, role }),
    });
  },

  async me(token: string) {
    return request<{ success: boolean; data: { user: LoginResponse["data"]["user"] } }>("/api/auth/me", {
      headers: { Authorization: `Bearer ${token}` },
    });
  },

  async changePassword(token: string, currentPassword: string, newPassword: string) {
    return request<{ success: boolean; message: string }>("/api/auth/change-password", {
      method: "PUT",
      body: JSON.stringify({ currentPassword, newPassword }),
      headers: { Authorization: `Bearer ${token}` },
    });
  },

  async logout(token: string) {
    return request<{ success: boolean; message: string }>("/api/auth/logout", {
      method: "POST",
      headers: { Authorization: `Bearer ${token}` },
    });
  },
};

export function googleOAuthUrl() {
  return `${API_BASE_URL}/api/auth/google`;
}
