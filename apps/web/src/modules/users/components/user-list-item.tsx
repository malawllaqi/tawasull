import { Link } from "@tanstack/react-router";
import type { User } from "@tawasull/shared";
import { UserMinusIcon, UserPlusIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { UserAvatarProfile } from "@/components/user-avatar-profile";
import { useFollows } from "../hooks/use-follows";

type UserListItemProps = {
	user: User;
};

export function UserListItem({ user }: UserListItemProps) {
	const { mutate, isPending } = useFollows(user);
	return (
		<Link
			className="flex items-center justify-between gap-4 px-4 py-5 transition-colors hover:bg-accent/50"
			params={{ username: user.username }}
			to="/$username"
		>
			<div className="flex flex-1 items-center gap-3">
				<UserAvatarProfile name={user.name} size={"sm"} url={user.image} />

				<div className="flex flex-1 flex-col">
					<p className="truncate font-medium text-xs">{user.name}</p>
					<span className="truncate text-muted-foreground text-xs">
						@{user.username}
					</span>
				</div>
			</div>

			<Button
				disabled={isPending}
				onClick={(e) => {
					e.preventDefault();
					e.stopPropagation();
					mutate();
				}}
				size="icon-sm"
				type="button"
				variant={"outline"}
			>
				{user.isFollowing ? (
					<UserMinusIcon className="text-red-400" />
				) : (
					<UserPlusIcon />
				)}
			</Button>
		</Link>
	);
}
