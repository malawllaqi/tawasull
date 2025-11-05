import { initAuth } from "@tawasull/auth";
import type { DB } from "@tawasull/db";
import { getEnv } from "./env";
import { getBaseUrl } from "./url";

export function setupAuth(db: DB) {
	return initAuth({
		db: db,
		baseUrl: getBaseUrl(),
		productionUrl: getEnv("PRODUCTION_URL"),
		secret: getEnv("BETTER_AUTH_SECRET"),
	});
}
