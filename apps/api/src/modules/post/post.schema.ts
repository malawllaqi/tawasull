import { post } from "@tawasull/db/schema";
import {
	createInsertSchema,
	createSelectSchema,
	createUpdateSchema,
} from "drizzle-zod";
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
		page: z.coerce.number().default(1),
	}),
	response: {
		200: z.object({
			items: z.array(createSelectSchema(post)),
			totalPages: z.number(),
			totalItems: z.number(),
			currentPage: z.number(),
			hasMore: z.boolean(),
		}),
		...errorResponses,
	},
};

export const getPostSchema = {
	tags: ["post"],
	params: z.object({
		postId: z.uuid(),
	}),
	response: {
		200: createSelectSchema(post),
		...errorResponses,
	},
};

export const updatePostSchema = {
	tags: ["post"],
	params: z.object({
		postId: z.uuid(),
	}),
	body: createUpdateSchema(post),
	response: {
		200: createSelectSchema(post),
		...errorResponses,
	},
};

export const deletePostSchema = {
	tags: ["post"],
	params: z.object({
		postId: z.uuid(),
	}),
	response: {
		200: createSelectSchema(post),
		...errorResponses,
	},
};
