import type { FastifyReply, FastifyRequest } from "fastify";
import { StatusCodes } from "http-status-codes";
import type { z } from "zod";
import { httpError } from "@/lib/http";
import type {
	createNotificationSchema,
	getUserNotificationsSchema,
	updateNotificationByIdSchema,
} from "./notification.schema";
import {
	createNotification,
	getNotification,
	getUserNotifications,
	setAllNotificationsSeen,
	setNotificationSeen,
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
	request: FastifyRequest<{
		Querystring: z.infer<typeof getUserNotificationsSchema.querystring>;
	}>,
	reply: FastifyReply
) {
	try {
		const { limit, page } = request.query;

		const result = await getUserNotifications(
			{
				page,
				limit,
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

export async function updateNotificationHandler(
	request: FastifyRequest,
	reply: FastifyReply
) {
	try {
		await setAllNotificationsSeen(
			{ currentUserId: request.user.id },
			request.db
		);

		return reply.status(200).send();
	} catch (_error) {
		return httpError({
			reply,
			message: "Failed update notifications",
			code: StatusCodes.INTERNAL_SERVER_ERROR,
		});
	}
}

export async function updateNotificationByIdHandler(
	request: FastifyRequest<{
		Params: z.infer<typeof updateNotificationByIdSchema.params>;
	}>,
	reply: FastifyReply
) {
	try {
		const { notificationId } = request.params;

		const result = await getNotification(
			{
				notificationId,
			},
			request.db
		);

		if (!result) {
			return httpError({
				reply,
				code: StatusCodes.NOT_FOUND,
				message: "Notification not found",
			});
		}

		await setNotificationSeen({ notificationId: result.id }, request.db);

		return reply.status(200).send();
	} catch (_error) {
		return httpError({
			reply,
			message: "Failed to update notification by id",
			code: StatusCodes.INTERNAL_SERVER_ERROR,
		});
	}
}
