import "dotenv/config";
import { ping, setupDB } from "@tawasull/db";
import { config, env } from "./utils/env";
import { logger } from "./utils/logger";
import { buildServer } from "./utils/server";

async function main() {
	const { db } = await setupDB();

	try {
		await ping(db);
		logger.info("database connected");
	} catch (err) {
		logger.error(err, "ping failed");
		process.exit(1);
	}

	const server = await buildServer({ db });
	try {
		await server.listen({ port: env.PORT, host: env.HOST });
	} catch (err) {
		server.log.error(err);
		process.exit(1);
	}

	logger.info(config, "using config ⚙️");
	await server.ready();
}

main();
