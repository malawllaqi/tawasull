import { createFileRoute, Outlet, redirect } from "@tanstack/react-router";
import { Suspense } from "react";
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
import { AppNotifications } from "@/modules/notifications/components/app-notifications";
import { NotificationSkeleton } from "@/modules/notifications/components/notification-skeleton";
import { UsersList } from "@/modules/users/components/users-list";
import { UsersListSkeleton } from "@/modules/users/components/users-list-skeleton";

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
						<ThemeToggle />
						<Suspense fallback={<NotificationSkeleton />}>
							<AppNotifications currentUser={currentUser} />
						</Suspense>
						<UserNav currentUser={currentUser} />
					</div>
				</header>
				<main className="flex">
					<div className="flex-1 px-10 md:px-0">
						<Outlet />
					</div>
					<div className="sticky top-16 hidden h-[calc(100vh-(--spacing(16)))] w-72 flex-col bg-card md:flex">
						<p className="px-4 pt-4 pb-2 font-bold text-muted-foreground text-sm">
							Who To Follow
						</p>
						<Suspense fallback={<UsersListSkeleton />}>
							<UsersList />
						</Suspense>
						<Separator />
					</div>
				</main>
			</SidebarInset>
		</SidebarProvider>
	);
}
