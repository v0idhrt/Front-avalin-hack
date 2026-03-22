import { http } from "./client";

export interface PostDto {
  id: number;
  author_user_id: number;
  place_id: number;
  excursion_id?: number;
  title: string;
  content: string;
  cover_image_url: string;
  likes_count: number;
  comments_count: number;
  type: string;
  published_at: string;
}

export interface ExcursionDto {
  id: number;
  place_id: number;
  title: string;
  short_description: string;
  cover_image_url: string;
  price_amount: number;
  currency: string;
  rating_avg: number;
  rating_count: number;
  category: string;
}

export interface RouteDto {
  id: number;
  user_id: number;
  title: string;
  distance_meters: number;
  duration_seconds: number;
  start_location_text: string;
  external_map_url?: string;
  route_provider?: string;
}

export async function fetchAllRoutes(userId: number) {
  const { data } = await http.get<RouteDto[]>("/routes", {
    params: { user_id: userId }
  });
  return data;
}

export async function fetchFeed() {
  const { data } = await http.get<PostDto[]>("/feed");
  return data;
}

export async function fetchExcursions() {
  const { data } = await http.get<ExcursionDto[]>("/excursions");
  return data;
}

export async function fetchExcursionById(id: number) {
  const { data } = await http.get<ExcursionDto>(`/excursions/${id}`);
  return data;
}

export async function createExcursion(body: any) {
  const { data } = await http.post<ExcursionDto>("/excursions", body);
  return data;
}

export async function updateExcursion(id: number, body: any) {
  const { data } = await http.put<ExcursionDto>(`/excursions/${id}`, body);
  return data;
}

export async function createPost(body: any) {
  const { data } = await http.post<PostDto>("/posts", body);
  return data;
}

export async function generatePostWithAi(body: { prompt: string; organizer_name?: string }): Promise<{ title: string; content: string }> {
  const { data } = await http.post("/ai/generate-post", body);
  return data;
}
