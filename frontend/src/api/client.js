import axios from "axios";

const runtimeApiBase = typeof window !== "undefined"
  ? `${window.location.protocol}//${window.location.hostname === "localhost" ? "127.0.0.1" : window.location.hostname}:5000`
  : "http://localhost:5000";
const configuredApiBase = import.meta.env.VITE_API_BASE_URL;
const normalizedConfiguredApiBase = (() => {
  try {
    const url = new URL(configuredApiBase);
    if (url.hostname === "localhost") url.hostname = "127.0.0.1";
    return url.toString().replace(/\/+$/, "");
  } catch { return configuredApiBase; }
})();
const configuredApiHost = (() => {
  try { return configuredApiBase ? new URL(configuredApiBase, runtimeApiBase).hostname : ""; }
  catch { return ""; }
})();
const localApiHosts = new Set(["localhost", "127.0.0.1"]);
const useRuntimeApiBase = typeof window !== "undefined"
  && configuredApiBase
  && localApiHosts.has(configuredApiHost)
  && !localApiHosts.has(window.location.hostname);
const useViteProxy = import.meta.env.DEV && (!configuredApiBase || localApiHosts.has(configuredApiHost));
export const API_BASE = (useViteProxy ? "" : useRuntimeApiBase ? runtimeApiBase : normalizedConfiguredApiBase || runtimeApiBase).replace(/\/+$/, "");

const api = axios.create({
  baseURL: `${API_BASE}/api`,
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("leaf_token");
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem("leaf_token");
      localStorage.removeItem("leaf_user");
      window.dispatchEvent(new Event("leaf-auth"));
    }
    return Promise.reject(error);
  }
);

export const mediaUrl = (path) => path ? (/^https?:\/\//i.test(path) ? path : `${API_BASE}${path.startsWith("/") ? "" : "/"}${path}`) : null;
export default api;
