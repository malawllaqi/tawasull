import { type DB, desc, eq, sql } from "@tawasull/db";
import { type PostModel, post, postMedia } from "@tawasull/db/schema";
import type { z } from "zod";
import { env } from "@/utils/env";
import { logger } from "@/utils/logger";
import { deleteImage, uploadImage } from "@/utils/s3";
import type { createPostSchema } from "./post.schema";

export async function createPost(
	input: z.infer<typeof createPostSchema.body> & { userId: string },
	db: DB
) {
	try {
		const result = await db
			.insert(post)
			.values({ content: input.content, userId: input.userId })
			.returning();

		const newPost = result[0];
		if (input?.files && input.files.length > 0 && newPost) {
			const uploadedFiles = await Promise.all(
				input.files.map((file) => uploadImage({ file }))
			);

			await db.insert(postMedia).values(
				uploadedFiles.map(({ key }) => ({
					objectKey: key,
					postId: newPost.id,
					mediaType: "image" as const,
					url: "",
				}))
			);
		}
		return newPost;
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
		const result = await db.query.post.findMany({
			orderBy: desc(post.createdAt),
			limit: pageSize,
			offset: (page - 1) * pageSize,
			with: {
				user: {
					columns: {
						username: true,
						image: true,
						name: true,
					},
				},
				media: {
					columns: {
						id: true,
						objectKey: true,
						url: true,
					},
				},
			},
		});

		const count = await db.$count(post);

		return {
			items: result.map((res) => ({
				...res,
				media: res.media.map((m) => ({
					...m,
					url: `${env.AWS_CF_URL}/${m.objectKey}`,
				})),
			})),
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
			with: {
				user: {
					columns: {
						name: true,
						username: true,
						image: true,
					},
				},
				media: {
					columns: {
						id: true,
						url: true,
						objectKey: true,
					},
				},
			},
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

export async function deletePost(
	{
		postToDelete,
	}: { postToDelete: Exclude<Awaited<ReturnType<typeof getPost>>, undefined> },
	db: DB
) {
	try {
		const result = await db
			.delete(post)
			.where(eq(post.id, postToDelete.id))
			.returning({ deletedPost: post.id });

		if (postToDelete.media.length > 0) {
			await Promise.all(
				postToDelete.media.map((p) => deleteImage({ objectKey: p.objectKey }))
			);
		}

		return result[0];
	} catch (error) {
		const message = error instanceof Error ? error.message : "Unknown error";
		logger.error(
			{ message, postId: postToDelete.id },
			"deletePost: failed to delete post"
		);
		throw error;
	}
}
