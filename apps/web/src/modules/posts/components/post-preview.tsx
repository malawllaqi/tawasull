import type { Post } from "@tawasull/shared";
import { Card, CardContent } from "@/components/ui/card";

type PostPreviewProps = {
	post: Post;
};
export function PostPreview({ post }: PostPreviewProps) {
	return (
		<Card>
			<CardContent>
				<p>{post.content}</p>
			</CardContent>
		</Card>
	);
}
