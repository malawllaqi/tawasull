import type { FastifyInstance } from "fastify";
import type { ZodTypeProvider } from "fastify-type-provider-zod";
import { createPostHandler, getPostsHandler } from "./post.controller";
import { createPostSchema, getPostsSchema } from "./post.schema";

export async function postRouter(server: FastifyInstance) {
	server.withTypeProvider<ZodTypeProvider>().post("/", {
		schema: createPostSchema,
		preHandler: [server.authenticate],
		handler: createPostHandler,
	});

	server.withTypeProvider<ZodTypeProvider>().get("/", {
		schema: getPostsSchema,
		preHandler: [server.authenticate],
		handler: getPostsHandler,
	});
}
