import type { FastifyCorsOptions } from "@fastify/cors";
import { env } from "./env";

export const corsOptions: FastifyCorsOptions = {
	origin: env.WEBAPP_URL || "http://localhost:3000",
	methods: ["GET", "POST", "PATCH", "PUT", "DELETE", "OPTIONS"],
	allowedHeaders: ["Content-Type", "Authorization", "X-Requested-With"],
	credentials: true,
	maxAge: 86_400,
};
