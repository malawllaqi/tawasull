import { notFound } from "@tanstack/react-router";
import { createServerFn } from "@tanstack/react-start";
import type { Comment } from "@tawasull/shared";
import { z } from "zod";
import { api } from "@/lib/ky";
import { getCookieHeaders } from "./auth";

export const getComments = createServerFn({ method: "GET" })
	.inputValidator(
		z.object({
			postId: z.string(),
		})
	)
	.handler(async ({ data }) => {
		try {
			const res = await api(`comment/${data.postId}`, {
				headers: await getCookieHeaders(),
			}).json<Comment[]>();

			return res;
		} catch (_error) {
			throw notFound();
		}
	});
