import { Skeleton } from "@/components/ui/skeleton";

function UserListItemSkeleton() {
	return (
		<div className="flex items-center justify-between gap-4 px-4 py-5">
			<div className="flex flex-1 items-center gap-3">
				<Skeleton className="size-8 shrink-0 rounded-full" />

				<div className="flex flex-1 flex-col gap-2">
					<Skeleton className="h-3 w-32" />
					<Skeleton className="h-3 w-24" />
				</div>
			</div>

			<Skeleton className="size-8 shrink-0 rounded-md" />
		</div>
	);
}

type UsersListSkeletonProps = {
	count?: number;
};

export function UsersListSkeleton({ count = 10 }: UsersListSkeletonProps) {
	return (
		<div className="h-96 w-full overflow-hidden">
			{Array.from({ length: count }, (_, index) => (
				<UserListItemSkeleton key={index} />
			))}
		</div>
	);
}
