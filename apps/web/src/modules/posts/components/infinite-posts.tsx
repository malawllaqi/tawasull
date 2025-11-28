import { useSuspenseInfiniteQuery } from "@tanstack/react-query";
import { useEffect } from "react";
import { useIntersectionObserver } from "usehooks-ts";

import { Spinner } from "@/components/ui/spinner";
import { createFeedPostsQueryOptions } from "../queries";
import { PostPreview } from "./post-preview";

type InfinitePostsProps = {
	userId?: string;
};
export function InfinitePosts({ userId }: InfinitePostsProps) {
	const { data, fetchNextPage, isFetchingNextPage } = useSuspenseInfiniteQuery({
		...createFeedPostsQueryOptions({ id: userId }),
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
				? posts?.map((p) => <PostPreview asLink key={p.id} post={p} />)
				: null}
			{isFetchingNextPage ? (
				<div className="flex justify-center">
					<Spinner />
				</div>
			) : null}
			<div ref={ref} />
		</div>
	);
}
