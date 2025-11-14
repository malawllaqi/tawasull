import { logger } from "./logger";

export function decodeCursor(
	cursorString: string
): { createdAt: Date; id: string } | null {
	try {
		const decoded = Buffer.from(cursorString, "base64").toString("utf-8");
		const parsed = JSON.parse(decoded);
		return {
			createdAt: new Date(parsed.createdAt),
			id: parsed.id,
		};
	} catch (error) {
		logger.error({ error }, "Failed to decode cursor");
		return null;
	}
}
