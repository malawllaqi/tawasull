import {
	useQueryClient,
	useSuspenseInfiniteQuery,
} from "@tanstack/react-query";
import { Link, useNavigate } from "@tanstack/react-router";
import type { Notification } from "@tawasull/shared";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import updateLocale from "dayjs/plugin/updateLocale";
import { Bell } from "lucide-react";
import { useEffect, useState } from "react";
import { Button, buttonVariants } from "@/components/ui/button";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ScrollArea } from "@/components/ui/scroll-area";
import { UserAvatarProfile } from "@/components/user-avatar-profile";
import { pusher } from "@/lib/pusher";
import type { CurrentUserProps } from "@/lib/types";
import { cn } from "@/lib/utils";
import { createNotificationsQueryOptions } from "../queries";
import { EmptyNotifications } from "./empty-notification";
import { useMarkAsRead } from "./hooks/use-notification";

dayjs.extend(relativeTime);
dayjs.extend(relativeTime);
dayjs.extend(updateLocale);

// Customize to short format
dayjs.updateLocale("en", {
	relativeTime: {
		future: "in %s",
		past: "%s ago",
		s: "now",
		m: "1m",
		mm: "%dm",
		h: "1h",
		hh: "%dh",
		d: "1d",
		dd: "%dd",
		M: "1mo",
		MM: "%dmo",
		y: "1y",
		yy: "%dy",
	},
});

type AppNotificationsProps = {} & CurrentUserProps;
export function AppNotifications({ currentUser }: AppNotificationsProps) {
	const queryClient = useQueryClient();
	const { data } = useSuspenseInfiniteQuery({
		...createNotificationsQueryOptions({ limit: "10" }),
	});
	const navigate = useNavigate();

	const { mutate, isPending } = useMarkAsRead();

	const notifications = data.pages.flatMap((page) => page.items);

	const [open, setOpen] = useState(false);
	const [counter, setCounter] = useState(
		notifications.filter((n) => !n.isRead).length ?? 0
	);

	console.log(notifications[0]?.createdAt);

	useEffect(() => {
		const channel = pusher.subscribe(`user-${currentUser.id}`);

		channel.bind("new-notification", (_data: Notification) => {
			queryClient.invalidateQueries({
				queryKey: createNotificationsQueryOptions({
					limit: "10",
				}).queryKey,
			});
			setCounter((prevCounter) => prevCounter + 1);
		});

		return () => {
			pusher.unsubscribe("new-notification");
			pusher.disconnect();
		};
	}, []);

	return (
		<DropdownMenu
			onOpenChange={(op) => {
				if (open)
					mutate(undefined, {
						onSuccess: () => {
							setCounter(0);
						},
					});

				setOpen(op);
			}}
			open={open}
		>
			<DropdownMenuTrigger asChild>
				<Button className="relative overflow-hidden" variant="outline">
					<Bell />
					{counter > 0 ? (
						<span className="absolute top-0 right-1.5 flex h-3 w-3 items-center justify-center rounded-full bg-red-400 text-white text-xs">
							{counter}
						</span>
					) : null}
				</Button>
			</DropdownMenuTrigger>
			<DropdownMenuContent align="end" className="w-80 p-0">
				{/* Header */}
				<div className="flex items-center justify-between border-b px-4 py-3">
					<h3 className="font-semibold text-base">Notifications</h3>
				</div>

				{notifications.length < 1 ? (
					<EmptyNotifications />
				) : (
					<ScrollArea className="h-[350px]">
						<div className="divide-y">
							{notifications.map((notification) => (
								<button
									className={cn(
										"flex w-full cursor-pointer items-start justify-between gap-3 px-4 py-3 transition-colors hover:bg-accent/50",
										notification.isRead ? "" : "bg-accent/50"
									)}
									disabled={isPending}
									key={notification.id}
									onClick={() => {
										if (notification.postId)
											navigate({
												to: "/$username/$postId",
												params: {
													postId: notification.postId,
													username: currentUser.username,
												},
											});
									}}
									type="button"
								>
									{/* Avatar with unread indicator */}
									<div className="relative shrink-0">
										<UserAvatarProfile
											name={notification.actor.name}
											url={notification.actor.image}
										/>
										{notification.isRead ? null : (
											<span className="absolute top-0 right-0 size-3 rounded-full border-2 border-white bg-blue-500" />
										)}
									</div>

									{/* Notification Content */}
									<div
										className={cn(
											"mr-auto max-w-[150px] text-start text-sm",
											notification.isRead ? "text-muted-foreground" : ""
										)}
									>
										<span className="font-semibold">
											{notification.actor.username}
										</span>{" "}
										<p>{notification.message}</p>
									</div>

									<div className="mt-1 flex items-center gap-1.5 text-muted-foreground text-xs">
										<span>
											{/* {new Date(notification.createdAt).toLocaleDateString()} */}
											{dayjs(notification.createdAt).fromNow(true)}
										</span>
									</div>
								</button>
							))}
						</div>
					</ScrollArea>
				)}

				<Link
					className={buttonVariants({
						className: "w-full rounded-none border-none",
						size: "lg",
						variant: "outline",
					})}
					to="/"
				>
					View All Notifications
				</Link>
			</DropdownMenuContent>
		</DropdownMenu>
	);
}
