import type { FastifyReply, FastifyRequest } from "fastify";
import { StatusCodes } from "http-status-codes";
import type z from "zod";
import { httpError } from "@/utils/http";
import { logger } from "@/utils/logger";
import { PostgresErrorCode, type PostgresErrorType } from "@/utils/types";
import type {
	followsUserSchema,
	getUserSchema,
	getUsersSchema,
	updateUserSchema,
} from "./user.schema";
import {
	followUser,
	getUser,
	getUsers,
	unfollowUser,
	updateUser,
} from "./user.service";

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
		const result = await getUsers(
			{ page, limit, currentUserId: request.user.id },
			request.db
		);

		return reply.status(200).send(result);
	} catch (error) {
		const e = error as PostgresErrorType;
		logger.error({ error }, "getUsers() failed to get users");
		return httpError({
			reply,
			message: "Failed to get users",
			code: StatusCodes.INTERNAL_SERVER_ERROR,
			cause: e.message,
		});
	}
}

export async function getUserHandler(
	request: FastifyRequest<{ Params: z.infer<typeof getUserSchema.params> }>,
	reply: FastifyReply
) {
	const { username } = request.params;
	const result = await getUser(
		{ username, currentUserId: request.user.id },
		request.db
	);

	if (!result) {
		return httpError({
			reply,
			code: StatusCodes.NOT_FOUND,
			message: "User not found",
		});
	}

	return reply.status(200).send(result);
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
		logger.error({ error }, "updateUser() failed to update user");
		return httpError({
			reply,
			message: "Failed to update user",
			code: StatusCodes.INTERNAL_SERVER_ERROR,
			cause: e.message,
		});
	}
}

export async function followUserHandler(
	request: FastifyRequest<{
		Params: z.infer<typeof followsUserSchema.params>;
	}>,
	reply: FastifyReply
) {
	try {
		const { userId } = request.params;
		const result = await followUser(
			{ currentUserId: request.user.id, targetUserId: userId },
			request.db
		);

		if (!result) {
			return httpError({
				reply,
				code: StatusCodes.CONFLICT,
				message: "Already following or user not found",
			});
		}

		reply.status(200).send(result);
	} catch (error) {
		const e = error as PostgresErrorType;

		logger.error({ error }, "followUser() failed follow user");
		return httpError({
			reply,
			message: "Failed to follow user",
			code: StatusCodes.INTERNAL_SERVER_ERROR,
			cause: e.message,
		});
	}
}
export async function unfollowUserHandler(
	request: FastifyRequest<{
		Params: z.infer<typeof followsUserSchema.params>;
	}>,
	reply: FastifyReply
) {
	try {
		const { userId } = request.params;
		const result = await unfollowUser(
			{ currentUserId: request.user.id, targetUserId: userId },
			request.db
		);

		reply.status(200).send(result);
	} catch (error) {
		const e = error as PostgresErrorType;

		logger.error({ error }, "unfollowUser() failed ufollow user");
		return httpError({
			reply,
			message: "Failed to unfollow user",
			code: StatusCodes.INTERNAL_SERVER_ERROR,
			cause: e.message,
		});
	}
}
