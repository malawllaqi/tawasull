import type { FastifyCorsOptions } from "@fastify/cors";

export const corsOptions: FastifyCorsOptions = {
	origin: process.env.CLIENT_ORIGIN || "http://localhost:3000",
	methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
	allowedHeaders: ["Content-Type", "Authorization", "X-Requested-With"],
	credentials: true,
	maxAge: 86_400,
};
