import { faker } from "@faker-js/faker";
import { setupDB } from "@tawasull/db";
import { createUser } from "@/modules/auth/auth.service";
import { createPost } from "@/modules/post/post.service";
import { setupAuth } from "@/utils/auth";

async function main() {
	const { db } = await setupDB();

	console.log("🚀 seeding data into db...");
	const user = await createUser(
		{
			email: faker.internet.email(),
			password: faker.internet.password(),
			name: faker.person.fullName(),
			username: faker.internet.username(),
		},
		setupAuth(db)
	);

	if (!user) {
		throw new Error("Failed seeding");
	}
	await Promise.all(
		Array.from({ length: 20 }, () =>
			createPost(
				{
					content: faker.lorem.paragraph(),
					userId: user.user.id,
				},
				db
			)
		)
	);

	process.exit(0);
}

main();
