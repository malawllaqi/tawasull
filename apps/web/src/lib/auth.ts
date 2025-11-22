import type { Auth } from "@tawasull/auth";
import { inferAdditionalFields } from "better-auth/client/plugins";
import { username } from "better-auth/plugins";
import { createAuthClient } from "better-auth/react";

export const authClient = createAuthClient({
	baseURL: import.meta.env.VITE_SERVER_URL,
	plugins: [username(), inferAdditionalFields<Auth>()],
});
