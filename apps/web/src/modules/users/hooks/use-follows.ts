import { useMutation, useQueryClient } from "@tanstack/react-query";
import type { User } from "@tawasull/shared";
import { toast } from "sonner";
import { api } from "@/lib/ky";
import { catchError } from "@/lib/utils";
import { createUsersQueryOptions, userDetailsQueryOptions } from "../queries";

export function useFollows(user: User) {
	const queryClient = useQueryClient();
	return useMutation({
		mutationFn: async () => {
			if (user.isFollowing) {
				return await api(`user/${user.id}/unfollow`);
			}

			return await api(`user/${user.id}/follow`);
		},
		onError: (err) => {
			catchError(err);
		},
		onSuccess: () => {
			const isFollowing = user.isFollowing;
			toast.success(
				isFollowing
					? "Unfollowed user successfully"
					: "Followed user successfully"
			);

			queryClient.invalidateQueries({
				queryKey: createUsersQueryOptions().queryKey,
			});

			queryClient.invalidateQueries({
				queryKey: userDetailsQueryOptions({ username: user.username }).queryKey,
			});
		},
	});
}
