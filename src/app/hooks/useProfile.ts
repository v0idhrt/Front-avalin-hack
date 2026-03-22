import { useQuery } from "@tanstack/react-query";
import { 
  fetchProfile,
  fetchMyBookings, 
  fetchMySubscriptions, 
  fetchMyLikes, 
  fetchMyRoutes,
  fetchMyReviews
} from "@/app/api";

export const profileKeys = {
  all: ["profile"] as const,
  detail: (userId: number) => [...profileKeys.all, "detail", userId] as const,
  bookings: (userId: number) => [...profileKeys.all, "bookings", userId] as const,
  subscriptions: (userId: number) => [...profileKeys.all, "subscriptions", userId] as const,
  likes: (userId: number) => [...profileKeys.all, "likes", userId] as const,
  routes: (userId: number) => [...profileKeys.all, "routes", userId] as const,
  reviews: (userId: number) => [...profileKeys.all, "reviews", userId] as const,
};

export function useProfile(userId?: number) {
  return useQuery({
    queryKey: profileKeys.detail(userId!),
    queryFn: async () => {
      try {
        return await fetchProfile(userId!);
      } catch (error: any) {
        if (error?.response?.status === 404) {
          return null; // Возвращаем null, чтобы UI знал, что профиля нет
        }
        throw error;
      }
    },
    enabled: !!userId,
  });
}

export function useMyBookings(userId?: number) {
  return useQuery({
    queryKey: profileKeys.bookings(userId!),
    queryFn: () => fetchMyBookings(userId!),
    enabled: !!userId,
  });
}

export function useMySubscriptions(userId?: number) {
  return useQuery({
    queryKey: profileKeys.subscriptions(userId!),
    queryFn: () => fetchMySubscriptions(userId!),
    enabled: !!userId,
  });
}

export function useMyLikes(userId?: number) {
  return useQuery({
    queryKey: profileKeys.likes(userId!),
    queryFn: () => fetchMyLikes(userId!),
    enabled: !!userId,
  });
}

export function useMyRoutes(userId?: number) {
  return useQuery({
    queryKey: profileKeys.routes(userId!),
    queryFn: () => fetchMyRoutes(userId!),
    enabled: !!userId,
  });
}

export function useMyReviews(userId?: number) {
  return useQuery({
    queryKey: profileKeys.reviews(userId!),
    queryFn: () => fetchMyReviews(userId!),
    enabled: !!userId,
  });
}
