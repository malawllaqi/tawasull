import fastifyCookie from "@fastify/cookie";
import { auth } from "@tawasull/auth";
import type { DB } from "@tawasull/db";
import Fastify, { type FastifyReply, type FastifyRequest } from "fastify";
import {
	serializerCompiler,
	validatorCompiler,
} from "fastify-type-provider-zod";
import { authRouter } from "@/modules/auth/auth.route";
import { postRouter } from "@/modules/post/post.route";
import { getEnv } from "./env";
import { envToLogger } from "./logger";
import type { Session, User } from "./types";

declare module "fastify" {
	interface FastifyRequest {
		db: DB;
		session: Session;
		user: User;
	}

	interface FastifyInstance {
		authenticate: typeof authenticate;
	}
}

async function authenticate(req: FastifyRequest, reply: FastifyReply) {
	if (!req.user) {
		reply.code(401).send({ message: "Unauthorized" });
	}
}
export async function buildServer(db: DB) {
	const fastify = Fastify({
		logger: envToLogger[getEnv("NODE_ENV")],
	});

	// Add schema validator and serializer
	fastify.setValidatorCompiler(validatorCompiler);
	fastify.setSerializerCompiler(serializerCompiler);

	fastify.register(fastifyCookie);

	fastify.addHook("onRequest", async (req) => {
		req.db = db;
	});

	fastify.addHook("onRequest", async (req) => {
		const sessionData = await auth.api.getSession({
			headers: new Headers(req.headers as Record<string, string>),
		});

		if (sessionData) {
			req.session = sessionData.session;
			req.user = sessionData.user;
		}
	});

	fastify.decorate("authenticate", authenticate);

	fastify.after(() => {
		fastify.register(authRouter);
		fastify.register(postRouter, { prefix: "/api/v1/post" });
		fastify.get("/healthcheck", async () => {
			return { status: "ok" };
		});
	});

	return fastify;
}
