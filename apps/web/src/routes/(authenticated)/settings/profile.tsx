import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/(authenticated)/settings/profile")({
	component: RouteComponent,
});

function RouteComponent() {
	return <div>Hello "/(authenticated)/settings/profile"!</div>;
}
