import { queryOptions } from "@tanstack/react-query";
import { getUserDetails } from "@/functions/user";

type UserQueryParams = {
	username: string;
};

export const userDetailsQueryOptions = (params: UserQueryParams) =>
	queryOptions({
		queryKey: ["user", params.username],
		queryFn: ({ signal }) => getUserDetails({ signal, data: params }),
	});
