import { post } from "@tawasull/db/schema";
import { createInsertSchema, createSelectSchema } from "drizzle-zod";
import { z } from "zod";
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
		201: createSelectSchema(post),
		...errorResponses,
	},
};

export const getPostsSchema = {
	tags: ["post"],
	querystring: z.object({
		search: z.string().optional(),
		limit: z
			.string()
			.optional()
			.transform((val) => (val == null ? undefined : Number.parseInt(val, 10))),
		cursor: z.string().optional(),
	}),
	response: {
		200: z.object({
			items: z.array(createSelectSchema(post)),
			nextCursor: z.string(),
		}),
		...errorResponses,
	},
};
