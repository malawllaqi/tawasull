import { createFileRoute, redirect } from "@tanstack/react-router";

export const Route = createFileRoute("/(authenticated)/settings/")({
	beforeLoad: () => {
		throw redirect({
			to: "/settings/profile",
		})
	},
});
