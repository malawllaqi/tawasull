import "dotenv/config";
import { ping, setupDB } from "@tawasull/db";
import { config, getEnv } from "./utils/env";
import { logger } from "./utils/logger";
import { buildServer } from "./utils/server";

async function main() {
	const { db } = await setupDB();
	const PORT = getEnv("PORT");
	const HOST = getEnv("HOST");

	try {
		await ping(db);
		logger.info("database connected");
	} catch (err) {
		logger.error(err, "ping failed");
		process.exit(1);
	}

	const server = await buildServer({ db });
	try {
		await server.listen({ port: PORT, host: HOST });
	} catch (err) {
		server.log.error(err);
		process.exit(1);
	}

	logger.info(config, "using config ⚙️");
	await server.ready();
}

main();
