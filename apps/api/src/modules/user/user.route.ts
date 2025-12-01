import type { FastifyInstance } from "fastify";
import type { ZodTypeProvider } from "fastify-type-provider-zod";
import {
	followUserHandler,
	getCurrentUser,
	getUserHandler,
	getUsersHandler,
	unfollowUserHandler,
	updateUserController,
} from "./user.controller";
import {
	followsUserSchema,
	getCurrentUserSchema,
	getUserSchema,
	getUsersSchema,
	updateUserSchema,
} from "./user.schema";

export async function userRouter(server: FastifyInstance) {
	server.withTypeProvider<ZodTypeProvider>().get("/", {
		schema: getUsersSchema,
		preHandler: [server.authenticate],
		handler: getUsersHandler,
	});
	server.withTypeProvider<ZodTypeProvider>().get("/:username", {
		schema: getUserSchema,
		preHandler: [server.authenticate],
		handler: getUserHandler,
	});

	server.withTypeProvider<ZodTypeProvider>().get("/:userId/follow", {
		schema: followsUserSchema,
		preHandler: [server.authenticate],
		handler: followUserHandler,
	});

	server.withTypeProvider<ZodTypeProvider>().get("/:userId/unfollow", {
		schema: followsUserSchema,
		preHandler: [server.authenticate],
		handler: unfollowUserHandler,
	});

	server.withTypeProvider<ZodTypeProvider>().get("/me", {
		schema: getCurrentUserSchema,
		preHandler: [server.authenticate],
		handler: getCurrentUser,
	});

	server.withTypeProvider<ZodTypeProvider>().patch("/", {
		preValidation: async (req) => {
			if (!req.body?.file) {
				return;
			}
			const formData = await req.formData();

			const input: Record<string, any> = {};

			for (const [key, value] of formData.entries()) {
				input[key] = value;
			}
			req.body = input;
		},
		schema: updateUserSchema,
		preHandler: [server.authenticate],
		handler: updateUserController,
	});
}
