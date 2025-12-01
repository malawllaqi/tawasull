export type User = {
	id: string;
	name: string;
	email: string;
	emailVerified: string;
	image: string;
	username: string;
	displayUsername: string;
	bio: string | null;
	country: string | null;
	createdAt: Date;
	updatedAt: Date;
	isFollowing: boolean;
};

export type UserAPIResponse = {
	items: User[];
	totalPages: number;
	totalItems: number;
	currentPage: number;
	hasMore: boolean;
};
