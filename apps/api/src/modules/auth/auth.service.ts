import type { Auth } from "@tawasull/auth";
import { logger } from "@/utils/logger";

export async function createUser(
	input: {
		email: string;
		password: string;
		username: string;
		name: string;
	},
	auth: Auth,
) {
	const { email, password, name, username } = input;

	try {
		const res = await auth.api.signUpEmail({
			body: { email, password, username, name },
		});

		return res;
	} catch (error) {
		const message = error instanceof Error ? error.message : "Unknown error";
		logger.error({ message }, "createUser: failed to create user");
		throw error;
	}
}
