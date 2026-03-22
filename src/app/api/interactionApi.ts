import { http } from "./client";

export interface LikeRequest {
  post_id: number;
  user_id: number;
}

export interface SubscriptionRequest {
  place_id: number;
  user_id: number;
}

export interface CommentRequest {
  post_id: number;
  user_id: number;
  text: string;
  parent_comment_id?: number;
}

export async function postLike(body: LikeRequest) {
  const { data } = await http.post("/interactions/like", body);
  return data;
}

export async function deleteLike(body: LikeRequest) {
  // Axios DELETE usually takes data in the config.data property
  const { data } = await http.delete("/interactions/like", { data: body });
  return data;
}

export async function postSubscribe(body: SubscriptionRequest) {
  const { data } = await http.post("/interactions/subscribe", body);
  return data;
}

export async function deleteSubscribe(body: SubscriptionRequest) {
  const { data } = await http.delete("/interactions/subscribe", { data: body });
  return data;
}

export async function postComment(body: CommentRequest) {
  const { data } = await http.post("/interactions/comment", body);
  return data;
}
