import { notFound } from "@tanstack/react-router";
import { createServerFn } from "@tanstack/react-start";
import type { User } from "@tawasull/shared/types/user";
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
