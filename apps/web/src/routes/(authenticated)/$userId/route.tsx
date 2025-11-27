import {
	createFileRoute,
	Link,
	Outlet,
	useLocation,
} from "@tanstack/react-router";
import { MoreHorizontal, Plus, Send } from "lucide-react";
import { PageContainer } from "@/components/page-container";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { UserAvatarProfile } from "@/components/user-avatar-profile";

export const Route = createFileRoute("/(authenticated)/$userId")({
	component: RouteComponent,
});

function RouteComponent() {
	const {
		user: { user },
	} = Route.useRouteContext();
	const location = useLocation();

	return (
		<div>
			<div className="relative h-36 w-full bg-accent" />
			<div className="relative size-20">
				<div className="-top-10 absolute left-10">
					<UserAvatarProfile className="size-24 object-cover" user={user} />
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
			{/* <Separator className="my-4" /> */}
			<PageContainer maxWidth="3xl">
				<Tabs className="" defaultValue={location.pathname}>
					<TabsList className="w-full">
						<TabsTrigger className="" value={`/${user.username}`}>
							<Link
								className="w-full"
								params={{ userId: user.username }}
								to="/$userId"
							>
								Posts
							</Link>
						</TabsTrigger>
						<TabsTrigger className="" value={`/${user.username}/likes`}>
							<Link
								className="w-full"
								params={{ userId: user.username }}
								to="/$userId/likes"
							>
								Likes
							</Link>
						</TabsTrigger>
					</TabsList>
					<Outlet />
				</Tabs>
			</PageContainer>
		</div>
	);
}
