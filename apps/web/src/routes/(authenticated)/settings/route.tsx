import { createFileRoute, Link } from "@tanstack/react-router";
import type { PropsWithChildren } from "react";
import { PageContainer } from "@/components/page-container";
import { buttonVariants } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";
export const Route = createFileRoute("/(authenticated)/settings")({
	component: RouteComponent,
});

function RouteComponent() {
	return (
		<SettingsLayout>
			<div className="">page</div>
		</SettingsLayout>
	);
}

const sidebarNavItems: { title: string; href: string }[] = [
	{
		title: "Profile",
		href: "/settings/profile",
	},
	{
		title: "Password",
		href: "/settings/password",
	},
	{
		title: "Appearance",
		href: "/settings/appearance",
	},
];

export default function SettingsLayout({ children }: PropsWithChildren) {
	return (
		<PageContainer className="" maxWidth="3xl">
			<div className="mb-8 space-y-0.5">
				<h2 className="font-semibold text-xl tracking-tight">Settings</h2>
				<p className="text-muted-foreground text-sm">
					Manage your profile and account settings
				</p>
			</div>
			<div className="flex min-h-screen flex-col space-y-8 lg:flex-row lg:space-x-12 lg:space-y-0">
				<aside className="w-full max-w-xl lg:w-48">
					<nav className="flex flex-col space-x-0 space-y-1">
						{sidebarNavItems.map((item, index) => (
							<Link
								activeOptions={{
									exact: true,
								}}
								activeProps={{
									className: "bg-accent",
								}}
								className={cn(
									buttonVariants({ variant: "ghost", size: "sm" }),
									"w-full justify-start"
								)}
								key={`${item.href}-${index}`}
								to={item.href}
							>
								{item.title}
							</Link>
						))}
					</nav>
				</aside>

				<Separator className="my-6 md:hidden" />

				<div className="flex-1 md:max-w-2xl">
					<section className="max-w-xl space-y-12">{children}</section>
				</div>
			</div>
		</PageContainer>
	);
}
