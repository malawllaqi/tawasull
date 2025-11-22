import { type ClassValue, clsx } from "clsx";
import { HTTPError } from "ky";
import { toast } from "sonner";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
	return twMerge(clsx(inputs));
}

export async function catchError(error: Error) {
	const msg = "Unknown error";
	if (error instanceof HTTPError) {
		const e = await error.response.json();
		return toast.error(e?.message || msg);
	}

	return toast.error(msg);
}
