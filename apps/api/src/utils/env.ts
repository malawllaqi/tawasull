import { z } from "zod";

const schema = z.object({
	DATABASE_URL: z.string(),
	DEV_DATABASE_URL: z.string(),
	PORT: z.coerce.number(),
	HOST: z.string(),
	PRODUCTION_URL: z.string(),
	CLIENT_ORIGIN: z.string(),
	BETTER_AUTH_SECRET: z.string(),
	BUCKET_NAME: z.string(),
	WEBAPP_URL: z.string(),
	BUCKET_REGION: z.string(),
	AWS_ACCESS_KEY: z.string(),
	AWS_SECRET_ACCESS_KEY: z.string(),
	AWS_CF_URL: z.string(),
	GOOGLE_CLIENT_ID: z.string(),
	GOOGLE_CLIENT_SECRET: z.string(),
	PUSHER_APPID: z.string(),
	PUSHER_KEY: z.string(),
	PUSHER_SECRET: z.string(),
	PUSHER_CLUSTER: z.string(),
	NODE_ENV: z
		.enum(["development", "production", "test"])
		.default("development"),
});

export type Env = z.infer<typeof schema>;

const parsed = schema.safeParse({
	DATABASE_URL: process.env.DATABASE_URL,
	DEV_DATABASE_URL: process.env.DEV_DATABASE_URL,
	PORT: process.env.PORT,
	HOST: process.env.HOST,
	PRODUCTION_URL: process.env.PRODUCTION_URL,
	CLIENT_ORIGIN: process.env.CLIENT_ORIGIN,
	BETTER_AUTH_SECRET: process.env.BETTER_AUTH_SECRET,
	BUCKET_NAME: process.env.BUCKET_NAME,
	WEBAPP_URL: process.env.WEBAPP_URL,
	BUCKET_REGION: process.env.BUCKET_REGION,
	AWS_ACCESS_KEY: process.env.AWS_ACCESS_KEY,
	AWS_SECRET_ACCESS_KEY: process.env.AWS_SECRET_ACCESS_KEY,
	AWS_CF_URL: process.env.AWS_CF_URL,
	GOOGLE_CLIENT_ID: process.env.GOOGLE_CLIENT_ID,
	GOOGLE_CLIENT_SECRET: process.env.GOOGLE_CLIENT_SECRET,
	PUSHER_APPID: process.env.PUSHER_APPID,
	PUSHER_KEY: process.env.PUSHER_KEY,
	PUSHER_SECRET: process.env.PUSHER_SECRET,
	PUSHER_CLUSTER: process.env.PUSHER_CLUSTER,
	NODE_ENV: process.env.NODE_ENV,
});

if (!parsed.success) {
	console.error("❌ Invalid environment variables:");
	for (const issue of parsed.error.issues) {
		console.error(`  ${issue.path.join(".")}: ${issue.message}`);
	}
	throw new Error("💥 Environment validation failed");
}

export const config = parsed.data;
export const env = parsed.data;
