import { Skeleton } from "@/components/ui/skeleton";

export function NotificationSkeleton() {
	return (
		<div className="flex items-start gap-3">
			<Skeleton className="size-9 shrink-0 rounded-md" />
		</div>
	);
}
