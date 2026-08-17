import axios from "axios";

// Dev: Laravel jalan di 127.0.0.1:8000 (php artisan serve).
// Production (nanti di cPanel): frontend & backend satu domain,
// jadi override VITE_API_URL ke path relatif "/api" lewat file .env.
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://127.0.0.1:8000/api",
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// Kalau server balas 401 (token expired/invalid), langsung hapus token dan
// arahkan ke /login. /login & /register dikecualikan supaya percobaan
// login gagal (password salah) tidak ikut memicu redirect paksa — itu
// tetap ditangani sebagai pesan error biasa di form Login.jsx.
api.interceptors.response.use(
  (response) => response,
  (error) => {
    const status = error.response?.status;
    const url = error.config?.url || "";
    const isAuthEndpoint = url.includes("/login") || url.includes("/register");

    if (status === 401 && !isAuthEndpoint) {
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      if (window.location.pathname !== "/login") {
        window.location.href = "/login";
      }
    }

    return Promise.reject(error);
  }
);

export default api;