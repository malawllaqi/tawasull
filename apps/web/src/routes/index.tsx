import { useInfiniteQuery } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Spinner } from "@/components/ui/spinner";
import { createPostsInfiniteQueryOptions } from "@/lib/query/posts";

export const Route = createFileRoute("/")({ component: App });

function App() {
	const { data, hasNextPage, fetchNextPage, isFetchingNextPage } =
		useInfiniteQuery(createPostsInfiniteQueryOptions());

	const posts = data?.pages.flatMap((page) => page.items);

	return (
		<div className="min-h-screen">
			<div className="mx-auto flex max-w-xl flex-col space-y-4 py-10">
				{posts?.map((post) => (
					<Card key={post.id}>
						<CardContent>
							<p>{post.content}</p>
						</CardContent>
					</Card>
				))}
				{hasNextPage ? (
					<Button disabled={isFetchingNextPage} onClick={() => fetchNextPage()}>
						{isFetchingNextPage ? <Spinner /> : "Load more posts"}
					</Button>
				) : null}
			</div>
		</div>
	);
}
