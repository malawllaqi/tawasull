import { createFileRoute, Outlet, redirect } from "@tanstack/react-router";
import { authQueryOptions } from "@/modules/auth/queries";

export const Route = createFileRoute("/(auth-pages)")({
	beforeLoad: async ({ context }) => {
		const REDIRECT_URL = "/";
		const user = await context.queryClient.ensureQueryData({
			...authQueryOptions(),
			revalidateIfStale: true,
		});

		if (user) {
			throw redirect({
				to: REDIRECT_URL,
			});
		}

		return {
			redirectUrl: REDIRECT_URL,
		};
	},
	component: RouteComponent,
});

function RouteComponent() {
	return (
		<div className="h-screen w-full">
			<div className="h-full">
				<Outlet />
			</div>
		</div>
	);
}
