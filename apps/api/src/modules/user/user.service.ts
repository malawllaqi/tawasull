import { type DB, desc, eq } from "@tawasull/db";
import { user } from "@tawasull/db/schema/auth";
import type { z } from "zod";
import { env } from "@/utils/env";
import { logger } from "@/utils/logger";
import { uploadImage } from "@/utils/s3";
import type { updateUserSchema } from "./user.schema";

export async function getUsers(
	{
		page,
		limit = 20,
	}: {
		limit?: number;
		page: number;
	},
	db: DB
) {
	const pageSize = Math.min(limit, 20);

	try {
		const result = await db.query.user.findMany({
			orderBy: desc(user.createdAt),
			limit: pageSize,
			offset: (page - 1) * pageSize,
		});

		const count = await db.$count(user);

		return {
			items: result,
			totalItems: count,
			totalPages: Math.ceil(count / pageSize),
			currentPage: page,
			hasMore: page * pageSize < count,
		};
	} catch (error) {
		const message = error instanceof Error ? error.message : "Unknown error";
		logger.error({ message }, "getUsers failed to get users");
		throw error;
	}
}
export async function updateUser(
	input: z.infer<typeof updateUserSchema.body> & { userId: string },
	db: DB
) {
	console.log(input);
	try {
		if (!input.file) {
			const updatedUserWithoutFile = await db
				.update(user)
				.set({
					...input,
				})
				.where(eq(user.id, input.userId))
				.returning();

			return updatedUserWithoutFile[0];
		}

		const { key } = await uploadImage({ file: input.file });

		const result = await db
			.update(user)
			.set({
				...input,
				image: `${env.AWS_CF_URL}/${key}`,
				objectKey: key,
			})
			.where(eq(user.id, input.userId))
			.returning();

		return result[0];
	} catch (error) {
		const message = error instanceof Error ? error.message : "Unknown error";
		logger.error({ message, input }, "updateUser: failed to update user");
		throw error;
	}
}
