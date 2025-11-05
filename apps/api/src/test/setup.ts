import { beforeEach } from "node:test";
import { type Client, type DB, setupDB, sql } from "@tawasull/db";
import {
	PostgreSqlContainer,
	type StartedPostgreSqlContainer,
} from "@testcontainers/postgresql";
import { afterAll, beforeAll } from "vitest";

let container: StartedPostgreSqlContainer;
let db: DB;
let dbClient: Client;

const timeout = 30_000;

beforeAll(async () => {
	container = await new PostgreSqlContainer("postgres:13.3-alpine").start();

	const DATABASE_URL = container.getConnectionUri();
	process.env.DATABASE_URL = DATABASE_URL;

	const database = await setupDB(DATABASE_URL);

	dbClient = database.client;
	db = database.db;
});

beforeEach(async () => {
	await db.execute(sql`
        TRUNCATE TABLE user CASCADE;
        TRUNCATE TABLE session CASCADE;
        TRUNCATE TABLE account CASCADE;
        TRUNCATE TABLE verification CASCADE;
        TRUNCATE TABLE post CASCADE;
      `);
});

afterAll(async () => {
	await dbClient.end();
	await container?.stop();
}, timeout);

export { db };
