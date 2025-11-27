import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/(authenticated)/$userId/likes")({
	component: RouteComponent,
});

function RouteComponent() {
	return <div>Hello "/(authenticated)/$user/likes"!</div>;
}
