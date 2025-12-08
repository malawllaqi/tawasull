import { relations, sql } from "drizzle-orm";
import {
	index,
	pgTable,
	primaryKey,
	text,
	timestamp,
	unique,
	uuid,
} from "drizzle-orm/pg-core";
import { user } from "./auth";
import { post } from "./post";

const timestamps = {
	createdAt: timestamp().defaultNow().notNull(),
	updatedAt: timestamp({ mode: "string", withTimezone: true }).$onUpdateFn(
		() => sql`now()`
	),
};

export const group = pgTable(
	"group",
	{
		id: uuid("id").notNull().primaryKey().defaultRandom(),
		name: text("name").notNull(),
		bio: text("bio").notNull(),
		slug: text("slug").notNull().unique(),
		image: text("image"),
		objectKey: text("objectKey"),
		...timestamps,
	},
	(table) => [index("group_slug_idx").on(table.slug)]
);

export const groupRelations = relations(group, ({ many }) => ({
	members: many(groupMember),
	posts: many(post),
}));

export const groupMember = pgTable(
	"group_member",
	{
		userId: text("user_id")
			.notNull()
			.references(() => user.id, { onDelete: "cascade" }),
		role: text("role", { enum: ["USER", "MODERATOR", "OWNER"] })
			.notNull()
			.default("USER"),
		groupId: uuid("group_id").references(() => group.id, {
			onDelete: "cascade",
		}),

		createdAt: timestamps.createdAt,
	},
	(t) => [
		primaryKey({ columns: [t.userId, t.groupId] }),
		unique("unique_group_user").on(t.groupId, t.userId),
	]
);

export const groupMembersRelations = relations(groupMember, ({ one }) => ({
	group: one(group, {
		fields: [groupMember.groupId],
		references: [group.id],
	}),
	user: one(user, {
		fields: [groupMember.userId],
		references: [user.id],
	}),
}));
