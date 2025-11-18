import { createFileRoute } from "@tanstack/react-router";
import { InfinitePosts } from "@/modules/posts/components/infinite-posts";

export const Route = createFileRoute("/(authenticated)/home")({
	component: RouteComponent,
});

function RouteComponent() {
	return (
		<div className="min-h-screen">
			<InfinitePosts />
		</div>
	);
}
