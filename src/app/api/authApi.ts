import { http, setApiAuthToken } from "./client";
import type { 
  LoginDto, 
  RegisterDto, 
  AuthResponseDto, 
  UserDto 
} from "./types/auth";

export async function login(body: LoginDto) {
  const { data } = await http.post<AuthResponseDto>("/auth/login", body);
  if (data.token) {
    setApiAuthToken(data.token);
    localStorage.setItem("auth_token", data.token);
  }
  return data;
}

export async function register(body: RegisterDto) {
  const { data } = await http.post<AuthResponseDto>("/auth/register", body);
  if (data.token) {
    setApiAuthToken(data.token);
    localStorage.setItem("auth_token", data.token);
  }
  return data;
}

export async function getMe() {
  const { data } = await http.get<UserDto>("/auth/me");
  return data;
}

export function logout() {
  setApiAuthToken(null);
  localStorage.removeItem("auth_token");
}

/** Инициализация токена из localStorage при загрузке */
const savedToken = localStorage.getItem("auth_token");
if (savedToken) {
  setApiAuthToken(savedToken);
}
