import {
	Card,
	CardContent,
	CardFooter,
	CardHeader,
} from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

export function PostPreviewSkeleton() {
	return (
		<Card className="overflow-hidden">
			<CardHeader className="flex items-center justify-between">
				<div className="flex items-center space-x-4">
					<Skeleton className="h-11 w-11 rounded-full" />
					<div className="flex flex-col space-y-2">
						<Skeleton className="h-3 w-32" />
						<Skeleton className="h-3 w-24" />
					</div>
				</div>
				<Skeleton className="h-4 w-12 rounded-full" />
			</CardHeader>
			<CardContent className="space-y-4">
				<div className="space-y-2">
					<Skeleton className="h-4 w-full" />
					<Skeleton className="h-4 w-4/5" />
					<Skeleton className="h-4 w-3/5" />
				</div>
				<div className="grid grid-cols-2 gap-3">
					<Skeleton className="h-48 w-full rounded-2xl" />
					<Skeleton className="h-48 w-full rounded-2xl" />
				</div>
			</CardContent>
			<hr />
			<CardFooter className="flex items-center justify-between">
				<div className="flex space-x-4">
					<Skeleton className="h-7 w-7 rounded-full" />
					<Skeleton className="h-7 w-7 rounded-full" />
					<Skeleton className="h-7 w-7 rounded-full" />
				</div>
				<Skeleton className="h-7 w-7 rounded-full" />
			</CardFooter>
		</Card>
	);
}
