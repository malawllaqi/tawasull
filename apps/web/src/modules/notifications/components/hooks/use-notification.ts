import { useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "@/lib/ky";
import { catchError } from "@/lib/utils";
import { createNotificationsQueryOptions } from "../../queries";

export const useMarkAsRead = () => {
	const queryClient = useQueryClient();
	return useMutation({
		// mutationFn: async ({ notificationId }: { notificationId: string }) =>
		// 	await api.patch(`notification/${notificationId}`).json(),
		mutationFn: async () => await api.patch("notification").json(),
		onSuccess: () => {
			queryClient.invalidateQueries({
				queryKey: createNotificationsQueryOptions().queryKey,
			});
		},
		onError: (error) => {
			catchError(error);
		},
	});
};
