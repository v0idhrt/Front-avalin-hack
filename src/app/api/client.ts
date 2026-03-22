import axios, {
  AxiosError,
  type AxiosInstance,
  type AxiosRequestConfig,
} from "axios";

/** База для всех запросов: `VITE_API_URL` или `/api` */
export const API_BASE_URL = (import.meta.env.VITE_API_URL ?? "") + "/api/v1";

/** Единственный экземпляр axios для приложения */
export const api: AxiosInstance = axios.create({
  baseURL: API_BASE_URL,
  timeout: 30_000,
  headers: {
    Accept: "application/json",
    "Content-Type": "application/json",
  },
  withCredentials: false,
});

let authToken: string | null = null;

/** Задать Bearer-токен (или `null`, чтобы убрать заголовок). Вызывайте после логина/логаута. */
export function setApiAuthToken(token: string | null) {
  authToken = token;
}

api.interceptors.request.use((config) => {
  if (authToken) {
    config.headers.Authorization = `Bearer ${authToken}`;
  }
  return config;
});

function httpsifyUrls(obj: unknown): unknown {
  if (typeof obj === "string") return obj.replace(/^http:\/\//i, "https://");
  if (Array.isArray(obj)) return obj.map(httpsifyUrls);
  if (obj && typeof obj === "object") {
    return Object.fromEntries(Object.entries(obj).map(([k, v]) => [k, httpsifyUrls(v)]));
  }
  return obj;
}

api.interceptors.response.use(
  (response) => { response.data = httpsifyUrls(response.data); return response; },
  (error: AxiosError) => Promise.reject(error)
);

/**
 * Обёртки над тем же экземпляром — удобно импортировать в сервисах рядом с типами ответа.
 * Пути без ведущего слэша тоже ок: axios склеит с `baseURL`.
 */
export const http = {
  get: <T = unknown>(url: string, config?: AxiosRequestConfig) =>
    api.get<T>(url, config),

  post: <T = unknown>(url: string, data?: unknown, config?: AxiosRequestConfig) =>
    api.post<T>(url, data, config),

  put: <T = unknown>(url: string, data?: unknown, config?: AxiosRequestConfig) =>
    api.put<T>(url, data, config),

  patch: <T = unknown>(url: string, data?: unknown, config?: AxiosRequestConfig) =>
    api.patch<T>(url, data, config),

  delete: <T = unknown>(url: string, config?: AxiosRequestConfig) =>
    api.delete<T>(url, config),

  head: <T = unknown>(url: string, config?: AxiosRequestConfig) =>
    api.head<T>(url, config),

  options: <T = unknown>(url: string, config?: AxiosRequestConfig) =>
    api.options<T>(url, config),

  request: <T = unknown>(config: AxiosRequestConfig) => api.request<T>(config),
};

export { AxiosError };
