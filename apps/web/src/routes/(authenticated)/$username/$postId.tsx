import { useSuspenseQuery } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";
import { Suspense } from "react";
import { PageContainer } from "@/components/page-container";
import CreateComment from "@/modules/posts/components/actions/create-comment";
import { PostPreview } from "@/modules/posts/components/post-preview";
import { PostPreviewSkeleton } from "@/modules/posts/components/post-preview-skeleton";
import { createPostQueryOptions } from "@/modules/posts/queries";

export const Route = createFileRoute("/(authenticated)/$username/$postId")({
	component: RouteComponent,
});

function RouteComponent() {
	const { postId } = Route.useParams();
	return (
		<div>
			<PageContainer className="lg:px-20" maxWidth="3xl">
				<Suspense fallback={<PostPreviewSkeleton />}>
					<PostDetails id={postId} />
				</Suspense>
			</PageContainer>
		</div>
	);
}

function PostDetails({ id }: { id: string }) {
	const { data } = useSuspenseQuery({ ...createPostQueryOptions({ id }) });

	return (
		<div className="space-y-6">
			<PostPreview post={data} />
			<CreateComment />
		</div>
	);
}
