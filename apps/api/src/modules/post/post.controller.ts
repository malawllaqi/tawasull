import type { FastifyReply, FastifyRequest } from "fastify";
import { StatusCodes } from "http-status-codes";
import type { z } from "zod";
import { httpError } from "@/utils/http";
import type { createPostSchema } from "./post.schema";
import { createPost } from "./post.service";

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
