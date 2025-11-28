import {
	infiniteQueryOptions,
	queryOptions,
	type UseQueryOptions,
} from "@tanstack/react-query";
import type { Post, PostAPIResponse, PostQueryParams } from "@tawasull/shared";
import { getCookieHeaders } from "@/functions/auth";
import { getPostById } from "@/functions/post";
import { api } from "@/lib/ky";

export async function getPosts(
	queryOps: PostQueryParams = {}
): Promise<PostAPIResponse> {
	const { page, id } = queryOps;
	const queryParams = new URLSearchParams();

	if (page) queryParams.append("page", page.toString());

	if (id) queryParams.append("id", id);
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

export function createPostQueryOptions<TData = Post, TError = Error>(
	params: { id: string },
	options?: Omit<UseQueryOptions<Post, TError, TData>, "queryKey" | "queryFn">
) {
	return queryOptions({
		...options,
		queryKey: ["post", params],
		queryFn: () => getPostById({ data: params }),
	});
}

type FeedPostsQueryParams = {
	id?: string;
};

export function createFeedPostsQueryOptions(params: FeedPostsQueryParams = {}) {
	return infiniteQueryOptions({
		queryKey: ["posts", params],
		queryFn: ({ pageParam }) =>
			getPosts({ page: pageParam.toString(), id: params?.id ?? undefined }),
		initialPageParam: 1,
		getNextPageParam: (lastPage) =>
			lastPage.hasMore ? lastPage.currentPage + 1 : undefined,
	});
}
