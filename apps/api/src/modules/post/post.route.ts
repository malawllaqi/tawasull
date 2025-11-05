import type { FastifyInstance } from "fastify";
import type { ZodTypeProvider } from "fastify-type-provider-zod";
import { createPostHandler } from "./post.controller";
import { createPostSchema } from "./post.schema";

export async function postRouter(server: FastifyInstance) {
	server.withTypeProvider<ZodTypeProvider>().post("/", {
		schema: createPostSchema,
		preHandler: [server.authenticate],
		handler: createPostHandler,
	});
}
