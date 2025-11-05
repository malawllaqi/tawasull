import { faker } from "@faker-js/faker";
import type { FastifyInstance } from "fastify";

async function getCookie(app: FastifyInstance) {
	const email = faker.internet.email();
	const password = faker.internet.password();
}
