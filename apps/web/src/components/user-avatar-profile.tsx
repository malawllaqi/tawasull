import type { Session } from "@tawasull/auth";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

interface UserAvatarProfileProps {
	className?: string;
	showInfo?: boolean;
	user: Session["user"];
}

export function UserAvatarProfile({
	className,
	showInfo = false,
	user,
}: UserAvatarProfileProps) {
	return (
		<div className="flex gap-2">
			<Avatar className={className}>
				<AvatarImage alt={user?.name || ""} src={user?.image || ""} />
				<AvatarFallback className="rounded-lg">
					{user?.name?.slice(0, 2)?.toUpperCase() || "CN"}
				</AvatarFallback>
			</Avatar>

			{showInfo && (
				<div className="flex flex-1 flex-col space-y-1 text-sm">
					<span className="truncate font-semibold">{user?.name || ""}</span>
					<span className="truncate text-xs">@{user?.username || ""}</span>
				</div>
			)}
		</div>
	);
}
