import { useForm } from "@tanstack/react-form";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { CornerDownLeftIcon, ImageIcon, PlusIcon, X } from "lucide-react";
import { toast } from "sonner";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
	FileUpload,
	FileUploadItem,
	FileUploadItemDelete,
	FileUploadItemMetadata,
	FileUploadItemPreview,
	FileUploadList,
	FileUploadTrigger,
} from "@/components/ui/file-upload";
import {
	InputGroup,
	InputGroupAddon,
	InputGroupButton,
	InputGroupTextarea,
} from "@/components/ui/input-group";
import { Spinner } from "@/components/ui/spinner";
import { api } from "@/lib/ky";
import { catchError } from "@/lib/utils";
import { createFeedPostsQueryOptions } from "../queries";

const createPostSchema = z.object({
	files: z
		.array(z.custom<File>())
		.max(2, "Please select up to 2 files")
		.refine((files) => files.every((file) => file.size <= 5 * 1024 * 1024), {
			message: "File size must be less than 5MB",
			path: ["files"],
		})
		.optional(),
	content: z.string(),
});
type CreatePostType = z.infer<typeof createPostSchema>;

export function CreatePost() {
	const queryClient = useQueryClient();
	const { mutate, isPending } = useMutation({
		mutationFn: async (data: CreatePostType) => {
			if (!data.files?.length) {
				return await api
					.post("post", { json: { content: data.content } })
					.json();
			}

			const formData = new FormData();
			formData.append("content", data.content);

			for (const file of data.files) {
				formData.append("files", file);
			}
			return await api.post("post", { body: formData }).json();
		},

		onSuccess: () => {
			toast.success("post submited!");
			form.reset();
			queryClient.invalidateQueries({
				queryKey: createFeedPostsQueryOptions().queryKey,
			});
		},
		onError: async (error) => {
			await catchError(error);
		},
	});

	const form = useForm({
		defaultValues: {
			content: "",
			files: [],
		} as CreatePostType,
		validators: {
			onSubmit: createPostSchema,
		},
		onSubmit: ({ value }) => {
			mutate({ content: value.content, files: value.files });
		},
	});

	return (
		<form
			className="overflow-hidden rounded-md border bg-card hover:cursor-text"
			onSubmit={(e) => {
				e.preventDefault();
				form.handleSubmit();
			}}
		>
			<InputGroup className="size-full bg-card dark:bg-card">
				<form.Field
					children={(field) => {
						const isInvalid =
							field.state.meta.isTouched && !field.state.meta.isValid;

						return (
							<InputGroupTextarea
								aria-invalid={isInvalid}
								className="field-sizing-content max-h-48 min-h-16"
								disabled={isPending}
								id={field.name}
								name={field.name}
								onBlur={field.handleBlur}
								onChange={(e) => field.handleChange(e.target.value)}
								placeholder="What would you like to post?"
								value={field.state.value}
							/>
						);
					}}
					name="content"
				/>

				<InputGroupAddon align="block-end">
					<form.Field
						children={(field) => {
							return (
								<FileUpload
									accept="image/*"
									className="relative"
									maxFiles={2}
									maxSize={5 * 1024 * 1024}
									multiple
									onFileReject={(_, message) => {
										toast.error(message);
										// form.setError("files", {
										// 	message,
										// });
									}}
									onValueChange={field.handleChange}
									value={field.state.value}
								>
									<DropdownMenu>
										<DropdownMenuTrigger asChild>
											<InputGroupButton
												className=""
												disabled={isPending}
												size="icon-sm"
												type="button"
												variant="ghost"
											>
												<PlusIcon />
											</InputGroupButton>
										</DropdownMenuTrigger>
										<DropdownMenuContent align="start">
											<DropdownMenuItem asChild>
												<FileUploadTrigger asChild>
													<Button
														className="size-7 w-full rounded-sm"
														size="icon"
														type="button"
														variant="ghost"
													>
														<ImageIcon className="mr-2 size-4" />
														Add photos
													</Button>
												</FileUploadTrigger>
											</DropdownMenuItem>
										</DropdownMenuContent>
									</DropdownMenu>
									<FileUploadList className="flex flex-row items-center">
										{field.state.value?.length
											? field.state.value.map((file, index) => (
													<FileUploadItem
														className="max-w-36 p-1.5"
														key={index}
														value={file}
													>
														<FileUploadItemPreview className="size-8 [&>svg]:size-5" />
														<FileUploadItemMetadata size="sm" />
														<FileUploadItemDelete asChild>
															<Button
																className="size-7"
																size="icon"
																variant="ghost"
															>
																<X />
																<span className="sr-only">Delete</span>
															</Button>
														</FileUploadItemDelete>
													</FileUploadItem>
												))
											: null}
									</FileUploadList>
								</FileUpload>
							);
						}}
						name="files"
					/>

					<InputGroupButton
						className="ml-auto"
						disabled={isPending}
						size="sm"
						type="submit"
						variant="default"
					>
						{isPending ? <Spinner /> : <CornerDownLeftIcon />}
					</InputGroupButton>
				</InputGroupAddon>
				{/* </div> */}
			</InputGroup>
		</form>
	);
}
