import { notFound } from "@tanstack/react-router";
import { createServerFn } from "@tanstack/react-start";
import type { User, UserAPIResponse } from "@tawasull/shared/types/user";
import { z } from "zod";
import { api } from "@/lib/ky";
import { authMiddleware } from "@/middleware/auth";
import { getCookieHeaders } from "./auth";

export const getUserDetails = createServerFn({ method: "GET" })
	.middleware([authMiddleware])
	.inputValidator(
		z.object({
			username: z.string(),
		})
	)
	.handler(async ({ data }) => {
		try {
			const res = await api
				.get(`user/${data.username}`, {
					headers: await getCookieHeaders(),
				})
				.json<User>();

			return res;
		} catch (_error) {
			throw notFound();
		}
	});

export const getUsersFn = createServerFn({ method: "GET" })
	.middleware([authMiddleware])
	.inputValidator(
		z.object({
			search: z.string().optional(),
			limit: z.string().optional(),
			page: z.string().optional(),
			id: z.string().optional(),
		})
	)
	.handler(async ({ data }) => {
		// await new Promise((resolve) => setTimeout(resolve, 5000));

		try {
			const { search, limit, page, id } = data;
			// Build query params only if needed
			const params: Record<string, string> = {};
			if (search) params.search = search;
			if (limit) params.limit = String(limit);
			if (page) params.page = String(page);
			if (id) params.id = id;
			const queryString = new URLSearchParams(params).toString();

			const res = await api
				.get(`user${queryString ? `?${queryString}` : ""}`, {
					headers: await getCookieHeaders(),
				})
				.json<UserAPIResponse>();

			return res;
		} catch (error) {
			console.log(error);
			throw error;
		}
	});
