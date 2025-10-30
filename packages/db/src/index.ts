import dotenv from "dotenv";
import { sql } from "drizzle-orm";

dotenv.config({
	path: "../../apps/server/.env",
});

import { drizzle } from "drizzle-orm/node-postgres";
import { Pool } from "pg";

export async function setupDB(url?: string) {
	if (!url) {
		throw new Error("DATABASE_URL is not set");
	}

	const client = new Pool({
		connectionString: url ?? process.env.DATABASE_URL ?? "",
	});
	const db = drizzle(client, { schema: {} });

	return { db, client };
}

export async function ping(db: DB) {
	return db.execute(sql`SELECT 1`);
}

export type DB = Awaited<ReturnType<typeof setupDB>>["db"];
