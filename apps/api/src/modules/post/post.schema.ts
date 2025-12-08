import { post, postMedia, user } from "@tawasull/db/schema";
import {
	createInsertSchema,
	createSelectSchema,
	createUpdateSchema,
} from "drizzle-zod";
import { z } from "zod";
import { errorResponses } from "@/lib/http";

export const createPostSchema = {
	tags: ["post"],
	consumes: ["multipart/form-data"],
	body: createInsertSchema(post)
		.pick({ content: true })
		.extend({
			files: z
				.array(
					z
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
				)
				.optional(),
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
		id: z.string().optional(),
	}),
	response: {
		200: z.object({
			items: z.array(
				createSelectSchema(post).extend({
					user: createSelectSchema(user).pick({
						name: true,
						username: true,
						image: true,
					}),
					media: z
						.array(
							createSelectSchema(postMedia).pick({
								id: true,
								url: true,
								objectKey: true,
							})
						)
						.default([]),

					comments: z.number(),
					likes: z.number(),
					isLiked: z.boolean(),
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

export const getPostSchema = {
	tags: ["post"],
	params: z.object({
		postId: z.uuid(),
	}),
	response: {
		200: createSelectSchema(post).extend({
			user: createSelectSchema(user).pick({
				name: true,
				username: true,
				image: true,
			}),
			media: z
				.array(
					createSelectSchema(postMedia).pick({
						id: true,
						url: true,
						objectKey: true,
					})
				)
				.default([]),
			comments: z.number(),
			likes: z.number(),
			isLiked: z.boolean(),
		}),
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
		200: z.void(),
		...errorResponses,
	},
};

export const likePostSchema = {
	tags: ["post"],
	params: z.object({
		postId: z.uuid(),
	}),
	response: {
		200: z.void(),
		...errorResponses,
	},
};
