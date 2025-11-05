import type { auth } from "@tawasull/auth";

export type Session = typeof auth.$Infer.Session.session;
export type User = typeof auth.$Infer.Session.user;

export interface PostgresErrorType extends Error {
	code: string;
	detail?: string;
}

export enum PostgresErrorCode {
	UNIQUE_VIOLATION = "23505",
	FOREIGN_KEY_VIOLATION = "23503",
	NOT_NULL_VIOLATION = "23502",
}
