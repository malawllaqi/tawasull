import type { FastifyInstance } from "fastify";
import type { ZodTypeProvider } from "fastify-type-provider-zod";
import {
	getCurrentUser,
	getUsersHandler,
	updateUserController,
} from "./user.controller";
import {
	getCurrentUserSchema,
	getUsersSchema,
	updateUserSchema,
} from "./user.schema";

export async function userRoute(server: FastifyInstance) {
	server.withTypeProvider<ZodTypeProvider>().get("/", {
		schema: getUsersSchema,
		preHandler: [server.authenticate],
		handler: getUsersHandler,
	});
	server.withTypeProvider<ZodTypeProvider>().get("/me", {
		schema: getCurrentUserSchema,
		preHandler: [server.authenticate],
		handler: getCurrentUser,
	});

	server.withTypeProvider<ZodTypeProvider>().patch("/", {
		preValidation: async (req) => {
			console.log(req.body);
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
