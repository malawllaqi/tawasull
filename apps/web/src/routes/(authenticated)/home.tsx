import { createFileRoute } from "@tanstack/react-router";
import { Suspense } from "react";
import { CreatePost } from "@/modules/posts/components/create-post";
import { InfinitePosts } from "@/modules/posts/components/infinite-posts";
import { PostPreviewSkeleton } from "@/modules/posts/components/post-preview-skeleton";

export const Route = createFileRoute("/(authenticated)/home")({
	component: RouteComponent,
});

function RouteComponent() {
	return (
		<div className="min-h-screen">
			<div className="mx-auto flex max-w-2xl flex-col space-y-4 py-10">
				<CreatePost />
				<Suspense
					fallback={
						<div className="space-y-4 py-10">
							{Array.from({ length: 10 }, (_, index) => (
								<PostPreviewSkeleton key={index.toString()} />
							))}
						</div>
					}
				>
					<InfinitePosts />
				</Suspense>
			</div>
		</div>
	);
}
