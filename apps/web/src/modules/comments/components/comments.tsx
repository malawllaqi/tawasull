import { useSuspenseQuery } from "@tanstack/react-query";
import { Link } from "@tanstack/react-router";
import type { Comment } from "@tawasull/shared";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import { Dot } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { UserAvatarProfile } from "@/components/user-avatar-profile";
import { createCommentsQueryOptions } from "../queries";

dayjs.extend(relativeTime);

type CommentsProps = {
	postId: string;
};
export const DUMMY: Comment[] = [
	{
		id: "cmt-1",
		content: "This is an awesome post! Really enjoyed reading it.",
		postId: "post-1",
		createdAt: new Date(),
		updatedAt: new Date(),
		user: {
			name: "Mohamed Ali",
			image: "https://example.com/avatar1.png",
			username: "mohamed_dev",
		},
	},
	{
		id: "cmt-2",
		content: "Thanks for sharing this, super helpful!",
		postId: "post-1",
		createdAt: new Date(),
		updatedAt: new Date(),
		user: {
			name: "Sara Khan",
			image: null,
			username: "sarak",
		},
	},
	{
		id: "cmt-3",
		content: "I think there’s a better approach for this. Want me to share?",
		postId: "post-2",
		createdAt: new Date(),
		updatedAt: new Date(),
		user: {
			name: "John Doe",
			image: "https://example.com/avatar3.png",
			username: "johnny",
		},
	},
	{
		id: "cmt-4",
		content: "Clean and simple explanation. Appreciate it.",
		postId: "post-3",
		createdAt: new Date(),
		updatedAt: new Date(),
		user: {
			name: "Aisha Ahmed",
			image: null,
			username: "aisha.codes",
		},
	},
	{
		id: "cmt-5",
		content: "Can you make a follow-up post on this topic?",
		postId: "post-1",
		createdAt: new Date(),
		updatedAt: new Date(),
		user: {
			name: "Leo Martin",
			image: "https://example.com/avatar5.png",
			username: "leom",
		},
	},
];

export function Comments({ postId }: CommentsProps) {
	const { data } = useSuspenseQuery({
		...createCommentsQueryOptions({ postId }),
	});

	return (
		<div className="space-y-4">
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
		</div>
	);
}
