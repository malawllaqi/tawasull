import type { FastifyReply, FastifyRequest } from "fastify";
import { StatusCodes } from "http-status-codes";
import type { z } from "zod";
import { httpError } from "@/lib/http";
import { createNotification } from "../notification/notification.service";
import { getPost } from "../post/post.service";
import type {
	createCommentSchema,
	deleteCommentSchema,
	getPostCommentsSchema,
} from "./comment.schema";
import {
	createComment,
	deleteComment,
	getComment,
	getPostComments,
} from "./comment.service";

export async function createCommentHandler(
	request: FastifyRequest<{ Body: z.infer<typeof createCommentSchema.body> }>,
	reply: FastifyReply
) {
	try {
		const { content, postId } = request.body;
		const currentUser = request.user;
		const post = await getPost(
			{ currentUserId: currentUser.id, postId },
			request.db
		);

		if (!post) {
			return httpError({
				reply,
				message: "Post not found",
				code: StatusCodes.NOT_FOUND,
			});
		}

		const result = await createComment(
			{
				content,
				postId,
				currentUserId: request.user.id,
			},
			request.db
		);

		await createNotification(
			{
				actorId: request.user.id,
				recipientId: post.userId,
				postId: post.id,
				commentId: result?.id,
				type: "COMMENT",
			},
			request.db
		);

		return reply.status(201).send(result);
	} catch (_error) {
		return httpError({
			reply,
			message: "Failed to create comment",
			code: StatusCodes.INTERNAL_SERVER_ERROR,
		});
	}
}

export async function getPostCommentsHandler(
	request: FastifyRequest<{
		Params: z.infer<typeof getPostCommentsSchema.params>;
	}>,
	reply: FastifyReply
) {
	const { postId } = request.params;
	try {
		const result = await getPostComments(
			{
				postId,
				currentUserId: request.user.id,
			},
			request.db
		);

		if (!result) {
			return httpError({
				reply,
				message: "Post not found",
				code: StatusCodes.NOT_FOUND,
			});
		}

		return reply.status(200).send(result);
	} catch (_error) {
		return httpError({
			reply,
			message: "Failed to get comment",
			code: StatusCodes.INTERNAL_SERVER_ERROR,
		});
	}
}

export async function deleteCommentHandler(
	request: FastifyRequest<{
		Params: z.infer<typeof deleteCommentSchema.params>;
	}>,
	reply: FastifyReply
) {
	const { commentId } = request.params;
	try {
		const result = await getComment({ commentId }, request.db);

		if (!result) {
			return httpError({
				reply,
				message: "Comment not found",
				code: StatusCodes.NOT_FOUND,
			});
		}

		if (result.userId !== request.user.id) {
			return httpError({
				reply,
				code: StatusCodes.UNAUTHORIZED,
				message: "Unauthorized",
			});
		}

		await deleteComment({ commentId }, request.db);

		return reply.status(200).send();
	} catch (_error) {
		return httpError({
			reply,
			message: "Failed to delete comment",
			code: StatusCodes.INTERNAL_SERVER_ERROR,
		});
	}
}
