import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";

export function CommentSkeleton() {
	return (
		<Card className="my-6 py-0">
			<CardContent className="px-0 pt-2">
				{Array.from({ length: 3 }).map((_, index) => (
					<div key={index}>
						<div className="space-y-2 px-4 py-6">
							<div className="flex items-center justify-between gap-6 pb-2">
								<div className="flex space-x-2">
									<Skeleton className="size-10 rounded-full" />
									<div className="flex flex-col space-y-2">
										<Skeleton className="h-4 w-32" />
										<Skeleton className="h-3 w-20" />
									</div>
									<div className="flex space-x-1">
										<div className="size-3 rounded-full bg-accent" />
										<Skeleton className="h-3 w-16" />
									</div>
								</div>
							</div>

							<Skeleton className="ml-1 h-4 w-60" />
							<Skeleton className="ml-1 h-4 w-44" />
						</div>
						{index < 2 && <Separator />}
					</div>
				))}
			</CardContent>
		</Card>
	);
}
