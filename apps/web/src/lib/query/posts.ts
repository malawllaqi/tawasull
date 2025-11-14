import {
	infiniteQueryOptions,
	queryOptions,
	type UseQueryOptions,
} from "@tanstack/react-query";
import type { PostAPIResponse, PostQueryParams } from "@tawasull/shared";
import axios from "axios";

async function getPosts(
	// queryOps: { page?: number } = {}
	queryOps: PostQueryParams = {}
): Promise<PostAPIResponse> {
	const { page } = queryOps;
	const queryParams = new URLSearchParams();

	if (page) queryParams.append("page", page.toString());
	const queryString = queryParams.toString();
	try {
		const response = await axios.get(
			`http://localhost:3001/api/v1/post${queryString ? `?${queryString}` : ""}`
		);

		return response.data;
	} catch (err) {
		console.log(err);
		throw err;
	}
}

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
