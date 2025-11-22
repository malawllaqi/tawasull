export type Post = {
	id: string;
	content: string;
	userId: string;
	createdAt: Date;
	updatedAt: Date;
	user: {
		name: string;
		image: string | null;
		username: string | null;
	};
};

export type PostAPIResponse = {
	items: Post[];
	totalPages: number;
	totalItems: number;
	currentPage: number;
	hasMore: boolean;
};

export type PostQueryParams = {
	search?: string;
	limit?: string;
	page?: string;
};
