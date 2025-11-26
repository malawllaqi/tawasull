import type { Post } from "@tawasull/shared";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import { Bookmark, Dot, Heart, MessageCircle, Repeat2 } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
	Card,
	CardContent,
	CardFooter,
	CardHeader,
} from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { PostMenu } from "./post-menu";

dayjs.extend(relativeTime);

type PostPreviewProps = {
	post: Post;
};
export function PostPreview({ post }: PostPreviewProps) {
	return (
		<Card className="overflow-hidden">
			<CardHeader className="flex items-center justify-between">
				<div className="flex space-x-2">
					<div className="relative">
						<Avatar className="">
							<AvatarImage
								alt={`@${post.user.username}`}
								className="h-11 w-11 object-cover"
								src={post.user.image ?? ""}
							/>
							<AvatarFallback className="uppercase">
								{post.user.name[0]}
							</AvatarFallback>
						</Avatar>
						<Badge className="absolute right-01 bottom-0 m-0 h-3 w-3 rounded-full border-2 border-card bg-green-400 p-0" />
					</div>
					<div className="flex flex-col space-y-1 text-xs">
						<p>{post.user.name}</p>
						<span className="text-muted-foreground">@{post.user.username}</span>
					</div>
					<div className="flex items-start justify-start space-x-1">
						<Dot className="size-4" />
						{/* <span className="text-muted-foreground text-xs">25h</span> */}
						<span className="text-muted-foreground text-xs">
							{dayjs(post.createdAt).fromNow()}
						</span>
					</div>
				</div>

				<PostMenu post={post} />
			</CardHeader>
			<CardContent>
				<p>{post.content}</p>
				<div
					className={cn(
						"grid gap-3 pt-4",
						post.media.length <= 1 ? "grid-cols-1" : "grid-cols-2"
					)}
				>
					{post.media.length
						? post.media.map((m) => (
								<figure
									className="overflow-hidden rounded-2xl border border-border/60 bg-muted/40"
									key={m.id}
								>
									<img
										alt={`Travel highlight ${m.id + 2}`}
										className="h-64 w-full object-cover transition-transform duration-700 hover:scale-105"
										src={m.url}
									/>
								</figure>
							))
						: null}
				</div>
			</CardContent>
			<hr />
			<CardFooter className="flex items-center justify-between">
				<div className="flex items-center space-x-4 text-muted-foreground">
					<Button className="flex items-center" variant={"ghost"}>
						<Heart className="" />
						<span className="text-xs">4</span>
					</Button>
					<Button className="flex items-center" variant={"ghost"}>
						<Repeat2 className="" />
						<span className="text-xs">4</span>
					</Button>
					<Button className="flex items-center" variant={"ghost"}>
						<MessageCircle className="" />
						<span className="text-xs">4</span>
					</Button>
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
