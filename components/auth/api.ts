// lib/api.ts
import { API_BASE_URL } from "@/constants/urls";
import { useAuth } from "@clerk/expo";

export function useApi() {
  const { getToken } = useAuth();

  async function apiFetch(path: string, init?: RequestInit, tokenP?: string) {
    const token = tokenP ?? (await getToken());

    const headers = new Headers(init?.headers);
    headers.set("Content-Type", "application/json");

    if (token) {
      headers.set("Authorization", `Bearer ${token}`);
    }
    console.log("final", token);

    const response = await fetch(`${API_BASE_URL}${path}`, {
      ...init,
      headers,
    });

    return response;
  }

  return { apiFetch };
}
