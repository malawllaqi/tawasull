import { queryOptions, type UseQueryOptions } from "@tanstack/react-query";
import type { User, UserAPIResponse } from "@tawasull/shared";
import { getUserDetails, getUsersFn } from "@/functions/user";

type UserQueryParams = {
	username: string;
};

const KEY = "users";

export function userDetailsQueryOptions<TData = User, TError = Error>(
	params: UserQueryParams,
	options?: Omit<UseQueryOptions<User, TError, TData>, "queryKey" | "queryFn">
) {
	return queryOptions({
		...options,
		queryKey: [KEY, params],
		queryFn: ({ signal }) => getUserDetails({ signal, data: params }),
	});
}

type UsersQueryParams = {
	search?: string;
	limit?: string;
	page?: string;
	id?: string;
};
export function createUsersQueryOptions<
	TData = UserAPIResponse,
	TError = Error,
>(
	params: UsersQueryParams = {},
	options?: Omit<
		UseQueryOptions<UserAPIResponse, TError, TData>,
		"queryKey" | "queryFn"
	>
) {
	return queryOptions({
		...options,
		queryKey: [KEY, params],
		queryFn: () => getUsersFn({ data: params }),
	});
}
