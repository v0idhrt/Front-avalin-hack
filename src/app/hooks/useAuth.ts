import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { login, register, getMe, logout, getApiErrorMessage } from "@/app/api";
import type { LoginDto, RegisterDto } from "@/app/api";

export const authKeys = {
  all: ["auth"] as const,
  me: () => [...authKeys.all, "me"] as const,
};

export function useLogin() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: login,
    onSuccess: (data) => {
      queryClient.setQueryData(authKeys.me(), data.user);
    },
  });
}

export function useRegister() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: register,
    onSuccess: (data) => {
      queryClient.setQueryData(authKeys.me(), data.user);
    },
  });
}

export function useMe() {
  return useQuery({
    queryKey: authKeys.me(),
    queryFn: getMe,
    retry: false,
    staleTime: 1000 * 60 * 60, // 1 hour
  });
}

export function useLogout() {
  const queryClient = useQueryClient();
  
  return () => {
    logout();
    queryClient.setQueryData(authKeys.me(), null);
    queryClient.invalidateQueries({ queryKey: authKeys.all });
  };
}

export { getApiErrorMessage };
