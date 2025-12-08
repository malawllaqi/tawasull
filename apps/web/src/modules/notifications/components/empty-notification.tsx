import { Bell } from "lucide-react";
import {
	Empty,
	EmptyDescription,
	EmptyHeader,
	EmptyMedia,
	EmptyTitle,
} from "@/components/ui/empty";
export function EmptyNotifications() {
	return (
		<div className="flex h-[400px] items-center justify-center p-6">
			<Empty>
				<EmptyHeader>
					<EmptyMedia variant="icon">
						<Bell className="size-6" />
					</EmptyMedia>
					<EmptyTitle>No notifications</EmptyTitle>
					<EmptyDescription>
						You&apos;re all caught up! When you receive notifications,
						they&apos;ll appear here.
					</EmptyDescription>
				</EmptyHeader>
			</Empty>
		</div>
	);
}
