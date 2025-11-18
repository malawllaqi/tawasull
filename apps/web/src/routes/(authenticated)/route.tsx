import { createFileRoute, Outlet, redirect } from "@tanstack/react-router";
import { SiteHeader } from "@/components/layout/site-header";
import { authQueryOptions } from "@/modules/auth/queries";

export const Route = createFileRoute("/(authenticated)")({
	component: AppLayout,
	beforeLoad: async ({ context }) => {
		const user = await context.queryClient.ensureQueryData({
			...authQueryOptions(),
			revalidateIfStale: true,
		});

		console.log(user);
		if (!user) {
			throw redirect({ to: "/login" });
		}

		return { user };
	},
});

export function AppLayout() {
	return (
		<div className="">
			<SiteHeader />
			<Outlet />
		</div>
	);
}
