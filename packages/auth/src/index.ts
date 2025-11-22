import type { DB } from "@tawasull/db";
import * as schema from "@tawasull/db/schema/auth";
import { type BetterAuthOptions, betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { openAPI, username } from "better-auth/plugins";

export function initAuth(options: {
	baseUrl: string;
	productionUrl: string;
	secret: string | undefined;
	db: DB;
}) {
	const config = {
		database: drizzleAdapter(options.db, {
			provider: "pg",
			schema,
		}),
		user: {
			additionalFields: {
				username: {
					type: "string",
					defaultValue: `user${Math.floor(Math.random() * 1_000_000_000)}`,
				},
			},
		},
		socialProviders: {
			google: {
				clientId: process.env.GOOGLE_CLIENT_ID as string,
				clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
				redirectURI: "http://localhost:3001/api/auth/callback/google",
			},
		},
		trustedOrigins: [process.env.WEBAPP_URL || ""],
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
