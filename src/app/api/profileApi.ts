import { http } from "./client";
import type { UserDto } from "./types/auth";

export interface ProfileDto {
  id: number;
  user_id: number;
  name: string;
  avatar_url?: string;
  bio?: string;
  type: "tourist" | "vendor";
}

export interface BookingDto {
  id: number;
  user_id: number;
  excursion_id: number;
  booking_status: string;
  selected_date: string;
  guests_count: number;
}

export interface RouteDto {
  id: number;
  user_id: number;
  title: string;
}

export async function fetchProfile(userId: number) {
  const { data } = await http.get<ProfileDto>(`/profiles/${userId}`);
  return data;
}

export async function fetchMyBookings(userId: number) {
  const { data } = await http.get<BookingDto[]>(`/bookings`, {
    params: { user_id: userId }
  });
  return data;
}

export async function fetchMyRoutes(userId: number) {
  const { data } = await http.get<RouteDto[]>(`/routes`, {
    params: { user_id: userId }
  });
  return data;
}

// Заглушки для Interaction Service (так как в Swagger пока только POST)
export async function fetchMyLikes(userId: number) {
  const { data } = await http.get<any[]>(`/interactions/likes`, { params: { user_id: userId } });
  return data;
}

export async function fetchMySubscriptions(userId: number) {
  try {
    const { data } = await http.get<any[]>(`/interactions/subscriptions`, { params: { user_id: userId } });
    return data;
  } catch {
    return [];
  }
}

export async function fetchMyReviews(userId: number) {
  try {
    const { data } = await http.get<any[]>(`/interactions/reviews`, { params: { user_id: userId } });
    return data;
  } catch {
    return [];
  }
}
