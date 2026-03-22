import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { fetchFeed, fetchExcursions, fetchExcursionById, fetchAllRoutes, createExcursion, createPost } from "@/app/api";

export const contentKeys = {
  all: ["content"] as const,
  feed: () => [...contentKeys.all, "feed"] as const,
  excursions: () => [...contentKeys.all, "excursions"] as const,
  excursion: (id: number) => [...contentKeys.all, "excursion", id] as const,
  routes: (userId: number) => [...contentKeys.all, "routes", userId] as const,
};

export function useCreateExcursion() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: createExcursion,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: contentKeys.excursions() });
    },
  });
}

export function useUpdateExcursion() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, body }: { id: number; body: any }) => updateExcursion(id, body),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: contentKeys.excursions() });
    },
  });
}

export function useCreatePost() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: createPost,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: contentKeys.feed() });
    },
  });
}

export function useAllRoutes(userId: number) {
  return useQuery({
    queryKey: contentKeys.routes(userId),
    queryFn: () => fetchAllRoutes(userId),
    enabled: !!userId,
  });
}

export function useFeed() {
  return useQuery({
    queryKey: contentKeys.feed(),
    queryFn: fetchFeed,
  });
}

export function useExcursions() {
  return useQuery({
    queryKey: contentKeys.excursions(),
    queryFn: fetchExcursions,
  });
}

export function useExcursion(id: number) {
  return useQuery({
    queryKey: contentKeys.excursion(id),
    queryFn: () => fetchExcursionById(id),
    enabled: !!id,
  });
}
