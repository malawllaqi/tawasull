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
import { navItems, userMenuItems } from "@/lib/constants";
import type { CurrentUserProps } from "@/lib/types";
import SignOutBtn from "@/modules/auth/components/sign-out-btn";
import { Icons } from "../icons";
import { Separator } from "../ui/separator";
import { UserAvatarProfile } from "../user-avatar-profile";

type AppSidebarProps = {} & CurrentUserProps;
export function AppSidebar({ currentUser }: AppSidebarProps) {
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
									<UserAvatarProfile
										className="size-8 rounded-lg"
										name={currentUser.name}
										url={currentUser.image}
									/>
									<div className="grid flex-1 text-left text-sm leading-tight">
										<span className="truncate font-semibold">
											{currentUser.name}
										</span>
										<span className="truncate text-xs">
											{currentUser.email}
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
