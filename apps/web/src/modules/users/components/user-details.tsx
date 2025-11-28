import type { User } from "@tawasull/shared";
import { MoreHorizontal, Plus, Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import { UserAvatarProfile } from "@/components/user-avatar-profile";

interface UserDetailsProps {
	user: User;
}
export function UserDetails({ user }: UserDetailsProps) {
	return (
		<div className="">
			<div className="relative size-20">
				<div className="-top-10 absolute left-10">
					<UserAvatarProfile
						className="object-cover"
						name={user.name}
						size={"3xl"}
						url={user.image}
					/>
				</div>
			</div>
			<div className="flex flex-col space-y-2 px-10">
				<div className="">
					<h4 className="">{user.name}</h4>
					<p className="text-muted-foreground text-xs">@{user.username}</p>
				</div>
				<p className="font-bold text-xs">232 Followers</p>
				<div className="mt-4 flex items-center space-x-4">
					<Button className="min-w-24">
						<Plus /> Follow
					</Button>
					<Button className="min-w-24" variant={"outline"}>
						<Send /> Message
					</Button>
					<Button size={"icon-sm"} variant={"outline"}>
						<MoreHorizontal />
					</Button>
				</div>
			</div>
		</div>
	);
}
