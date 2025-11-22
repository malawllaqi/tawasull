import type { Icons } from "@/components/icons";

export interface NavItem {
	title: string;
	url: string;
	disabled?: boolean;
	icon: keyof typeof Icons;
	isActive?: boolean;
}
