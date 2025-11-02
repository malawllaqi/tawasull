import { z } from "zod";

const schema = z.object({
	DATABASE_URL: z.string(),
	PORT: z.coerce.number(),
	HOST: z.string(),
	NODE_ENV: z
		.enum(["development", "production", "test"])
		.default("development"),
});

export type Env = z.infer<typeof schema>;

const parsed = schema.safeParse({
	DATABASE_URL: process.env.DATABASE_URL,
	PORT: process.env.PORT,
	HOST: process.env.HOST,
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

export function getEnv<K extends keyof Env>(env: K): Env[K];
export function getEnv<K extends keyof Env>(env: K[]): Pick<Env, K>;
export function getEnv<K extends keyof Env>(
	env: K | K[],
): Env[K] | Pick<Env, K> {
	if (Array.isArray(env)) {
		const result = {} as Pick<Env, K>;
		for (const key of env) {
			if (!key || !config[key]) {
				throw new Error(`💥 environment variable "${key}" is not defined`);
			}
			result[key] = config[key];
		}
		return result;
	}

	if (!env || !config[env]) {
		throw new Error(`💥 environment variable "${env}" is not defined`);
	}

	return config[env];
}
