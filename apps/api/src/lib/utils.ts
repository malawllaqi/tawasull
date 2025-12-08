import type { NotificationTypes } from "@tawasull/shared";
export function getNotificationMessage(notificationType: NotificationTypes) {
	switch (notificationType) {
		case "FOLLOW":
			return "started following you";
		case "COMMENT":
			return "commented on your post";
		case "LIKE":
			return "liked your post";
		case "RETWEET":
			return "retweeted your post";
		default:
			return "sent you a notification";
	}
}
