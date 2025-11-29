export type Comment = {
	id: string;
	content: string;
	postId: string;
	createdAt: Date;
	updatedAt: Date;
	user: {
		name: string;
		image: string | null;
		username: string;
	};
};
