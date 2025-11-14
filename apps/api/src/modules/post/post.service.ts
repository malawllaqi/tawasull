import { type DB, desc, eq, sql } from "@tawasull/db";
import { type PostModel, post } from "@tawasull/db/schema";
import { logger } from "@/utils/logger";

export async function createPost(input: Omit<PostModel, "">, db: DB) {
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
		page,
		limit = 20,
	}: {
		limit?: number;
		page: number;
	},
	db: DB
) {
	const pageSize = Math.min(limit, 20);

	try {
		const result = await db
			.select()
			.from(post)
			.orderBy(desc(post.createdAt))
			.limit(pageSize)
			.offset((page - 1) * pageSize);

		const count = await db.$count(post);

		return {
			items: result,
			totalItems: count,
			totalPages: Math.ceil(count / pageSize),
			currentPage: page,
			hasMore: page * pageSize < count,
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
	input: Partial<Pick<PostModel, "content">> & {
		postId: string;
	},
	db: DB
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
