import type { FastifyReply, FastifyRequest } from "fastify";
import { StatusCodes } from "http-status-codes";
import type { z } from "zod";
import { httpError } from "@/utils/http";
import type {
	createCommentSchema,
	getPostCommentsSchema,
} from "./comment.schema";
import { createComment, getPostComments } from "./comment.service";

export async function createCommentHandler(
	request: FastifyRequest<{ Body: z.infer<typeof createCommentSchema.body> }>,
	reply: FastifyReply
) {
	try {
		const { content, postId } = request.body;

		const result = await createComment(
			{
				content,
				postId,
				currentUserId: request.user.id,
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
