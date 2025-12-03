import type { FastifyReply, FastifyRequest } from "fastify";
import { StatusCodes } from "http-status-codes";
import type { z } from "zod";
import { httpError } from "@/utils/http";
import type { createNotificationSchema } from "./notification.schema";
import {
	createNotification,
	getUserNotifications,
} from "./notification.service";

export async function createNotificationHandler(
	request: FastifyRequest<{
		Body: z.infer<typeof createNotificationSchema.body>;
	}>,
	reply: FastifyReply
) {
	try {
		const result = await createNotification(
			{
				...request.body,
				actorId: request.user.id,
			},
			request.db
		);

		return reply.status(201).send(result);
	} catch (_error) {
		return httpError({
			reply,
			message: "Failed to get notifications",
			code: StatusCodes.INTERNAL_SERVER_ERROR,
		});
	}
}

export async function getUserNotificationsHandler(
	request: FastifyRequest,
	reply: FastifyReply
) {
	try {
		const result = await getUserNotifications(
			{
				currentUserId: request.user.id,
			},
			request.db
		);

		return reply.status(200).send(result);
	} catch (_error) {
		return httpError({
			reply,
			message: "Failed to get notifications",
			code: StatusCodes.INTERNAL_SERVER_ERROR,
		});
	}
}
