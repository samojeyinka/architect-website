const url = import.meta.env.VITE_SUPABASE_URL as string | undefined;
const key = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY as string | undefined;

if (!url || !key) {
  throw new Error('Missing VITE_SUPABASE_URL or VITE_SUPABASE_PUBLISHABLE_KEY.');
}

export type Session = { access_token: string; refresh_token: string; user: { id: string; email?: string } };

const headers = (token?: string) => ({
  apikey: key,
  Authorization: `Bearer ${token || key}`,
  'Content-Type': 'application/json',
});

async function request<T>(path: string, init: RequestInit = {}, token?: string): Promise<T> {
  const response = await fetch(`${url}${path}`, { ...init, headers: { ...headers(token), ...init.headers } });
  if (!response.ok) {
    const error = await response.json().catch(() => ({ message: response.statusText }));
    throw new Error(error.message ?? error.msg ?? 'Something went wrong. Please try again.');
  }
  return response.status === 204 ? undefined as T : response.json() as Promise<T>;
}

export const auth = {
  signUp: (email: string, password: string, fullName: string, role: 'client' | 'architect') => request<{ user: Session['user']; session: Session | null }>('/auth/v1/signup', { method: 'POST', body: JSON.stringify({ email, password, data: { full_name: fullName, role } }) }),
  signIn: (email: string, password: string) => request<Session>('/auth/v1/token?grant_type=password', { method: 'POST', body: JSON.stringify({ email, password }) }),
  refresh: (refresh_token: string) => request<Session>('/auth/v1/token?grant_type=refresh_token', { method: 'POST', body: JSON.stringify({ refresh_token }) }),
  signOut: (token: string) => request<void>('/auth/v1/logout', { method: 'POST' }, token),
};

export const database = {
  insert: <T>(table: string, value: Record<string, unknown>, token: string) => request<T[]>(`/rest/v1/${table}`, { method: 'POST', headers: { Prefer: 'return=representation' }, body: JSON.stringify(value) }, token),
  update: <T>(table: string, filter: string, value: Record<string, unknown>, token: string) => request<T[]>(`/rest/v1/${table}?${filter}`, { method: 'PATCH', headers: { Prefer: 'return=representation' }, body: JSON.stringify(value) }, token),
  select: <T>(table: string, query: string, token: string) => request<T[]>(`/rest/v1/${table}?${query}`, {}, token),
};
