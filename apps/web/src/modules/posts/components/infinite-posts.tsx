import { useSuspenseInfiniteQuery } from "@tanstack/react-query";
import { useEffect } from "react";
import { useIntersectionObserver } from "usehooks-ts";

import { Spinner } from "@/components/ui/spinner";
import { createPostsInfiniteQueryOptions } from "../queries";
import { PostPreview } from "./post-preview";

// type InfinitePostsProps = {};
export function InfinitePosts() {
	const { data, fetchNextPage, isFetchingNextPage } = useSuspenseInfiniteQuery({
		...createPostsInfiniteQueryOptions(),
	});
	const { isIntersecting, ref } = useIntersectionObserver({
		threshold: 0.5,
	});

	const posts = data?.pages.flatMap((page) => page.items);

	useEffect(() => {
		if (isIntersecting) {
			fetchNextPage();
		}
	}, [fetchNextPage, isIntersecting]);

	return (
		<div className="space-y-4 py-10">
			{posts?.length
				? posts?.map((p) => <PostPreview key={p.id} post={p} />)
				: null}
			{isFetchingNextPage ? <Spinner /> : null}
			<div ref={ref} />
		</div>
	);
}
