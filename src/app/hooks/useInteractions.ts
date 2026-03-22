import { useMutation, useQueryClient } from "@tanstack/react-query";
import { postLike, deleteLike, postSubscribe, deleteSubscribe, postComment } from "@/app/api";
import { profileKeys } from "./useProfile";
import { contentKeys } from "./useContent";

export function useLike() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: postLike,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: contentKeys.feed() });
      queryClient.invalidateQueries({ queryKey: profileKeys.all });
    },
  });
}

export function useUnlike() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: deleteLike,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: contentKeys.feed() });
      queryClient.invalidateQueries({ queryKey: profileKeys.all });
    },
  });
}

export function useSubscribe() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: postSubscribe,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: profileKeys.all });
    },
  });
}

export function useUnsubscribe() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: deleteSubscribe,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: profileKeys.all });
    },
  });
}

export function useAddComment() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: postComment,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: contentKeys.feed() });
    },
  });
}
