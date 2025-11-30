import { Link, useNavigate } from "@tanstack/react-router";
import type { Post } from "@tawasull/shared";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import { Bookmark, Dot, MessageCircle, Repeat2 } from "lucide-react";
import { Avatar, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
	Card,
	CardContent,
	CardFooter,
	CardHeader,
} from "@/components/ui/card";
import GradientAvatar from "@/components/ui/gradient-avatar";
import { cn } from "@/lib/utils";
import { LikePost } from "./actions/like-post";
import { PostMediaPreview } from "./post-media";
import { PostMenu } from "./post-menu";

dayjs.extend(relativeTime);

type PostPreviewProps = {
	post: Post;
	asLink?: boolean;
};
export function PostPreview({ post, asLink = false }: PostPreviewProps) {
	const navigate = useNavigate();
	return (
		// <Card className="overflow-hidden">
		<Card className="gap-0 overflow-hidden">
			<CardHeader className="flex items-center justify-between">
				<div className="flex space-x-2">
					<Link
						className="relative"
						onClick={(e) => {
							e.preventDefault();
							e.stopPropagation();
						}}
						params={{ username: post.user.username }}
						to="/$username"
					>
						<Avatar className="">
							<AvatarImage
								alt={`@${post.user.username}`}
								className="h-11 w-11 object-cover"
								src={post.user.image ?? ""}
							/>

							<GradientAvatar letter={post.user.name[0]} />
						</Avatar>
						<Badge className="absolute right-01 bottom-0 m-0 h-3 w-3 rounded-full border-2 border-card bg-green-400 p-0" />
					</Link>
					<Link
						className="group flex flex-col space-y-1 text-xs"
						params={{ username: post.user.username }}
						to="/$username"
					>
						<p className="group-hover:underline">{post.user.name}</p>
						<span className="text-muted-foreground">@{post.user.username}</span>
					</Link>
					<div className="flex items-start justify-start space-x-1">
						<Dot className="size-4" />
						<span className="text-muted-foreground text-xs">
							{dayjs(post.createdAt).fromNow()}
						</span>
					</div>
				</div>

				<PostMenu post={post} />
			</CardHeader>
			<CardContent
				className={cn("py-6", asLink ? "cursor-pointer" : "cursor-default")}
				onClick={() => {
					if (asLink)
						navigate({
							to: "/$username/$postId",
							params: { username: post.user.username, postId: post.id },
						});
				}}
			>
				<p className="whitespace-pre-line">{post.content}</p>
				{post.media.length ? <PostMediaPreview media={post.media} /> : null}
			</CardContent>
			<hr />
			{/* <CardFooter className="flex items-center justify-between py-2"> */}
			<CardFooter className="flex items-center justify-between pt-4">
				<div className="flex items-center space-x-4 text-muted-foreground">
					<Button className="flex items-center" variant={"ghost"}>
						<MessageCircle className="" />
						<span className="text-xs">{post.comments}</span>
					</Button>
					<Button className="flex items-center" variant={"ghost"}>
						<Repeat2 className="" />
						<span className="text-xs">4</span>
					</Button>

					<LikePost
						count={post.likes}
						isLiked={post.isLiked}
						postId={post.id}
					/>
				</div>

				<div className="flex items-center space-x-4 text-muted-foreground">
					<Button variant={"ghost"}>
						<Bookmark className="" />
					</Button>
				</div>
			</CardFooter>
		</Card>
	);
}
