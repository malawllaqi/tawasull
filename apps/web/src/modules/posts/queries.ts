import {
	infiniteQueryOptions,
	queryOptions,
	type UseQueryOptions,
} from "@tanstack/react-query";
import type { PostAPIResponse, PostQueryParams } from "@tawasull/shared";
import { getCookieHeaders } from "@/functions/auth";
import { api } from "@/lib/ky";

export async function getPosts(
	queryOps: PostQueryParams = {}
): Promise<PostAPIResponse> {
	const { page } = queryOps;
	const queryParams = new URLSearchParams();

	if (page) queryParams.append("page", page.toString());
	const queryString = queryParams.toString();
	try {
		const res = await api.get(`post${queryString ? `?${queryString}` : ""}`, {
			headers: await getCookieHeaders(),
		});

		return res.json();
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
