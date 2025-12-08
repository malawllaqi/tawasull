import { createServerFn } from "@tanstack/react-start";
import type { NotificationAPIResponse } from "@tawasull/shared";
import z from "zod";
import { api } from "@/lib/ky";
import { authMiddleware } from "@/middleware/auth";
import { getCookieHeaders } from "./auth";

export const getNotificationsFn = createServerFn({ method: "GET" })
	.middleware([authMiddleware])
	.inputValidator(
		z.object({
			search: z.string().optional(),
			limit: z.string().optional(),
			page: z.string().optional(),
		})
	)
	.handler(async ({ data }) => {
		// await new Promise((resolve) => setTimeout(resolve, 5000));

		try {
			const { search, limit, page } = data;
			// Build query params only if needed
			const params: Record<string, string> = {};
			if (search) params.search = search;
			if (limit) params.limit = String(limit);
			if (page) params.page = String(page);
			const queryString = new URLSearchParams(params).toString();

			const res = await api
				.get(`notification${queryString ? `?${queryString}` : ""}`, {
					headers: await getCookieHeaders(),
				})
				.json<NotificationAPIResponse>();

			return res;
		} catch (error) {
			console.log(error);
			throw error;
		}
	});
