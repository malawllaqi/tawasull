import { type DB, setupDB } from "@tawasull/db";
import * as schema from "@tawasull/db/schema/auth";
import { type BetterAuthOptions, betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { openAPI, username } from "better-auth/plugins";
import { createAuthClient } from "better-auth/react"; // make sure to import from better-auth/react

const db = (await setupDB()).db;

export const auth = betterAuth<BetterAuthOptions>({
	database: drizzleAdapter(db, {
		provider: "pg",
		schema: schema,
	}),
	trustedOrigins: [process.env.CORS_ORIGIN || ""],
	emailAndPassword: {
		enabled: true,
	},
	plugins: [username(), openAPI()],
	advanced: {
		disableOriginCheck: true,
		defaultCookieAttributes: {
			sameSite: "none",
			secure: true,
			httpOnly: true,
		},
	},
});

export function initAuth(options: {
	baseUrl: string;
	productionUrl: string;
	secret: string | undefined;
	db: DB;
}) {
	const config = {
		database: drizzleAdapter(options.db, {
			provider: "pg",
			schema: schema,
		}),
		trustedOrigins: [process.env.CORS_ORIGIN || ""],
		emailAndPassword: {
			enabled: true,
		},
		baseURL: options.baseUrl,
		secret: options.secret,
		plugins: [username(), openAPI()],
		advanced: {
			disableOriginCheck: true,
			defaultCookieAttributes: {
				sameSite: "none",
				secure: true,
				httpOnly: true,
			},
		},
	} satisfies BetterAuthOptions;

	return betterAuth(config);
}

export type Auth = ReturnType<typeof initAuth>;
export type Session = Auth["$Infer"]["Session"];
