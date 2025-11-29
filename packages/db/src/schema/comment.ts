import { relations, sql } from "drizzle-orm";
import { pgTable, text, timestamp, uuid } from "drizzle-orm/pg-core";
import { user } from "./auth";
import { post } from "./post";

const timestamps = {
	createdAt: timestamp().defaultNow().notNull(),
	updatedAt: timestamp({ mode: "date", withTimezone: true }).$onUpdateFn(
		() => sql`now()`
	),
};

export const comment = pgTable("comment", {
	id: uuid("id").notNull().primaryKey().defaultRandom(),
	content: text().notNull(),
	postId: uuid("post_id")
		.notNull()
		.references(() => post.id, { onDelete: "cascade" }),
	userId: text("user_id")
		.notNull()
		.references(() => user.id, { onDelete: "cascade" }),

	...timestamps,
});

export const commentRelations = relations(comment, ({ one }) => ({
	user: one(user, {
		fields: [comment.userId],
		references: [user.id],
	}),
	post: one(post, {
		fields: [comment.postId],
		references: [post.id],
	}),
}));
