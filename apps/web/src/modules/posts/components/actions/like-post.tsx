import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Heart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { api } from "@/lib/ky";
import { catchError, cn } from "@/lib/utils";
import { createPostsInfiniteQueryOptions } from "../../queries";

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
				queryKey: createPostsInfiniteQueryOptions().queryKey,
			});
		},
	});
	return (
		<Button
			className="flex items-center"
			disabled={isPending}
			onClick={() => mutate()}
			type="button"
			variant={"ghost"}
		>
			<Heart className={cn(isLiked ? "fill-red-500 text-rose-500" : "")} />
			<span className="text-xs">{count}</span>
		</Button>
	);
}
