import type { NavItem } from "./types";

export const navItems: NavItem[] = [
	{
		title: "Home",
		url: "/home",
		icon: "home",
	},
	{
		title: "Groups",
		url: "/groups",
		icon: "group",
	},
	{
		title: "Messages",
		url: "/messages",
		icon: "message",
	},
	{
		title: "Settings",
		url: "/settings",
		icon: "settings",
	},
];

export const userMenuItems = [
	{
		title: "Profile",
		href: "/dashboard/profile",
	},
	{
		title: "Account Settings",
		href: "/dashboard/account",
	},
	{
		title: "Logout",
		href: "/logout",
	},
];
