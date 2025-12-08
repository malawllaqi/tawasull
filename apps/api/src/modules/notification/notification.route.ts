import type { FastifyInstance } from "fastify";
import type { ZodTypeProvider } from "fastify-type-provider-zod";
import {
	getUserNotificationsHandler,
	updateNotificationByIdHandler,
	updateNotificationHandler,
} from "./notification.controller";
import {
	getUserNotificationsSchema,
	updateNotificationByIdSchema,
	updateNotificationsSchema,
} from "./notification.schema";

export async function notificationRouter(server: FastifyInstance) {
	server.withTypeProvider<ZodTypeProvider>().get("/", {
		schema: getUserNotificationsSchema,
		preHandler: [server.authenticate],
		handler: getUserNotificationsHandler,
	});

	server.withTypeProvider<ZodTypeProvider>().patch("/", {
		schema: updateNotificationsSchema,
		preHandler: [server.authenticate],
		handler: updateNotificationHandler,
	});

	server.withTypeProvider<ZodTypeProvider>().patch("/:notificationId", {
		schema: updateNotificationByIdSchema,
		preHandler: [server.authenticate],
		handler: updateNotificationByIdHandler,
	});
}
