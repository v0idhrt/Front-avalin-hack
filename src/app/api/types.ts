import { AxiosError } from "axios";

export type { AxiosRequestConfig, AxiosResponse } from "axios";

/** Проверка, что ошибка пришла от axios (сеть, 4xx/5xx и т.д.) */
export function isHttpClientError(error: unknown): error is AxiosError {
  return AxiosError.isAxiosError(error);
}

/** Текст ошибки из тела ответа или сообщения axios */
export function getApiErrorMessage(
  error: unknown,
  fallback = "Произошла ошибка"
): string {
  if (AxiosError.isAxiosError(error)) {
    const data = error.response?.data as { message?: string; error?: string } | undefined;
    if (typeof data?.message === "string") return data.message;
    if (typeof data?.error === "string") return data.error;
    if (error.message) return error.message;
  }
  if (error instanceof Error) return error.message;
  return fallback;
}
