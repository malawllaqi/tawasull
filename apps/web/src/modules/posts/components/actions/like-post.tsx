import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Heart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { api } from "@/lib/ky";
import { catchError, cn } from "@/lib/utils";
import {
	createFeedPostsQueryOptions,
	createPostQueryOptions,
} from "../../queries";

type LikePostProps = {
	postId: string;
	count: number;
	isLiked: boolean;
};
export function LikePost({ postId, count, isLiked }: LikePostProps) {
	const queryClient = useQueryClient();
	const { mutate, isPending } = useMutation({
		mutationFn: async () => await api.get(`post/${postId}/like`),
		onError: (err) => {
			catchError(err);
		},
		onSuccess: () => {
			queryClient.invalidateQueries({
				queryKey: createFeedPostsQueryOptions().queryKey,
			});
			queryClient.invalidateQueries({
				queryKey: createPostQueryOptions({ id: postId }).queryKey,
			});
		},
	});
	return (
		<Button
			className="flex items-center"
			disabled={isPending}
			onClick={(e) => {
				e.preventDefault();
				e.stopPropagation();

				mutate();
			}}
			type="button"
			variant={"ghost"}
		>
			<Heart className={cn(isLiked ? "fill-red-500 text-rose-500" : "")} />
			<span className="text-xs">{count}</span>
		</Button>
	);
}
