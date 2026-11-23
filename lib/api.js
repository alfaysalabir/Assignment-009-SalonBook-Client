const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

// The JWT is created by Better Auth. We keep it in memory until it is about to expire.
let cached = { token: null, exp: 0 };

export function clearToken() {
  cached = { token: null, exp: 0 };
}

async function getToken() {
  if (cached.token && Date.now() < cached.exp - 30000) return cached.token;

  const res = await fetch("/api/auth/token", { credentials: "include" });
  if (!res.ok) throw new Error("Please sign in to continue");
  const { token } = await res.json();

  try {
    const base64 = token.split(".")[1].replace(/-/g, "+").replace(/_/g, "/");
    cached = { token, exp: JSON.parse(atob(base64)).exp * 1000 };
  } catch {
    cached = { token, exp: Date.now() + 60000 };
  }
  return token;
}

// One small helper for every request to the Express server
export async function apiFetch(path, { method = "GET", body, auth = true, isForm = false } = {}) {
  const headers = {};
  if (auth) headers.Authorization = `Bearer ${await getToken()}`;
  if (body && !isForm) headers["Content-Type"] = "application/json";

  let res;
  try {
    res = await fetch(`${API_URL}${path}`, {
      method,
      headers,
      body: body ? (isForm ? body : JSON.stringify(body)) : undefined,
    });
  } catch {
    throw new Error("Cannot reach the server. Please check your connection and try again.");
  }

  let data = null;
  try {
    data = await res.json();
  } catch {}

  if (!res.ok) throw new Error(data?.message || "Something went wrong. Please try again.");
  return data;
}

// Upload an image through our server (the ImgBB key stays secret there)
export async function uploadImage(file) {
  if (!file.type.startsWith("image/")) throw new Error("Please choose an image file");
  if (file.size > 5 * 1024 * 1024) throw new Error("Image must be smaller than 5MB");
  const form = new FormData();
  form.append("image", file);
  const data = await apiFetch("/api/upload", { method: "POST", body: form, auth: false, isForm: true });
  return data.url;
}
