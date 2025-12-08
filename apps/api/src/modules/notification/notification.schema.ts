import { user } from "@tawasull/db/schema/auth";
import { notification } from "@tawasull/db/schema/notification";
import { createInsertSchema, createSelectSchema } from "drizzle-zod";
import { z } from "zod";
import { errorResponses } from "@/lib/http";

export const createNotificationSchema = {
	tags: ["notification"],
	body: createInsertSchema(notification).omit({
		id: true,
		updatedAt: true,
		createdAt: true,
	}),
	response: {
		201: createSelectSchema(notification),
		...errorResponses,
	},
};

export const getUserNotificationsSchema = {
	tags: ["notification"],
	querystring: z.object({
		search: z.string().optional(),
		limit: z
			.string()
			.optional()
			.transform((val) => (val == null ? undefined : Number.parseInt(val, 10))),
		page: z.coerce.number().default(1),
	}),
	response: {
		200: z.object({
			items: z.array(
				createSelectSchema(notification).extend({
					actor: createSelectSchema(user).pick({
						username: true,
						name: true,
						image: true,
					}),
					message: z.string(),
				})
			),
			totalPages: z.number(),
			totalItems: z.number(),
			currentPage: z.number(),
			hasMore: z.boolean(),
		}),
		...errorResponses,
	},
};

export const getNotificationSchema = {
	tags: ["notification"],
	params: z.object({
		notificationId: z.uuid(),
	}),
	response: {
		201: createSelectSchema(notification),
		...errorResponses,
	},
};

export const updateNotificationsSchema = {
	tags: ["notification"],
	response: {
		201: z.void(),
		...errorResponses,
	},
};

export const updateNotificationByIdSchema = {
	tags: ["notification"],
	params: z.object({
		notificationId: z.uuid(),
	}),
	response: {
		201: z.void(),
		...errorResponses,
	},
};
