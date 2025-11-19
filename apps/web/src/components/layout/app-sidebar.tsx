import { Link } from "@tanstack/react-router";
import {
	ChevronUp,
	GalleryVerticalEnd,
	SettingsIcon,
	User,
} from "lucide-react";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
	Sidebar,
	SidebarContent,
	SidebarFooter,
	SidebarGroup,
	SidebarGroupLabel,
	SidebarHeader,
	SidebarMenu,
	SidebarMenuButton,
	SidebarMenuItem,
} from "@/components/ui/sidebar";
import { authClient } from "@/lib/auth";
import { navItems, userMenuItems } from "@/lib/constants";
import SignOutBtn from "@/modules/auth/components/sign-out-btn";
import { Icons } from "../icons";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { Separator } from "../ui/separator";

export function AppSidebar() {
	const { data } = authClient.useSession();

	const defaultUser = {
		name: data?.user?.name || "John Doe",
		email: data?.user?.email || "john.doe@example.com",
		avatar: data?.user?.image || "",
	};
	return (
		<Sidebar collapsible="icon">
			<SidebarHeader>
				<SidebarMenu>
					<SidebarMenuItem>
						<SidebarMenuButton
							className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
							size="lg"
						>
							<div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-accent text-sidebar-primary-foreground">
								<GalleryVerticalEnd className="size-4" />
							</div>
							<div className="flex flex-col gap-0.5 leading-none">
								<span className="font-semibold">Tawasul</span>
								{/* <span className="">{selectedTenant.name}</span> */}
							</div>
						</SidebarMenuButton>
					</SidebarMenuItem>
				</SidebarMenu>
			</SidebarHeader>
			<Separator />
			<SidebarContent className="overflow-x-hidden">
				<SidebarGroup>
					<SidebarGroupLabel>Application</SidebarGroupLabel>
					<SidebarMenu>
						{navItems.map((item) => {
							const Icon = item.icon ? Icons[item.icon] : Icons.logo;

							return (
								<SidebarMenuItem key={item.title}>
									<SidebarMenuButton asChild>
										<Link
											activeOptions={{
												exact: true,
											}}
											activeProps={{
												className: "bg-accent",
											}}
											className="flex items-center gap-2"
											to={item.url}
										>
											<Icon />
											<span>{item.title}</span>
										</Link>
									</SidebarMenuButton>
								</SidebarMenuItem>
							);
						})}
					</SidebarMenu>
				</SidebarGroup>
			</SidebarContent>
			<SidebarFooter>
				<SidebarMenu>
					<SidebarMenuItem>
						<DropdownMenu>
							<DropdownMenuTrigger asChild>
								<SidebarMenuButton
									className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
									size="lg"
								>
									<Avatar className="h-8 w-8 rounded-lg">
										<AvatarImage
											alt={defaultUser.name}
											src={defaultUser.avatar}
										/>
										<AvatarFallback className="rounded-lg">
											{defaultUser.name.charAt(0).toUpperCase()}
										</AvatarFallback>
									</Avatar>
									<div className="grid flex-1 text-left text-sm leading-tight">
										<span className="truncate font-semibold">
											{defaultUser.name}
										</span>
										<span className="truncate text-xs">
											{defaultUser.email}
										</span>
									</div>
									<ChevronUp className="ml-auto size-4" />
								</SidebarMenuButton>
							</DropdownMenuTrigger>
							<DropdownMenuContent
								align="end"
								className="w-[--radix-dropdown-menu-trigger-width] min-w-56 rounded-lg"
								side="bottom"
								sideOffset={4}
							>
								{userMenuItems.map((item) => (
									<DropdownMenuItem asChild key={item.href}>
										{item.title === "Logout" ? (
											<SignOutBtn />
										) : (
											<Link className="flex items-center gap-2" to={item.href}>
												{item.title === "Profile" && (
													<User className="size-4" />
												)}
												{item.title === "Account Settings" && (
													<SettingsIcon className="size-4" />
												)}
												{item.title}
											</Link>
										)}
									</DropdownMenuItem>
								))}
							</DropdownMenuContent>
						</DropdownMenu>
					</SidebarMenuItem>
				</SidebarMenu>
			</SidebarFooter>
		</Sidebar>
	);
}
