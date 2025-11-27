import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/(authenticated)/$userId/")({
	component: RouteComponent,
});

function RouteComponent() {
	const {
		user: { user },
	} = Route.useRouteContext();

	return (
		<div className="">
			<p>hey</p>
		</div>
	);
}
