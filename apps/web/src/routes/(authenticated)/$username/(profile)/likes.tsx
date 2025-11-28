import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/(authenticated)/$username/(profile)/likes")({
	component: RouteComponent,
});

function RouteComponent() {
	return <div>Hello "/(authenticated)/$user/likes"!</div>;
}
