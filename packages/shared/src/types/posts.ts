export type Post = {
	id: string;
	content: string;
	userId: string;
	createdAt: Date;
	updatedAt: Date;
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
