import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Trash } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";
import { api } from "@/lib/ky";
import { catchError } from "@/lib/utils";
import {
	createFeedPostsQueryOptions,
	createPostQueryOptions,
} from "@/modules/posts/queries";
import { createCommentsQueryOptions } from "../queries";

export type DeleteCommentProps = {
	commentId: string;
	postId: string;
};
export function DeleteComment({ commentId, postId }: DeleteCommentProps) {
	const queryClient = useQueryClient();
	console.log(commentId);
	const { mutate, isPending } = useMutation({
		mutationFn: async () => await api.delete(`comment/${commentId}`).json(),
		onError: (err) => {
			catchError(err);
		},
		onSuccess: () => {
			queryClient.invalidateQueries({
				queryKey: createCommentsQueryOptions({ postId }).queryKey,
			});
			queryClient.invalidateQueries({
				queryKey: createPostQueryOptions({ id: postId }).queryKey,
			});
			queryClient.invalidateQueries({
				queryKey: createFeedPostsQueryOptions().queryKey,
			});
		},
	});
	return (
		<Button
			disabled={isPending}
			onClick={() => mutate()}
			size={"icon-sm"}
			type="button"
			variant={"outline"}
		>
			{isPending ? <Spinner /> : <Trash />}
		</Button>
	);
}
