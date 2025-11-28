import { createFileRoute } from "@tanstack/react-router";
import { Suspense } from "react";
import { InfinitePosts } from "@/modules/posts/components/infinite-posts";
import { PostPreviewSkeleton } from "@/modules/posts/components/post-preview-skeleton";

export const Route = createFileRoute("/(authenticated)/$username/(profile)/")({
	component: RouteComponent,
});

function RouteComponent() {
	const { user } = Route.useRouteContext();
	return (
		<div className="">
			<Suspense
				fallback={
					<div className="space-y-4 py-10">
						{Array.from({ length: 10 }, (_, index) => (
							<PostPreviewSkeleton key={index.toString()} />
						))}
					</div>
				}
			>
				<InfinitePosts userId={user.id} />
			</Suspense>
		</div>
	)
}
