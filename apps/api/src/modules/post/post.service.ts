import { asc, type DB, desc, gt, type InferInsertModel } from "@tawasull/db";
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
