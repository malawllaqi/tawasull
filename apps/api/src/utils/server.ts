import fastifyCookie from "@fastify/cookie";
import type { Auth, Session } from "@tawasull/auth";
import type { DB } from "@tawasull/db";
import Fastify, { type FastifyReply, type FastifyRequest } from "fastify";
import {
	serializerCompiler,
	validatorCompiler,
} from "fastify-type-provider-zod";
import { authRouter } from "@/modules/auth/auth.route";
import { postRouter } from "@/modules/post/post.route";
import { setupAuth } from "./auth";
import { getEnv } from "./env";
import { envToLogger } from "./logger";

declare module "fastify" {
	interface FastifyRequest {
		db: DB;
		auth: Auth;
		session: Session["session"];
		user: Session["user"];
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

export async function buildServer({ db }: { db: DB }) {
	const fastify = Fastify({
		logger: envToLogger[getEnv("NODE_ENV")],
	});

	// Add schema validator and serializer
	fastify.setValidatorCompiler(validatorCompiler);
	fastify.setSerializerCompiler(serializerCompiler);

	fastify.register(fastifyCookie);
	const auth = setupAuth(db);

	fastify.addHook("onRequest", async (req) => {
		req.db = db;
		req.auth = auth;
	});

	fastify.addHook("onRequest", async (req) => {
		const sessionData = await req.auth.api.getSession({
			headers: req.headers,
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
