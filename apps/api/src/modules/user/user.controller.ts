import type { FastifyReply, FastifyRequest } from "fastify";
import { StatusCodes } from "http-status-codes";
import type z from "zod";
import { httpError } from "@/utils/http";
import { logger } from "@/utils/logger";
import { PostgresErrorCode, type PostgresErrorType } from "@/utils/types";
import type { getUsersSchema, updateUserSchema } from "./user.schema";
import { getUsers, updateUser } from "./user.service";

export async function getCurrentUser(
	request: FastifyRequest,
	reply: FastifyReply
) {
	return reply.send(request.user);
}

export async function getUsersHandler(
	request: FastifyRequest<{
		Querystring: z.infer<typeof getUsersSchema.querystring>;
	}>,
	reply: FastifyReply
) {
	const { limit, page } = request.query;

	try {
		const result = await getUsers({ page, limit }, request.db);

		return reply.status(200).send(result);
	} catch (error) {
		const e = error as PostgresErrorType;
		logger.error({ error }, "getUsers failed to get users");
		return httpError({
			reply,
			message: "Failed to get users",
			code: StatusCodes.INTERNAL_SERVER_ERROR,
			cause: e.message,
		});
	}
}

export async function updateUserController(
	request: FastifyRequest<{ Body: z.infer<typeof updateUserSchema.body> }>,
	reply: FastifyReply
) {
	try {
		const userResult = await updateUser(
			{ ...request.body, currentUser: request.user },
			request.db
		);

		if (!userResult) {
			return httpError({
				reply,
				code: StatusCodes.NOT_FOUND,
				message: "User not found",
			});
		}

		reply.status(200).send(userResult);
	} catch (error) {
		const e = error as PostgresErrorType;

		if (e.cause.code === PostgresErrorCode.UNIQUE_VIOLATION) {
			return httpError({
				reply,
				message: "Username already exists",
				code: StatusCodes.CONFLICT,
			});
		}
		logger.error({ error }, "updateUser failed to update user");
		return httpError({
			reply,
			message: "Failed to update user",
			code: StatusCodes.INTERNAL_SERVER_ERROR,
			cause: e.message,
		});
	}
}
