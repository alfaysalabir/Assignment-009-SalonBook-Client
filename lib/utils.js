export const formatPrice = (n) =>
  new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(Number(n) || 0);

export const formatDate = (d) =>
  d ? new Date(d).toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric" }) : "—";

// appointmentDate is saved as "YYYY-MM-DD" -> format it without time-zone shifts
export const formatDay = (str) => {
  if (!str) return "—";
  const [y, m, d] = str.split("-").map(Number);
  return new Date(y, m - 1, d).toLocaleDateString("en-US", { weekday: "short", year: "numeric", month: "short", day: "numeric" });
};

export const todayString = () => {
  const now = new Date();
  const mm = String(now.getMonth() + 1).padStart(2, "0");
  const dd = String(now.getDate()).padStart(2, "0");
  return `${now.getFullYear()}-${mm}-${dd}`;
};

export const shortId = (id = "") => (id.length > 14 ? `${id.slice(0, 8)}…${id.slice(-5)}` : id);

// only allow redirects inside our own site
export const safeRedirect = (path) => (path && path.startsWith("/") && !path.startsWith("//") ? path : "/dashboard");

export const passwordError = (password) => {
  if (password.length < 6) return "Password must be at least 6 characters";
  if (!/[A-Z]/.test(password)) return "Password needs one uppercase letter";
  if (!/[a-z]/.test(password)) return "Password needs one lowercase letter";
  return "";
};
