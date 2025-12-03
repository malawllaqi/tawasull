import { notification } from "@tawasull/db/schema/notification";
import { createInsertSchema, createSelectSchema } from "drizzle-zod";
import { errorResponses } from "@/utils/http";

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
	response: {
		200: createSelectSchema(notification),
		...errorResponses,
	},
};
