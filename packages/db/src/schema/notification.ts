import { relations, sql } from "drizzle-orm";
import {
	boolean,
	pgEnum,
	pgTable,
	text,
	timestamp,
	uuid,
} from "drizzle-orm/pg-core";
import { user } from "./auth";
import { comment } from "./comment";
import { post } from "./post";

const timestamps = {
	createdAt: timestamp().defaultNow().notNull(),
	updatedAt: timestamp({ mode: "string", withTimezone: true }).$onUpdateFn(
		() => sql`now()`
	),
};

export const notificationType = pgEnum("notification_type", [
	"FOLLOW",
	"COMMENT",
	"LIKE",
	"RETWEET",
]);
export const notification = pgTable("notification", {
	id: uuid("id").notNull().primaryKey().defaultRandom(),
	actorId: text("actor_id")
		.references(() => user.id, {
			onDelete: "cascade",
			onUpdate: "cascade",
		})
		.notNull(),
	recipientId: text("recipient_id")
		.references(() => user.id, {
			onDelete: "cascade",
			onUpdate: "cascade",
		})
		.notNull(),
	type: notificationType("type").notNull(),
	commentId: uuid("comment_id").references(() => comment.id, {
		onDelete: "cascade",
		onUpdate: "cascade",
	}),
	postId: uuid("post_id").references(() => post.id, {
		onDelete: "cascade",
		onUpdate: "cascade",
	}),
	isRead: boolean("is_read").default(false),

	...timestamps,
});

export const notificationRelations = relations(notification, ({ one }) => ({
	actor: one(user, {
		fields: [notification.actorId],
		references: [user.id],
	}),
	recipient: one(user, {
		fields: [notification.recipientId],
		references: [user.id],
	}),
	post: one(post, {
		fields: [notification.postId],
		references: [post.id],
	}),
	comment: one(comment, {
		fields: [notification.commentId],
		references: [comment.id],
	}),
}));
