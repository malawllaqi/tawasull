import type { DB, InferInsertModel } from "@tawasull/db";
import { post } from "@tawasull/db/schema";
import { logger } from "@/utils/logger";

export async function createPost(
	input: Omit<InferInsertModel<typeof post>, "">,
	db: DB,
) {
	try {
		const result = await db
			.insert(post)
			.values({ ...input })
			.returning();

		return result;
	} catch (error) {
		const message = error instanceof Error ? error.message : "Unknown error";
		logger.error({ message, input }, "createPost: failed to create post");
		throw error;
	}
}
