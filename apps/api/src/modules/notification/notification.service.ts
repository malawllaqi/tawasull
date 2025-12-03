import { type DB, eq } from "@tawasull/db";
import { notification } from "@tawasull/db/schema/notification";
import type { z } from "zod";
import { logger } from "@/utils/logger";
import { pusher } from "@/utils/pusher";
import type { createNotificationSchema } from "./notification.schema";

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
	input: { currentUserId: string },
	db: DB
) {
	try {
		const result = await db.query.notification.findMany({
			where: eq(notification.recipientId, input.currentUserId),
		});

		return result;
	} catch (error) {
		const message = error instanceof Error ? error.message : "Unknown error";
		logger.error(
			{ message, input },
			"getUserNotifications failed to get notifications"
		);
		throw error;
	}
}
