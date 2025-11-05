import type { FastifyReply, FastifyRequest } from "fastify";
import { StatusCodes } from "http-status-codes";
import type { z } from "zod";
import { httpError } from "@/utils/http";
import { logger } from "@/utils/logger";
import type { PostgresErrorType } from "@/utils/types";
import type { createPostSchema, getPostsSchema } from "./post.schema";
import { createPost, getPosts } from "./post.service";

export async function createPostHandler(
	request: FastifyRequest<{ Body: z.infer<typeof createPostSchema.body> }>,
	reply: FastifyReply,
) {
	const { content } = request.body;

	try {
		const result = await createPost(
			{ content, userId: request.user.id },
			request.db,
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
	reply: FastifyReply,
) {
	const { limit, cursor } = request.query;
	try {
		const result = await getPosts({ cursor, limit }, request.db);

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
