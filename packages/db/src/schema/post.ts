import { type InferInsertModel, relations, sql } from "drizzle-orm";
import {
	index,
	pgEnum,
	pgTable,
	primaryKey,
	text,
	timestamp,
	uuid,
} from "drizzle-orm/pg-core";
import { user } from "./auth";
import { comment } from "./comment";

const timestamps = {
	createdAt: timestamp().defaultNow().notNull(),
	updatedAt: timestamp({ mode: "date", withTimezone: true }).$onUpdateFn(
		() => sql`now()`
	),
};

export const post = pgTable(
	"post",
	{
		id: uuid("id").notNull().primaryKey().defaultRandom(),
		content: text().notNull(),
		userId: text("user_id")
			.references(() => user.id, { onDelete: "cascade" })
			.notNull(),
		...timestamps,
	},
	(table) => [
		index("post_user_id_idx").on(table.userId),
		index("post_created_at_idx").on(table.createdAt),
	]
);

export const postRelations = relations(post, ({ many, one }) => ({
	media: many(postMedia),
	likes: many(postLike),
	comment: many(comment),
	user: one(user, {
		fields: [post.userId],
		references: [user.id],
	}),
}));

export const mediaTypeEnum = pgEnum("media_type", ["image", "video"]);

export const postMedia = pgTable(
	"post_media",
	{
		id: uuid("id").notNull().primaryKey().defaultRandom(),
		objectKey: text("object_key").notNull(),
		url: text("url"),
		mediaType: mediaTypeEnum("media_type").default("image"),
		postId: uuid("post_id")
			.notNull()
			.references(() => post.id, { onDelete: "cascade" }),
		...timestamps,
	},
	(table) => [index("post_media_post_id_idx").on(table.postId)]
);

export const postMediaRelations = relations(postMedia, ({ one }) => ({
	post: one(post, {
		fields: [postMedia.postId],
		references: [post.id],
	}),
}));

export const postLike = pgTable(
	"post_like",
	{
		postId: uuid("post_id")
			.notNull()
			.references(() => post.id, { onDelete: "cascade" }),
		userId: text("user_id")
			.notNull()
			.references(() => user.id, { onDelete: "cascade" }),
		...timestamps,
	},
	(table) => [
		primaryKey({ columns: [table.postId, table.userId] }),
		index("post_like_user_id_idx").on(table.userId),
		index("post_like_post_id_idx").on(table.postId),
	]
);

export const postLikeRelations = relations(postLike, ({ one }) => ({
	user: one(user, {
		fields: [postLike.userId],
		references: [user.id],
	}),
	post: one(post, {
		fields: [postLike.postId],
		references: [post.id],
	}),
}));

export type PostModel = InferInsertModel<typeof post>;
export type PostMediaModel = InferInsertModel<typeof postMedia>;
export type PostLikeModel = InferInsertModel<typeof postLike>;
