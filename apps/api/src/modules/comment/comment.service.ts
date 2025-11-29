import { type DB, desc, eq } from "@tawasull/db";
import { comment } from "@tawasull/db/schema/comment";
import { post } from "@tawasull/db/schema/post";
import type z from "zod";
import { logger } from "@/utils/logger";
import type {
	createCommentSchema,
	getPostCommentsSchema,
} from "./comment.schema";

export async function createComment(
	input: z.infer<typeof createCommentSchema.body> & { currentUserId: string },
	db: DB
) {
	const { content, currentUserId, postId } = input;
	try {
		const result = await db
			.insert(comment)
			.values({
				content,
				postId,
				userId: currentUserId,
			})
			.returning();

		return result[0];
	} catch (error) {
		console.log(error);
		const message = error instanceof Error ? error.message : "Unknown error";
		logger.error({ message, input }, "createComment failed to create comment");
		throw error;
	}
}

export async function getPostComments(
	input: z.infer<typeof getPostCommentsSchema.params> & {
		currentUserId: string;
	},
	db: DB
) {
	try {
		const getPost = await db.query.post.findFirst({
			where: eq(post.id, input.postId),
		});

		if (!getPost) {
			return null;
		}

		const result = await db.query.comment.findMany({
			where: eq(comment.postId, input.postId),
			with: {
				user: {
					columns: {
						username: true,
						image: true,
						name: true,
					},
				},
			},
			orderBy: desc(comment.createdAt),
		});

		return result;
	} catch (error) {
		const message = error instanceof Error ? error.message : "Unknown error";
		logger.error({ message, input }, "getComments failed to get comments");
		throw error;
	}
}
