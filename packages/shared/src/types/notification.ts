export type NotificationTypes = "FOLLOW" | "COMMENT" | "LIKE" | "RETWEET";

export type Notification = {
	id: string;
	actorId: string;
	recipientId: string;
	type: NotificationTypes;
	commentId: string;
	postId: string;
	isRead: boolean;
	actor: {
		name: string;
		username: string;
		image: string;
	};
	message: string;
	createdAt: Date;
	updatedAt: Date;
};

export type NotificationAPIResponse = {
	items: Notification[];
	totalPages: number;
	totalItems: number;
	currentPage: number;
	hasMore: boolean;
};

export type NotificationQueryParams = {
	search?: string;
	limit?: string;
	page?: string;
};
