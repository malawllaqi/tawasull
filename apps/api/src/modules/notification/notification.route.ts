import type { FastifyInstance } from "fastify";
import type { ZodTypeProvider } from "fastify-type-provider-zod";
import { getUserNotificationsHandler } from "./notification.controller";
import { getUserNotificationsSchema } from "./notification.schema";

export async function notificationRouter(server: FastifyInstance) {
	server.withTypeProvider<ZodTypeProvider>().get("/", {
		schema: getUserNotificationsSchema,
		preHandler: [server.authenticate],
		handler: getUserNotificationsHandler,
	});
}
