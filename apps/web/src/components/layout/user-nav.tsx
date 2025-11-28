import { useQueryClient } from "@tanstack/react-query";
import { useRouter } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuGroup,
	DropdownMenuItem,
	DropdownMenuLabel,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { authClient } from "@/lib/auth";
import type { CurrentUserProps } from "@/lib/types";
import { authQueryOptions } from "@/modules/auth/queries";
import { UserAvatarProfile } from "../user-avatar-profile";

// interface UserNavProps {
// 	user?: {
// 		name: string;
// 		email: string;
// 		avatar?: string;
// 	};
// }

type UserNavProps = {} & CurrentUserProps;

export function UserNav({ currentUser }: UserNavProps) {
	const { data } = authClient.useSession();
	const queryClient = useQueryClient();
	const router = useRouter();

	const handleLogout = async () => {
		await authClient.signOut();
		await queryClient.invalidateQueries({
			queryKey: authQueryOptions().queryKey,
		});
		router.invalidate();
	};

	return (
		<DropdownMenu>
			<DropdownMenuTrigger asChild>
				<Button className="relative h-8 w-8 rounded-full" variant="ghost">
					<UserAvatarProfile
						name={currentUser.name}
						size={"xs"}
						url={currentUser.image}
					/>
				</Button>
			</DropdownMenuTrigger>
			<DropdownMenuContent align="end" className="w-56" forceMount>
				<DropdownMenuLabel className="font-normal">
					<div className="flex flex-col space-y-1">
						<p className="font-medium text-sm leading-none">
							{data?.user?.name}
						</p>
						<p className="text-muted-foreground text-xs leading-none">
							{data?.user?.email}
						</p>
					</div>
				</DropdownMenuLabel>
				<DropdownMenuSeparator />
				<DropdownMenuGroup>
					<DropdownMenuItem>Profile</DropdownMenuItem>
					<DropdownMenuItem>Settings</DropdownMenuItem>
				</DropdownMenuGroup>
				<DropdownMenuSeparator />
				<DropdownMenuItem onClick={handleLogout}>Log out</DropdownMenuItem>
			</DropdownMenuContent>
		</DropdownMenu>
	);
}
