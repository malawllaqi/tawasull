import {
	createFileRoute,
	Link,
	Outlet,
	useLocation,
} from "@tanstack/react-router";
import { PageContainer } from "@/components/page-container";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { UserDetails } from "@/modules/users/components/user-details";
import { userDetailsQueryOptions } from "@/modules/users/queries";

export const Route = createFileRoute("/(authenticated)/$username/(profile)")({
	component: RouteComponent,
	beforeLoad: async ({ context, params }) => {
		const user = await context.queryClient.ensureQueryData({
			...userDetailsQueryOptions({ username: params.username }),
		})

		return { user };
	},
});

function RouteComponent() {
	const { user } = Route.useRouteContext();
	const location = useLocation();

	return (
		<div>
			<div className="relative h-36 w-full bg-accent" />
			<UserDetails user={user} />
			{/* <Separator className="my-4" /> */}
			<div className="px-10 pt-6">
				<Tabs className="" defaultValue={location.pathname}>
					<TabsList className="w-full">
						<TabsTrigger className="" value={`/${user.username}`}>
							<Link
								className="w-full"
								params={{ username: user.username }}
								to="/$username"
							>
								Posts
							</Link>
						</TabsTrigger>
						<TabsTrigger className="" value={`/${user.username}/likes`}>
							<Link
								className="w-full"
								params={{ username: user.username }}
								to="/$username/likes"
							>
								Likes
							</Link>
						</TabsTrigger>
					</TabsList>
				</Tabs>
			</div>

			<PageContainer maxWidth="2xl">
				<Outlet />
			</PageContainer>
		</div>
	)
}
