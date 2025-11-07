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
	test("success - get posts", async () => {
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

describe("GET /api/post/:postId", () => {
	test("success - get post by id", async () => {
		const app = await buildServer({ db });

		const cookie = await getCookie(app);
		const postData = {
			content: faker.lorem.paragraph({ max: 100, min: 10 }),
		};

		const newPost = await app.inject({
			method: "POST",
			url: "/api/v1/post",
			payload: postData,
			headers: {
				cookie,
			},
		});

		const { id } = newPost.json();

		const res = await app.inject({
			method: "GET",
			url: `/api/v1/post/${id}`,
			headers: {
				cookie,
			},
		});

		expect(res.statusCode).toBe(200);
		expect(res.json().id).toBe(newPost.json().id);
	});

	test("faill - should throw an error when post not found", async () => {
		const app = await buildServer({ db });

		const randomUUId = faker.string.uuid();

		const res = await app.inject({
			method: "GET",
			url: `/api/v1/post/${randomUUId}`,
			headers: {
				cookie: await getCookie(app),
			},
		});

		expect(res.statusCode).toBe(404);
	});
});

describe("PATCH /api/post/:postId", () => {
	test("success - update a post by id", async () => {
		const app = await buildServer({ db });

		const cookie = await getCookie(app);

		const postData = {
			content: faker.lorem.paragraph({ max: 100, min: 10 }),
		};

		const newPost = await app.inject({
			method: "POST",
			url: "/api/v1/post",
			payload: postData,
			headers: {
				cookie,
			},
		});

		const { id } = newPost.json();

		const updatedContent = faker.lorem.paragraph({ max: 100, min: 10 });

		const res = await app.inject({
			method: "PATCH",
			url: `/api/v1/post/${id}`,
			payload: {
				content: updatedContent,
			},
			headers: {
				cookie,
			},
		});

		expect(res.statusCode).toBe(200);
		expect(res.json().content).toBe(updatedContent);
	});

	test("faill - should throw an error when post not found", async () => {
		const app = await buildServer({ db });

		const randomUUId = faker.string.uuid();

		const res = await app.inject({
			method: "PATCH",
			url: `/api/v1/post/${randomUUId}`,
			payload: {
				content: faker.lorem.paragraph({ max: 100, min: 10 }),
			},
			headers: {
				cookie: await getCookie(app),
			},
		});

		expect(res.statusCode).toBe(404);
	});
});

describe("DELETE /api/post/:postId", () => {
	test("success - delete a post by id", async () => {
		const app = await buildServer({ db });

		const cookie = await getCookie(app);

		const postData = {
			content: faker.lorem.paragraph({ max: 100, min: 10 }),
		};

		const newPost = await app.inject({
			method: "POST",
			url: "/api/v1/post",
			payload: postData,
			headers: {
				cookie,
			},
		});

		const { id } = newPost.json();

		const res = await app.inject({
			method: "DELETE",
			url: `/api/v1/post/${id}`,
			headers: {
				cookie,
			},
		});

		expect(res.statusCode).toBe(200);
	});

	test("faill - should throw an error when post not found", async () => {
		const app = await buildServer({ db });

		const randomUUId = faker.string.uuid();

		const res = await app.inject({
			method: "DELETE",
			url: `/api/v1/post/${randomUUId}`,
			headers: {
				cookie: await getCookie(app),
			},
		});

		expect(res.statusCode).toBe(404);
	});
});
