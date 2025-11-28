import type { Session } from "@tawasull/auth";
import type { Icons } from "@/components/icons";

export interface NavItem {
	title: string;
	url: string;
	disabled?: boolean;
	icon: keyof typeof Icons;
	isActive?: boolean;
}

export type CurrentUserProps = {
	currentUser: Session["user"];
};
