import { useInfiniteQuery } from "@tanstack/react-query";
import { useEffect } from "react";
import { useInView } from "react-intersection-observer";
import { Spinner } from "@/components/ui/spinner";
import { createPostsInfiniteQueryOptions } from "../lib/query";
import { PostPreview } from "./post-preview";

// type InfinitePostsProps = {};
export function InfinitePosts() {
	const { data, fetchNextPage, isFetchingNextPage } = useInfiniteQuery(
		createPostsInfiniteQueryOptions()
	);

	const { ref, inView } = useInView({});
	const posts = data?.pages.flatMap((page) => page.items);

	useEffect(() => {
		if (inView) {
			fetchNextPage();
		}
	}, [fetchNextPage, inView]);

	return (
		<div className="py-10">
			<div className="mx-auto flex max-w-xl flex-col space-y-4">
				{posts?.length
					? posts?.map((p) => <PostPreview key={p.id} post={p} />)
					: null}
			</div>
			{isFetchingNextPage ? <Spinner /> : null}
			<div ref={ref} />
		</div>
	);
}
