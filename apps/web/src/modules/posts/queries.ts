import {
	infiniteQueryOptions,
	queryOptions,
	type UseQueryOptions,
} from "@tanstack/react-query";
import type { PostAPIResponse, PostQueryParams } from "@tawasull/shared";
import { getPosts } from "./functions";

export function createPostsQueryOptions<
	TData = PostAPIResponse,
	TError = Error,
>(
	params?: PostQueryParams,
	options?: Omit<
		UseQueryOptions<PostAPIResponse, TError, TData>,
		"queryKey" | "queryFn"
	>
) {
	return queryOptions({
		...options,
		queryKey: ["posts", params],
		queryFn: () => getPosts(),
	});
}

export function createPostsInfiniteQueryOptions() {
	return infiniteQueryOptions({
		queryKey: ["posts"],
		queryFn: ({ pageParam }) => getPosts({ page: pageParam.toString() }),
		initialPageParam: 1,
		getNextPageParam: (lastPage) =>
			lastPage.hasMore ? lastPage.currentPage + 1 : undefined,
	});
}
