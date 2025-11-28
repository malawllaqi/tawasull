import { createFileRoute, Outlet, redirect } from "@tanstack/react-router";
import { AppSidebar } from "@/components/layout/app-sidebar";
import { ThemeToggle } from "@/components/layout/theme-toggle";
import { UserNav } from "@/components/layout/user-nav";
import { Separator } from "@/components/ui/separator";
import {
	SidebarInset,
	SidebarProvider,
	SidebarTrigger,
} from "@/components/ui/sidebar";
import { authQueryOptions } from "@/modules/auth/queries";

export const Route = createFileRoute("/(authenticated)")({
	component: AppLayout,
	beforeLoad: async ({ context }) => {
		const currentUser = await context.queryClient.ensureQueryData({
			...authQueryOptions(),
			revalidateIfStale: true,
		});

		if (!currentUser) {
			throw redirect({ to: "/login" });
		}

		return { currentUser: currentUser.user };
	},
});

export function AppLayout() {
	const { currentUser } = Route.useRouteContext();
	return (
		<SidebarProvider>
			<AppSidebar currentUser={currentUser} />
			<SidebarInset>
				<header className="sticky top-0 z-10 flex h-16 shrink-0 items-center justify-between gap-2 border-b bg-sidebar transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-12">
					<div className="flex items-center gap-2 px-4">
						<SidebarTrigger className="-ml-1" />
						<Separator className="mr-2 h-4" orientation="vertical" />
					</div>

					<div className="flex items-center gap-2 px-4">
						<div className="hidden md:flex" />
						<UserNav currentUser={currentUser} />
						<ThemeToggle />
					</div>
				</header>
				<main className="flex">
					<div className="flex-1 px-10 md:px-0">
						<Outlet />
					</div>
					<div className="sticky top-16 hidden h-[calc(100vh-(--spacing(16)))] w-64 bg-card md:flex" />
				</main>
			</SidebarInset>
		</SidebarProvider>
	);
}
