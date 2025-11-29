import type { FastifyInstance } from "fastify";
import type { ZodTypeProvider } from "fastify-type-provider-zod";
import {
	createCommentHandler,
	getPostCommentsHandler,
} from "./comment.controller";
import { createCommentSchema, getPostCommentsSchema } from "./comment.schema";

export async function commentRouter(server: FastifyInstance) {
	server.withTypeProvider<ZodTypeProvider>().post("/", {
		schema: createCommentSchema,
		preHandler: [server.authenticate],
		handler: createCommentHandler,
	});
	server.withTypeProvider<ZodTypeProvider>().get("/:postId", {
		schema: getPostCommentsSchema,
		preHandler: [server.authenticate],
		handler: getPostCommentsHandler,
	});
}
