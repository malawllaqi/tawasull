import { createFileRoute } from "@tanstack/react-router";
import { Suspense } from "react";
import { InfinitePosts } from "@/modules/posts/components/infinite-posts";
import { PostPreviewSkeleton } from "@/modules/posts/components/post-preview-skeleton";

export const Route = createFileRoute("/(authenticated)/home")({
	component: RouteComponent,
});

function RouteComponent() {
	return (
		<div className="min-h-screen">
			<Suspense
				fallback={
					<div className="py-10">
						<div className="mx-auto flex max-w-xl flex-col space-y-4">
							{Array.from({ length: 10 }, (_, index) => (
								<PostPreviewSkeleton key={index.toString()} />
							))}
						</div>
					</div>
				}
			>
				<InfinitePosts />
			</Suspense>
		</div>
	);
}
