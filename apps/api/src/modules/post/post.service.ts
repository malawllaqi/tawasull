import { and, type DB, desc, eq, sql } from "@tawasull/db";
import { type PostModel, post, postLike, postMedia } from "@tawasull/db/schema";
import type { z } from "zod";
import { env } from "@/utils/env";
import { logger } from "@/utils/logger";
import { deleteImage, uploadImage } from "@/utils/s3";
import type { createPostSchema, getPostsSchema } from "./post.schema";

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

type getPostsInput = z.infer<typeof getPostsSchema.querystring> & {
	currentUserId: string;
};
export async function getPosts(
	{ page, limit = 20, currentUserId, id }: getPostsInput,
	db: DB
) {
	const pageSize = Math.min(limit, 20);

	try {
		const result = await db.query.post.findMany({
			orderBy: desc(post.createdAt),
			limit: pageSize,
			offset: (page - 1) * pageSize,
			...(id && {
				where: eq(post.userId, id),
			}),
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
			extras: {
				comments:
					sql<number>`CAST((SELECT COUNT(*) FROM comment WHERE comment.post_id = post.id) AS INTEGER)`.as(
						"comment_count"
					),
				likes:
					sql<number>`CAST((SELECT COUNT(*) FROM post_like WHERE post_like.post_id = post.id) AS INTEGER)`.as(
						"like_count"
					),
				isLiked:
					sql<boolean>`EXISTS(SELECT 1 FROM post_like WHERE post_like.post_id = post.id AND post_like.user_id = ${currentUserId})`.as(
						"is_liked"
					),
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

export async function getPost(
	{ postId, currentUserId }: { postId: string; currentUserId: string },
	db: DB
) {
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
			extras: {
				comments:
					sql<number>`CAST((SELECT COUNT(*) FROM comment WHERE comment.post_id = post.id) AS INTEGER)`.as(
						"comment_count"
					),
				likes:
					sql<number>`CAST((SELECT COUNT(*) FROM post_like WHERE post_like.post_id = post.id) AS INTEGER)`.as(
						"like_count"
					),
				isLiked:
					sql<boolean>`EXISTS(SELECT 1 FROM post_like WHERE post_like.post_id = post.id AND post_like.user_id = ${currentUserId})`.as(
						"is_liked"
					),
			},
		});

		if (!result) {
			return null;
		}

		return {
			...result,
			media: result.media.map((m) => ({
				...m,
				url: `${env.AWS_CF_URL}/${m.objectKey}`,
			})),
		};
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
		postId,
		media,
	}: {
		media: { url: string; id: string; objectKey: string }[];
		postId: string;
	},
	db: DB
) {
	try {
		const result = await db
			.delete(post)
			.where(eq(post.id, postId))
			.returning({ deletedPost: post.id });

		if (media.length > 0) {
			await Promise.all(
				media.map((m) => deleteImage({ objectKey: m.objectKey }))
			);
		}

		return result[0];
	} catch (error) {
		const message = error instanceof Error ? error.message : "Unknown error";
		logger.error({ message, postId }, "deletePost: failed to delete post");
		throw error;
	}
}

export async function likePost(
	{ postId, userId }: { postId: string; userId: string },
	db: DB
) {
	try {
		const isLiked = await db.query.postLike.findFirst({
			where: and(eq(postLike.postId, postId), eq(postLike.userId, userId)),
		});

		if (isLiked) {
			const unlike = await db
				.delete(postLike)
				.where(and(eq(postLike.postId, postId), eq(postLike.userId, userId)))
				.returning();

			return unlike[0];
		}

		const result = await db
			.insert(postLike)
			.values({
				postId,
				userId,
			})
			.returning();

		return result[0];
	} catch (error) {
		const message = error instanceof Error ? error.message : "Unknown error";
		logger.error({ message, postId }, "likePost: failed to toggle likes post");
		throw error;
	}
}
