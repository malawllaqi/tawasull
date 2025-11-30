import { useSuspenseQuery } from "@tanstack/react-query";
import { Link } from "@tanstack/react-router";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import { Dot } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { UserAvatarProfile } from "@/components/user-avatar-profile";
import { createCommentsQueryOptions } from "../queries";
import { DeleteComment } from "./delete-comment";

dayjs.extend(relativeTime);

type CommentsProps = {
	postId: string;
};

export function Comments({ postId }: CommentsProps) {
	const { data } = useSuspenseQuery({
		...createCommentsQueryOptions({ postId }),
	});

	if (data.length < 1) {
		return (
			<Card className="my-6">
				<CardContent className="py-6">
					<p className="text-center text-muted-foreground text-sm">
						No comments yet. Be the first to comment!
					</p>
				</CardContent>
			</Card>
		);
	}

	return (
		<Card className="my-6 py-0">
			<CardContent className="px-0 pt-2">
				{data.map((comment) => (
					<div key={comment.id}>
						<div className="space-y-2 px-4 py-6">
							<div className="flex items-center justify-between gap-6 pb-2">
								<div className="flex space-x-2">
									<Link
										className="relative"
										onClick={(e) => {
											e.preventDefault();
											e.stopPropagation();
										}}
										params={{ username: comment.user.username }}
										to="/$username"
									>
										<UserAvatarProfile
											name={comment.user.name}
											url={comment.user.image}
										/>
									</Link>
									<Link
										className="group flex flex-col space-y-0.5 text-xs"
										params={{ username: comment.user.username }}
										to="/$username"
									>
										<p className="font-medium group-hover:underline">
											{comment.user.name}
										</p>
										<span className="text-muted-foreground">
											@{comment.user.username}
										</span>
									</Link>
									<div className="flex space-x-1">
										<Dot className="size-3" />
										<span className="text-muted-foreground text-xs">
											{dayjs(comment.createdAt).fromNow()}
										</span>
									</div>
								</div>
								<DeleteComment commentId={comment.id} postId={comment.postId} />
							</div>

							<p className="ml-1 whitespace-pre-wrap text-sm">
								{comment.content}
							</p>
						</div>
						<Separator />
					</div>
				))}
			</CardContent>
		</Card>
	);
}
