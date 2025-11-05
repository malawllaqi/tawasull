import { getEnv } from "./env";

export function getBaseUrl() {
	const enviroment = getEnv("NODE_ENV");
	const PORT = getEnv("PORT");
	const PRODUCTION_URL = getEnv("PRODUCTION_URL");
	if (enviroment === "production") {
		return `https://${PRODUCTION_URL}`;
	}
	// if (enviroment === "test") {
	// 	return `https://${env.VERCEL_URL}`;
	// }

	return `http://localhost:${PORT ?? 3000}`;
}
