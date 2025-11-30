import type { FastifyInstance } from "fastify";
import type { ZodTypeProvider } from "fastify-type-provider-zod";
import {
	createCommentHandler,
	deleteCommentHandler,
	getPostCommentsHandler,
} from "./comment.controller";
import {
	createCommentSchema,
	deleteCommentSchema,
	getPostCommentsSchema,
} from "./comment.schema";

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
	server.withTypeProvider<ZodTypeProvider>().delete("/:commentId", {
		schema: deleteCommentSchema,
		preHandler: [server.authenticate],
		handler: deleteCommentHandler,
	});
}
