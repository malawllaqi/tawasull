import { sql } from "drizzle-orm";
import { pgTable, text, timestamp, uuid } from "drizzle-orm/pg-core";
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
