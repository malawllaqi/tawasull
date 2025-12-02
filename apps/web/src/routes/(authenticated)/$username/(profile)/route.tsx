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
			revalidateIfStale: true,
		});

		return { user };
	},
});

function RouteComponent() {
	const { username } = Route.useParams();
	const location = useLocation();

	return (
		<div>
			<div className="relative h-36 w-full bg-accent" />
			<UserDetails username={username} />
			{/* <Separator className="my-4" /> */}
			<div className="px-10 pt-6">
				<Tabs className="" defaultValue={location.pathname}>
					<TabsList className="w-full">
						<TabsTrigger className="" value={`/${username}`}>
							<Link className="w-full" params={{ username }} to="/$username">
								Posts
							</Link>
						</TabsTrigger>
						<TabsTrigger className="" value={`/${username}/likes`}>
							<Link
								className="w-full"
								params={{ username }}
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
	);
}
