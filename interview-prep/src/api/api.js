// ─── Central API utility ────────────────────────────────────────────
// All requests go through here. Automatically attaches JWT token.

const BASE = "http://localhost:5000/api";

const getToken = () => localStorage.getItem("ip_token");

const request = async (method, endpoint, body = null) => {
  const headers = { "Content-Type": "application/json" };
  const token = getToken();
  if (token) headers["Authorization"] = `Bearer ${token}`;

  const res = await fetch(`${BASE}${endpoint}`, {
    method,
    headers,
    body: body ? JSON.stringify(body) : null,
  });

  const data = await res.json();
  if (!res.ok) throw new Error(data.message || "Something went wrong");
  return data;
};

export const get    = (ep)       => request("GET",    ep);
export const post   = (ep, body) => request("POST",   ep, body);
export const put    = (ep, body) => request("PUT",    ep, body);
export const patch  = (ep, body) => request("PATCH",  ep, body);
export const del    = (ep)       => request("DELETE", ep);
