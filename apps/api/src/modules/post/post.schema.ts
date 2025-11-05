import { post } from "@tawasull/db/schema";
import { createInsertSchema, createSelectSchema } from "drizzle-zod";
import { errorResponses } from "@/utils/http";
export const createPostSchema = {
	tags: ["post"],
	body: createInsertSchema(post).omit({
		id: true,
		userId: true,
		createdAt: true,
		updatedAt: true,
	}),
	response: {
		200: createSelectSchema(post),
		...errorResponses,
	},
};
