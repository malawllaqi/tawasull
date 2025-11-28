import { notFound } from "@tanstack/react-router";
import { createServerFn } from "@tanstack/react-start";
import type { Post } from "@tawasull/shared";
import { z } from "zod";
import { api } from "@/lib/ky";
import { getCookieHeaders } from "./auth";

export const getPostById = createServerFn({ method: "GET" })
	.inputValidator(
		z.object({
			id: z.string(),
		})
	)
	.handler(async ({ data }) => {
		try {
			const res = await api(`post/${data.id}`, {
				headers: await getCookieHeaders(),
			}).json<Post>();

			return res;
		} catch (_error) {
			throw notFound();
		}
	});
