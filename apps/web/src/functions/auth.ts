import { createServerFn } from "@tanstack/react-start";
import { getRequestHeaders } from "@tanstack/react-start/server";
import { authMiddleware } from "@/middleware/auth";

export const getCookieHeaders = createServerFn({ method: "GET" }).handler(
	async () => ({
		Cookie: getRequestHeaders().get("Cookie") || "",
	})
);

export const getUser = createServerFn({ method: "GET" })
	.middleware([authMiddleware])
	.handler(async ({ context }) => context.session);
