import type { PostAPIResponse, PostQueryParams } from "@tawasull/shared";
import { client } from "@/lib/client";

export async function getPosts(
	// queryOps: { page?: number } = {}
	queryOps: PostQueryParams = {}
): Promise<PostAPIResponse> {
	const { page } = queryOps;
	const queryParams = new URLSearchParams();

	if (page) queryParams.append("page", page.toString());
	const queryString = queryParams.toString();
	try {
		const response = await client(
			`/v1/post${queryString ? `?${queryString}` : ""}`
		);

		return response.data;
	} catch (err) {
		console.log(err);
		throw err;
	}
}
