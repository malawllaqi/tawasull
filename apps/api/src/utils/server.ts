import type { DB } from "@tawasull/db";
import Fastify from "fastify";
import { getEnv } from "./env";
import { envToLogger } from "./logger";

declare module "fastify" {
	interface FastifyRequest {
		db: DB;
	}
}

export async function buildServer(db: DB) {
	const environment = getEnv("NODE_ENV");
	const fastify = Fastify({
		logger: envToLogger[environment],
	});

	fastify.addHook("onRequest", async (req) => {
		req.db = db;
	});

	fastify.after(() => {
		fastify.get("/healthcheck", async () => {
			return { status: "ok" };
		});
	});

	return fastify;
}
