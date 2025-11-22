import type { Post } from "@tawasull/shared";
import {
	Bookmark,
	Heart,
	MessageCircle,
	MoreHorizontal,
	Repeat2,
} from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
	Card,
	CardContent,
	CardFooter,
	CardHeader,
} from "@/components/ui/card";

type PostPreviewProps = {
	post: Post;
};
export function PostPreview({ post }: PostPreviewProps) {
	const placeholderImages = [
		"https://images.unsplash.com/photo-1505765050516-f72dcac9c60e?auto=format&fit=crop&w=1200&q=80",
		"https://images.unsplash.com/photo-1469474968028-56623f02e42e?auto=format&fit=crop&w=1200&q=80",
	];
	return (
		<Card className="overflow-hidden">
			<CardHeader className="flex items-center justify-between">
				<div className="flex space-x-4">
					<div className="relative">
						<Avatar>
							<AvatarImage
								alt={`@${post.user.username}`}
								className="h-11 w-11 object-cover"
								// src="https://github.com/shadcn.png"
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
				</div>

				<Button className="" variant={"outline"}>
					<MoreHorizontal />
				</Button>
			</CardHeader>
			<CardContent>
				<p>{post.content}</p>
				<div className="grid grid-cols-2 gap-3 pt-4">
					{placeholderImages.map((image, index) => (
						<figure
							className="overflow-hidden rounded-2xl border border-border/60 bg-muted/40"
							key={image}
						>
							<img
								alt={`Travel highlight ${index + 2}`}
								className="h-64 w-full object-cover transition-transform duration-700 hover:scale-105"
								src={image}
							/>
						</figure>
					))}
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
