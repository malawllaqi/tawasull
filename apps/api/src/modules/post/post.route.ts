import type { FastifyInstance } from "fastify";
import type { ZodTypeProvider } from "fastify-type-provider-zod";
import {
	createPostHandler,
	deletePostHandler,
	getPostHandler,
	getPostsHandler,
	updatePostHandler,
} from "./post.controller";
import {
	createPostSchema,
	deletePostSchema,
	getPostSchema,
	getPostsSchema,
	updatePostSchema,
} from "./post.schema";

export async function postRouter(server: FastifyInstance) {
	server.withTypeProvider<ZodTypeProvider>().post("/", {
		preValidation: async (req) => {
			if (!req.body?.files) {
				return;
			}
			const formData = await req.formData();
			const content = formData.get("content")?.toString() || "";
			const files = formData.getAll("files") || [];

			req.body = {
				content,
				files: files as File[],
			};
		},
		schema: createPostSchema,
		preHandler: [server.authenticate],
		handler: createPostHandler,
	});

	server.withTypeProvider<ZodTypeProvider>().get("/", {
		schema: getPostsSchema,
		preHandler: [server.authenticate],
		handler: getPostsHandler,
	});

	server.withTypeProvider<ZodTypeProvider>().get("/:postId", {
		schema: getPostSchema,
		preHandler: [server.authenticate],
		handler: getPostHandler,
	});

	server.withTypeProvider<ZodTypeProvider>().patch("/:postId", {
		schema: updatePostSchema,
		preHandler: [server.authenticate],
		handler: updatePostHandler,
	});

	server.withTypeProvider<ZodTypeProvider>().delete("/:postId", {
		schema: deletePostSchema,
		preHandler: [server.authenticate],
		handler: deletePostHandler,
	});
}
