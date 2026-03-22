import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createBooking } from "@/app/api";
import { profileKeys } from "./useProfile";

export function useCreateBooking() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: createBooking,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: profileKeys.all });
    },
  });
}
