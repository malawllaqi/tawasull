import { user } from "@tawasull/db/schema/auth";
import { comment } from "@tawasull/db/schema/comment";
import { createInsertSchema, createSelectSchema } from "drizzle-zod";
import z from "zod";
import { errorResponses } from "@/lib/http";

export const createCommentSchema = {
	tags: ["comment"],
	body: createInsertSchema(comment).pick({ content: true, postId: true }),
	response: {
		201: createSelectSchema(comment),
		...errorResponses,
	},
};

export const getPostCommentsSchema = {
	tags: ["comment"],
	params: z.object({
		postId: z.uuid(),
	}),
	response: {
		200: z.array(
			createSelectSchema(comment).extend({
				user: createSelectSchema(user).pick({
					username: true,
					image: true,
					name: true,
				}),
			})
		),
		...errorResponses,
	},
};

export const deleteCommentSchema = {
	tags: ["comment"],
	params: z.object({
		commentId: z.uuid(),
	}),
	response: {
		200: z.void(),
		...errorResponses,
	},
};
