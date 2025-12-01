import { useSuspenseQuery } from "@tanstack/react-query";
import { ScrollArea } from "@/components/ui/scroll-area";
import { createUsersQueryOptions } from "../queries";
import { UserListItem } from "./user-list-item";

export function UsersList() {
	const { data } = useSuspenseQuery(
		createUsersQueryOptions({ limit: "10", page: "1" })
	);

	return (
		<div className="w-full">
			<ScrollArea className="h-96 overflow-hidden">
				{data.items.map((user) => (
					<UserListItem key={user.id} user={user} />
				))}
			</ScrollArea>
		</div>
	);
}
