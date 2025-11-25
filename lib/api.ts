const base = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';

async function request(path: string, method = 'GET', body?: any, token?: string) {
  const headers: any = { 'Content-Type': 'application/json' };
  if (token) headers['Authorization'] = `Bearer ${token}`;
  const res = await fetch(`${base}${path}`, {
    method,
    headers,
    body: body ? JSON.stringify(body) : undefined,
    credentials: 'include',
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw err;
  }
  return res.json();
}

export const apiLogin = (email: string, password: string) => request('/auth/login', 'POST', { email, password });
export const apiGetUsers = (token?: string) => request('/users', 'GET', undefined, token);
export const apiCreateUser = (data: any, token?: string) => request('/users', 'POST', data, token);
export const apiUpdateUser = (id: string, data: any, token?: string) => request(`/users/${id}`, 'PATCH', data, token);
export const apiDeleteUser = (id: string, token?: string) => request(`/users/${id}`, 'DELETE', undefined, token);
