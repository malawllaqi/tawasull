import { env } from "./env";

export function getBaseUrl() {
	const enviroment = env.NODE_ENV;
	const PORT = env.PORT;
	const PRODUCTION_URL = env.PRODUCTION_URL;
	if (enviroment === "production") {
		return `https://${PRODUCTION_URL}`;
	}
	// if (enviroment === "test") {
	// 	return `https://${env.VERCEL_URL}`;
	// }

	return `http://localhost:${PORT ?? 3000}`;
}
