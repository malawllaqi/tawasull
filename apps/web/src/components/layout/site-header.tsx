import SignOutBtn from "@/modules/auth/components/sign-out-btn";
import { ThemeToggle } from "./theme-toggle";

export function SiteHeader() {
	return (
		<div className="flex items-center justify-between p-4">
			<div className="" />
			<div className="flex items-center space-x-4">
				<SignOutBtn />
				<ThemeToggle />
			</div>
		</div>
	);
}
