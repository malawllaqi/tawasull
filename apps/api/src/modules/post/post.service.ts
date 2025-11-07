import {
	type DB,
	desc,
	eq,
	gt,
	type InferInsertModel,
	sql,
} from "@tawasull/db";
import { post } from "@tawasull/db/schema";
import { logger } from "@/utils/logger";

export async function createPost(
	input: Omit<InferInsertModel<typeof post>, "">,
	db: DB,
) {
	try {
		const result = await db
			.insert(post)
			.values({ ...input })
			.returning();

		return result[0];
	} catch (error) {
		const message = error instanceof Error ? error.message : "Unknown error";
		logger.error({ message, input }, "createPost: failed to create post");
		throw error;
	}
}

export async function getPosts(
	{
		cursor,
		limit = 20,
	}: {
		limit?: number;
		cursor?: string;
	},
	db: DB,
) {
	try {
		const result = await db
			.select()
			.from(post)
			.where(cursor ? gt(post.id, cursor) : undefined)
			.limit(Math.min(limit, 20))
			.orderBy(desc(post.createdAt));

		const nextPage = result[result.length - 1]?.id;

		return {
			items: result,
			nextCursor: nextPage,
		};
	} catch (error) {
		const message = error instanceof Error ? error.message : "Unknown error";
		logger.error({ message }, "getPosts failed to get posts");
		throw error;
	}
}

export async function getPost({ postId }: { postId: string }, db: DB) {
	try {
		const result = await db.query.post.findFirst({
			where: eq(post.id, postId),
		});

		return result;
	} catch (error) {
		const message = error instanceof Error ? error.message : "Unknown error";
		logger.error({ message, postId }, "getPost failed to get a post by id");
		throw error;
	}
}

export async function updatePost(
	input: Partial<Pick<InferInsertModel<typeof post>, "content">> & {
		postId: string;
	},
	db: DB,
) {
	try {
		const { postId, ...rest } = input;

		const result = await db
			.update(post)
			.set({ ...rest, updatedAt: sql`NOW()` })
			.where(eq(post.id, postId))
			.returning();

		return result[0];
	} catch (error) {
		const message = error instanceof Error ? error.message : "Unknown error";
		logger.error({ message, input }, "updatePost: failed to update post");
		throw error;
	}
}

export async function deletePost(postId: string, db: DB) {
	try {
		const result = await db.delete(post).where(eq(post.id, postId)).returning();

		return result[0];
	} catch (error) {
		const message = error instanceof Error ? error.message : "Unknown error";
		logger.error({ message, postId }, "updatePost: failed to update post");
		throw error;
	}
}
