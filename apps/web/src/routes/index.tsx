import { createFileRoute } from "@tanstack/react-router";
import { InfinitePosts } from "@/modules/posts/components/infinite-posts";

export const Route = createFileRoute("/")({ component: App });

function App() {
	return (
		<div className="min-h-screen">
			<InfinitePosts />
		</div>
	);
}
