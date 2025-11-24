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
		<SidebarProvider>
			<AppSidebar />
			<SidebarInset>
				<header className="flex h-16 shrink-0 items-center justify-between gap-2 border-b bg-sidebar transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-12">
					<div className="flex items-center gap-2 px-4">
						<SidebarTrigger className="-ml-1" />
						<Separator className="mr-2 h-4" orientation="vertical" />
					</div>

					<div className="flex items-center gap-2 px-4">
						<div className="hidden md:flex" />
						<UserNav />
						<ThemeToggle />
					</div>
				</header>
				<main className="flex">
					<div className="flex-1 px-10 md:px-0">
						<Outlet />
					</div>
					<div className="hidden w-64 bg-card md:flex" />
				</main>
			</SidebarInset>
		</SidebarProvider>
	);
}
