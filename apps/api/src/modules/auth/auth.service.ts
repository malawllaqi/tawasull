import { auth } from "@tawasull/auth";
import type { DB } from "@tawasull/db";
import { logger } from "@/utils/logger";

export async function createUser(
	input: { email: string; password: string },
	db: DB,
) {
	const { email, password } = input;

	try {
		const res = await auth.api.signInEmail({ body: { email, password } });

		return res;
	} catch (error) {
		const message = error instanceof Error ? error.message : "Unknown error";
		logger.error({ message }, "createUser: failed to create user");
		throw error;
	}
}
