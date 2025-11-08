import { initAuth } from "@tawasull/auth";
import type { DB } from "@tawasull/db";
import { env } from "./env";
import { getBaseUrl } from "./url";

export function setupAuth(db: DB) {
	return initAuth({
		db: db,
		baseUrl: getBaseUrl(),
		productionUrl: env.PRODUCTION_URL,
		secret: env.BETTER_AUTH_SECRET,
	});
}
