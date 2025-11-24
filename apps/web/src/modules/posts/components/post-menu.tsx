import { useMutation, useQueryClient } from "@tanstack/react-query";
import type { Post } from "@tawasull/shared";
import { Copy, MoreHorizontal, Trash } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import {
	AlertDialog,
	AlertDialogAction,
	AlertDialogCancel,
	AlertDialogContent,
	AlertDialogDescription,
	AlertDialogFooter,
	AlertDialogHeader,
	AlertDialogTitle,
	AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuGroup,
	DropdownMenuItem,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Spinner } from "@/components/ui/spinner";
import { authClient } from "@/lib/auth";
import { api } from "@/lib/ky";
import { catchError } from "@/lib/utils";
import { createPostsInfiniteQueryOptions } from "../queries";

export type PostMenuProps = {
	post: Post;
};

export function PostMenu({ post }: PostMenuProps) {
	const queryClient = useQueryClient();
	const { data: session } = authClient.useSession();

	const [openDelete, setOpenDelete] = useState(false);
	const { mutate, isPending } = useMutation({
		mutationFn: async () => await api.delete(`post/${post.id}`),
		onSuccess: () => {
			toast.success("post deleted");
			queryClient.invalidateQueries({
				queryKey: createPostsInfiniteQueryOptions().queryKey,
			});
		},
		onError: (error) => {
			catchError(error);
		},
	});
	return (
		<DropdownMenu>
			<DropdownMenuTrigger asChild>
				<Button className="" variant="outline">
					<MoreHorizontal />
				</Button>
			</DropdownMenuTrigger>
			<DropdownMenuContent align="end" className="w-56" forceMount>
				{/* <DropdownMenuSeparator /> */}
				<DropdownMenuGroup>
					<DropdownMenuItem>
						<Copy />
						Copy post url
					</DropdownMenuItem>
				</DropdownMenuGroup>
				<DropdownMenuSeparator />
				{session?.user.id === post.userId ? (
					<DropdownMenuGroup>
						<AlertDialog onOpenChange={setOpenDelete} open={openDelete}>
							<AlertDialogTrigger asChild>
								<DropdownMenuItem
									disabled={isPending}
									onClick={() => setOpenDelete(true)}
									onSelect={(e) => e.preventDefault()}
									variant="destructive"
								>
									<Trash />
									Delete
								</DropdownMenuItem>
							</AlertDialogTrigger>
							<AlertDialogContent>
								<AlertDialogHeader>
									<AlertDialogTitle>Delete post?</AlertDialogTitle>
									<AlertDialogDescription>
										This action cannot be undone. This will permanently and
										irreversibly delete your post forever.
									</AlertDialogDescription>
								</AlertDialogHeader>
								<AlertDialogFooter>
									<AlertDialogCancel
										disabled={isPending}
										onClick={() => setOpenDelete(true)}
									>
										Cancel
									</AlertDialogCancel>
									<AlertDialogAction
										className="w-18"
										disabled={isPending}
										onClick={() => mutate()}
									>
										{isPending ? <Spinner /> : "Delete"}
									</AlertDialogAction>
								</AlertDialogFooter>
							</AlertDialogContent>
						</AlertDialog>
					</DropdownMenuGroup>
				) : null}
				{/* <DropdownMenuItem onClick={handleLogout}>Log out</DropdownMenuItem> */}
			</DropdownMenuContent>
		</DropdownMenu>
	);
}
