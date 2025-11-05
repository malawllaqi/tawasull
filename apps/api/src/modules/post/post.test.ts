import { faker } from "@faker-js/faker";
import type { FastifyInstance } from "fastify";
import { describe, expect, test } from "vitest";
import { db } from "@/test/setup";
import { setupAuth } from "@/utils/auth";
import { buildServer } from "@/utils/server";
import { createUser } from "../auth/auth.service";

async function getCookie(app: FastifyInstance) {
	const email = faker.internet.email();
	const displayName = faker.internet.displayName();
	const username = faker.internet.username();
	const password = faker.internet.password();

	await createUser(
		{ email, password, name: displayName, username },
		setupAuth(db),
	);

	const loginResponse = await app.inject({
		method: "POST",
		url: "/api/auth/sign-in/email",
		payload: { email, password },
	});
	return loginResponse.headers["set-cookie"];
}

describe("POST /api/post", () => {
	test("success - create a post", async () => {
		const app = await buildServer({ db });

		const postData = {
			content: faker.lorem.paragraph({ max: 100, min: 10 }),
		};

		const res = await app.inject({
			method: "POST",
			url: "/api/v1/post",
			payload: postData,
			headers: {
				cookie: await getCookie(app),
			},
		});

		expect(res.statusCode).toBe(201);
	});

	test("fail - create a test without authentication", async () => {
		const app = await buildServer({ db });

		const postData = {
			content: faker.lorem.paragraph({ max: 100, min: 10 }),
		};

		const res = await app.inject({
			method: "POST",
			url: "/api/v1/post",
			payload: postData,
		});

		expect(res.statusCode).toBe(401);
	});
});

describe("GET /api/post", () => {
	test("success - get jobs", async () => {
		const app = await buildServer({ db });

		const res = await app.inject({
			method: "GET",
			url: "/api/v1/post",
			headers: {
				cookie: await getCookie(app),
			},
		});

		expect(res.statusCode).toBe(200);
		expect(Array.isArray(res.json().items)).toBe(true);
	});
});
