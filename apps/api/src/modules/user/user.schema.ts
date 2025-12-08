import { follows, user } from "@tawasull/db/schema/auth";
import { createSelectSchema, createUpdateSchema } from "drizzle-zod";
import { z } from "zod";
import { errorResponses } from "@/lib/http";

export const getUsersSchema = {
	tags: ["user"],
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
				createSelectSchema(user).extend({
					isFollowing: z.boolean().default(false),
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

export const getUserSchema = {
	tags: ["user"],
	params: z.object({
		username: z.string(),
	}),
	response: {
		200: createSelectSchema(user).extend({
			isFollowing: z.boolean().default(false),
		}),
		...errorResponses,
	},
};

export const updateUserSchema = {
	tags: ["user"],
	consumes: ["multipart/form-data"],
	body: createUpdateSchema(user)
		.pick({ username: true, name: true })
		.extend({
			file: z
				.file()
				.max(5 * 1024 * 1024)
				.mime([
					"image/jpeg",
					"image/jpg",
					"image/png",
					"image/gif",
					"image/webp",
					"image/svg+xml",
				])
				.optional(),
		}),
	response: {
		200: createSelectSchema(user),
		...errorResponses,
	},
};

export const getCurrentUserSchema = {
	tags: ["user"],
	response: {
		200: createSelectSchema(user),
		...errorResponses,
	},
};

export const followsUserSchema = {
	tags: ["user"],
	params: z.object({
		userId: z.string(),
	}),
	response: {
		200: createSelectSchema(follows),
		...errorResponses,
	},
};
