import { relations, sql } from "drizzle-orm";
import { pgEnum, pgTable, text, timestamp, uuid } from "drizzle-orm/pg-core";
import { user } from "./auth";

const timestamps = {
	createdAt: timestamp().defaultNow().notNull(),
	updatedAt: timestamp({ mode: "date", withTimezone: true }).$onUpdateFn(
		() => sql`now()`,
	),
};

export const post = pgTable("post", {
	id: uuid("id").notNull().primaryKey().defaultRandom(),
	content: text().notNull(),
	userId: text("user_id")
		.references(() => user.id)
		.notNull(),
	...timestamps,
});

export const postRelations = relations(post, ({ many, one }) => ({
	media: many(postMedia),
	user: one(user, {
		fields: [post.userId],
		references: [user.id],
	}),
}));

export const mediaTypeEnum = pgEnum("media_type", ["image", "video"]);

export const postMedia = pgTable("post_media", {
	id: uuid("id").notNull().primaryKey().defaultRandom(),
	objectKey: text("object_key").notNull(),
	mediaUrl: text("media_url"),
	mediaType: mediaTypeEnum().default("image"),
	postId: uuid("post_id")
		.notNull()
		.references(() => post.id),
	...timestamps,
});

export const postMediaRelations = relations(postMedia, ({ one }) => ({
	post: one(post, {
		fields: [postMedia.postId],
		references: [post.id],
	}),
}));
