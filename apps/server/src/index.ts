import "dotenv/config";
import Fastify from "fastify";

const fastify = Fastify({
	logger: true,
});

fastify.get("/", async () => {
	return "OK";
});

fastify.listen({ port: 3000 }, (err) => {
	if (err) {
		fastify.log.error(err);
		process.exit(1);
	}
	console.log("Server running on port 3000");
});
