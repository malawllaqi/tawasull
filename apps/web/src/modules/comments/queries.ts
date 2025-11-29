import { queryOptions, type UseQueryOptions } from "@tanstack/react-query";
import type { Comment } from "@tawasull/shared";
import { getComments } from "@/functions/comment";

export function createCommentsQueryOptions<TData = Comment[], TError = Error>(
	params: { postId: string },
	options?: Omit<
		UseQueryOptions<Comment[], TError, TData>,
		"queryKey" | "queryFn"
	>
) {
	return queryOptions({
		...options,
		queryKey: ["comment", params],
		queryFn: () => getComments({ data: params }),
	});
}
