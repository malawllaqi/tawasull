import { infiniteQueryOptions } from "@tanstack/react-query";
import type { NotificationQueryParams } from "@tawasull/shared";
import { getNotificationsFn } from "@/functions/notification";

const QUERY_KEY = "notifications";
export function createNotificationsQueryOptions(
	params: NotificationQueryParams = {}
) {
	return infiniteQueryOptions({
		queryKey: [QUERY_KEY, params],
		queryFn: ({ signal }) =>
			// getNotificationsFn({ page: pageParam.toString() }),
			getNotificationsFn({ signal, data: params }),
		initialPageParam: 1,
		getNextPageParam: (lastPage) =>
			lastPage.hasMore ? lastPage.currentPage + 1 : undefined,
	});
}
