async function request(path, { method = 'GET', body } = {}) {
  const res = await fetch(`/api${path}`, {
    method,
    headers: body ? { 'Content-Type': 'application/json' } : undefined,
    body: body ? JSON.stringify(body) : undefined,
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data.error || res.statusText);
  return data;
}

export const api = {
  session: () => request('/session'),
  signIn: (handle, name) => request('/session', { method: 'POST', body: { handle, name } }),
  signOut: () => request('/session', { method: 'DELETE' }),

  topics: () => request('/topics'),
  launches: (params = {}) => {
    const query = new URLSearchParams(Object.entries(params).filter(([, v]) => v));
    return request(`/launches?${query}`);
  },
  launch: (slug) => request(`/launches/${slug}`),
  submit: (launch) => request('/launches', { method: 'POST', body: launch }),
  vote: (slug) => request(`/launches/${slug}/vote`, { method: 'POST' }),
  comment: (slug, body) => request(`/launches/${slug}/comments`, { method: 'POST', body: { body } }),

  maker: (handle) => request(`/makers/${handle}`),
};
