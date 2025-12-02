import { useSuspenseQuery } from "@tanstack/react-query";
import { MoreHorizontal, Plus, Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import { UserAvatarProfile } from "@/components/user-avatar-profile";
import { useFollows } from "../hooks/use-follows";
import { userDetailsQueryOptions } from "../queries";

interface UserDetailsProps {
	// user: User;
	username: string;
}
export function UserDetails({ username }: UserDetailsProps) {
	const { data } = useSuspenseQuery({
		...userDetailsQueryOptions({ username }),
	});
	const { mutate, isPending } = useFollows(data);

	return (
		<div className="">
			<div className="relative size-20">
				<div className="-top-10 absolute left-10">
					<UserAvatarProfile
						className="object-cover"
						name={data.name}
						size={"3xl"}
						url={data.image}
					/>
				</div>
			</div>
			<div className="flex flex-col space-y-2 px-10">
				<div className="">
					<h4 className="">{data.name}</h4>
					<p className="text-muted-foreground text-xs">@{data.username}</p>
				</div>
				<p className="font-bold text-xs">232 Followers</p>
				<div className="mt-4 flex items-center space-x-4">
					<Button
						className="min-w-24"
						disabled={isPending}
						onClick={() => mutate()}
						type="button"
						variant={data.isFollowing ? "destructive" : "default"}
					>
						{data.isFollowing ? (
							"Unfollow"
						) : (
							<>
								<Plus className="mr-1 inline" />
								Follow
							</>
						)}
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
