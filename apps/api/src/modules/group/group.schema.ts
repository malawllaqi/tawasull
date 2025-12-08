import { errorResponses } from "@/lib/http";

export const getGroupsSchema = {
	tags: ["group"],
	response: {
		...errorResponses,
	},
};
