import { type DB, desc, eq } from "@tawasull/db";
import { notification } from "@tawasull/db/schema/notification";
import type { z } from "zod";
import { logger } from "@/lib/logger";
import { pusher } from "@/lib/pusher";
import { getNotificationMessage } from "@/lib/utils";
import type {
	createNotificationSchema,
	getNotificationSchema,
	getUserNotificationsSchema,
} from "./notification.schema";

export async function createNotification(
	input: z.infer<typeof createNotificationSchema.body>,
	db: DB
) {
	try {
		const [result] = await db
			.insert(notification)
			.values({
				actorId: input.actorId,
				recipientId: input.recipientId,
				type: input.type,
				commentId: input.commentId ?? null,
				postId: input.postId ?? null,
			})
			.returning();

		if (!result) {
			return null;
		}

		await pusher.trigger(`user-${input.recipientId}`, "new-notification", {
			id: result.id,
			actorId: result.actorId,
			recipientId: result.recipientId,
			type: result.type,
			commentId: result.commentId,
			postId: result.postId,
			createdAt: result.createdAt,
		});

		return result;
	} catch (error) {
		console.log(error);
		const message = error instanceof Error ? error.message : "Unknown error";
		logger.error(
			{ message, input },
			"createNotification failed to create notifications"
		);
		throw error;
	}
}

export async function getUserNotifications(
	input: z.infer<typeof getUserNotificationsSchema.querystring> & {
		currentUserId: string;
	},
	db: DB
) {
	const { limit = 20, page, currentUserId } = input;

	const pageSize = Math.min(limit, 20);

	try {
		const result = await db.query.notification.findMany({
			where: eq(notification.recipientId, currentUserId),
			orderBy: desc(notification.createdAt),
			limit: pageSize,
			offset: (page - 1) * pageSize,
			with: {
				actor: {
					columns: {
						name: true,
						username: true,
						image: true,
					},
				},
			},
		});

		const count = await db.$count(notification);

		return {
			items: result.map((r) => ({
				...r,
				message: getNotificationMessage(r.type),
			})),
			totalItems: count,
			totalPages: Math.ceil(count / pageSize),
			currentPage: page,
			hasMore: page * pageSize < count,
		};
	} catch (error) {
		const message = error instanceof Error ? error.message : "Unknown error";
		logger.error(
			{ message, input },
			"getUserNotifications failed to get notifications"
		);
		throw error;
	}
}

export async function getNotification(
	input: z.infer<typeof getNotificationSchema.params>,
	db: DB
) {
	try {
		const result = await db.query.notification.findFirst({
			where: eq(notification.id, input.notificationId),
		});

		return result;
	} catch (error) {
		const message = error instanceof Error ? error.message : "Unknown error";
		logger.error(
			{ message, input },
			"getNotification failed to get notification"
		);
		throw error;
	}
}

export async function setNotificationSeen(
	input: { notificationId: string },
	db: DB
) {
	try {
		const [result] = await db
			.update(notification)
			.set({
				isRead: true,
			})
			.where(eq(notification.id, input.notificationId))
			.returning();

		return result;
	} catch (error) {
		console.log(error);
		const message = error instanceof Error ? error.message : "Unknown error";
		logger.error(
			{ message, input },
			"setNotificationSeen failed to set notification as seen"
		);
		throw error;
	}
}

export async function setAllNotificationsSeen(
	input: { currentUserId: string },
	db: DB
) {
	try {
		const [result] = await db
			.update(notification)
			.set({
				isRead: true,
			})
			.where(eq(notification.recipientId, input.currentUserId))
			.returning();

		return result;
	} catch (error) {
		console.log(error);
		const message = error instanceof Error ? error.message : "Unknown error";
		logger.error(
			{ message, input },
			"setAllNotificationsSeen failed to set all notifications as seen"
		);
		throw error;
	}
}
