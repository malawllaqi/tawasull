import pino, { type LoggerOptions } from "pino";

export const envToLogger: Record<
	"development" | "production" | "test",
	LoggerOptions | boolean
> = {
	development: {
		transport: {
			target: "pino-pretty",
			options: {
				translateTime: "HH:MM:ss Z",
				ignore: "pid,hostname",
			},
		},
	},
	production: true,
	test: false,
};

export const logger = pino({
	// level: config.LOG_LEVEL,
	// level: "",
	transport: {
		target: "pino-pretty",
		options: {
			colorize: true,
		},
	},
	redact: ["DATABASE_URL"],
});
