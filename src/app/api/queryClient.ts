import { QueryClient } from "@tanstack/react-query";

/** Настройки по умолчанию для useQuery / useMutation */
export function createAppQueryClient() {
  return new QueryClient({
    defaultOptions: {
      queries: {
        staleTime: 60_000,
        retry: 1,
        refetchOnWindowFocus: false,
      },
      mutations: {
        retry: 0,
      },
  },
  });
}

/** Готовый клиент для `<QueryClientProvider client={queryClient}>` */
export const queryClient = createAppQueryClient();
