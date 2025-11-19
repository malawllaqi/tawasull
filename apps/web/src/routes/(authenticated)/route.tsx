import { createFileRoute, Outlet, redirect } from "@tanstack/react-router";
import { AppSidebar } from "@/components/layout/app-sidebar";
import { SiteHeader } from "@/components/layout/site-header";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { authQueryOptions } from "@/modules/auth/queries";

export const Route = createFileRoute("/(authenticated)")({
	component: AppLayout,
	beforeLoad: async ({ context }) => {
		const user = await context.queryClient.ensureQueryData({
			...authQueryOptions(),
			revalidateIfStale: true,
		});

		if (!user) {
			throw redirect({ to: "/login" });
		}

		return { user };
	},
});

export function AppLayout() {
	return (
		<div className="">
			<SidebarProvider>
				<AppSidebar />
				<SidebarInset>
					<SiteHeader />
					<main className="flex">
						<div className="flex-1">
							<Outlet />
						</div>
						<div className="w-64 bg-card" />
					</main>
				</SidebarInset>
			</SidebarProvider>
		</div>
	);
}
