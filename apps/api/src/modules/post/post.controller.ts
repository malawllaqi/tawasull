import type { FastifyReply, FastifyRequest } from "fastify";
import { StatusCodes } from "http-status-codes";
import type { z } from "zod";
import { httpError } from "@/lib/http";
import { logger } from "@/lib/logger";
import type { PostgresErrorType } from "@/lib/types";
import { createNotification } from "../notification/notification.service";
import type {
	createPostSchema,
	deletePostSchema,
	getPostSchema,
	getPostsSchema,
	updatePostSchema,
} from "./post.schema";
import {
	createPost,
	deletePost,
	getPost,
	getPosts,
	likePost,
	updatePost,
} from "./post.service";

export async function createPostHandler(
	request: FastifyRequest<{ Body: z.infer<typeof createPostSchema.body> }>,
	reply: FastifyReply
) {
	const { content, files } = request.body;

	try {
		const result = await createPost(
			{ content, userId: request.user.id, files: files || [] },
			request.db
		);

		reply.status(201).send(result);
	} catch (_error) {
		// const e = error as PostgresErrorType;
		return httpError({
			reply,
			message: "Failed to create post",
			code: StatusCodes.INTERNAL_SERVER_ERROR,
		});
	}
}

export async function getPostsHandler(
	request: FastifyRequest<{
		Querystring: z.infer<typeof getPostsSchema.querystring>;
	}>,
	reply: FastifyReply
) {
	const { limit, page, id } = request.query;

	try {
		const result = await getPosts(
			{ page, limit, currentUserId: request.user.id, id },
			request.db
		);

		return reply.status(200).send(result);
	} catch (error) {
		const e = error as PostgresErrorType;
		logger.error({ error }, "getPosts failed to get posts");
		return httpError({
			reply,
			message: "Failed to get posts",
			code: StatusCodes.INTERNAL_SERVER_ERROR,
			cause: e.message,
		});
	}
}

export async function getPostHandler(
	request: FastifyRequest<{ Params: z.infer<typeof getPostSchema.params> }>,
	reply: FastifyReply
) {
	const { postId } = request.params;

	const result = await getPost(
		{ postId, currentUserId: request.user.id },
		request.db
	);

	if (!result) {
		return httpError({
			reply,
			code: StatusCodes.NOT_FOUND,
			message: "Post not found",
		});
	}

	return reply.status(200).send(result);
}

export async function updatePostHandler(
	request: FastifyRequest<{
		Body: z.infer<typeof updatePostSchema.body>;
		Params: z.infer<typeof updatePostSchema.params>;
	}>,
	reply: FastifyReply
) {
	const input = request.body;
	const { postId } = request.params;
	const result = await updatePost({ ...input, postId }, request.db);

	if (!result) {
		return httpError({
			reply,
			code: StatusCodes.NOT_FOUND,
			message: "Post not found",
		});
	}

	return reply.status(200).send(result);
}

export async function deletePostHandler(
	request: FastifyRequest<{
		Params: z.infer<typeof deletePostSchema.params>;
	}>,
	reply: FastifyReply
) {
	const { postId } = request.params;
	const result = await getPost(
		{ postId, currentUserId: request.user.id },
		request.db
	);

	if (!result) {
		return httpError({
			reply,
			code: StatusCodes.NOT_FOUND,
			message: "Post not found",
		});
	}

	if (result.userId !== request.user.id) {
		return httpError({
			reply,
			code: StatusCodes.UNAUTHORIZED,
			message: "Unauthorized",
		});
	}

	await deletePost({ media: result.media, postId: result.id }, request.db);

	return reply.status(200).send();
}

export async function likePostHandler(
	request: FastifyRequest<{
		Params: z.infer<typeof deletePostSchema.params>;
	}>,
	reply: FastifyReply
) {
	const { postId } = request.params;
	const post = await getPost(
		{ postId, currentUserId: request.user.id },
		request.db
	);

	if (!post) {
		return httpError({
			reply,
			code: StatusCodes.NOT_FOUND,
			message: "Post not found",
		});
	}

	const result = await likePost(
		{ postId: post.id, userId: request.user.id },
		request.db
	);

	if (post.userId !== request.user.id && result.success) {
		await createNotification(
			{
				actorId: request.user.id,
				recipientId: post.userId,
				postId: post.id,
				type: "LIKE",
			},
			request.db
		);
	}

	return reply.status(200).send();
}
