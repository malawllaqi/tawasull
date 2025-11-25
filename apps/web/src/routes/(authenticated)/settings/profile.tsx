import { useForm } from "@tanstack/react-form";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";
import { toast } from "sonner";
import { z } from "zod";
import { HeadingSmall } from "@/components/heading-small";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
	Field,
	FieldError,
	FieldGroup,
	FieldLabel,
} from "@/components/ui/field";
import { FileUpload, FileUploadTrigger } from "@/components/ui/file-upload";
import { Input } from "@/components/ui/input";
import { Spinner } from "@/components/ui/spinner";
import { api } from "@/lib/ky";
import { catchError } from "@/lib/utils";
import DeleteUser from "@/modules/auth/components/delete-user";
import { authQueryOptions } from "@/modules/auth/queries";

export const Route = createFileRoute("/(authenticated)/settings/profile")({
	component: RouteComponent,
});

const profileSchema = z.object({
	name: z.string(),
	username: z.string(),
	files: z
		.array(z.custom<File>())
		.max(2, "Please select up to 2 files")
		.refine((files) => files.every((file) => file.size <= 5 * 1024 * 1024), {
			message: "File size must be less than 5MB",
			path: ["files"],
		}),
});
function RouteComponent() {
	const queryClient = useQueryClient();
	const { mutate, isPending } = useMutation({
		mutationFn: async (data: z.infer<typeof profileSchema>) => {
			const { files, ...rest } = data;

			if (!files || files.length === 0) {
				return await api.patch("user", { json: rest }).json();
			}

			const formData = new FormData();
			const fileArray = files as File[];

			for (const [key, value] of Object.entries(rest)) {
				formData.append(key, value);
			}

			formData.append("file", fileArray[0] as File);

			return await api.patch("user", { body: formData }).json();
		},
		onSuccess: () => {
			toast.success("profile updated");
			queryClient.invalidateQueries({
				queryKey: authQueryOptions().queryKey,
			});
		},
		onError: (error) => {
			catchError(error);
		},
	});
	const {
		user: { user },
	} = Route.useRouteContext();
	const form = useForm({
		defaultValues: {
			name: user.name,
			username: user.username,
			files: [],
		} as z.infer<typeof profileSchema>,
		validators: {
			onSubmit: profileSchema,
		},
		onSubmit: ({ value }) => {
			mutate(value);
		},
	});

	return (
		<div className="space-y-6">
			<HeadingSmall
				// description="Update your name and email address"
				description="Update your profile information"
				title="Profile information"
			/>
			<form
				className="mb-10 space-y-6"
				id="bug-report-form"
				onSubmit={(e) => {
					e.preventDefault();
					form.handleSubmit();
				}}
			>
				<FieldGroup className="">
					<form.Field
						children={(field) => {
							const isInvalid =
								field.state.meta.isTouched && !field.state.meta.isValid;

							const uploadedFile = field.state.value[0] || null;
							const imgUrl = uploadedFile
								? URL.createObjectURL(uploadedFile)
								: null;
							return (
								<Field>
									<FieldLabel htmlFor={field.name}>Avatar</FieldLabel>
									<FileUpload
										accept="image/*"
										aria-invalid={isInvalid}
										className="relative flex flex-col space-y-2"
										maxFiles={1}
										maxSize={5 * 1024 * 1024}
										onFileReject={(_, message) => {
											toast.error(message);
											// form.setError("files", {
											// 	message,
											// });
										}}
										onValueChange={field.handleChange}
										value={field.state.value}
									>
										<div className="group relative w-fit overflow-hidden">
											<Avatar className="size-14 rounded-md">
												<AvatarImage
													alt={user?.name || ""}
													className="object-cover"
													src={imgUrl || user.image || ""}
												/>

												<AvatarFallback className="rounded-lg">
													{user?.name?.slice(0, 2)?.toUpperCase() || "CN"}
												</AvatarFallback>
											</Avatar>
											<FileUploadTrigger
												asChild
												className="-translate-x-2/4 -translate-y-2/4 absolute top-2/4 left-2/4 z-20 size-14 opacity-0 group-hover:opacity-100"
											>
												<Button
													className="text-xs"
													size={"sm"}
													type="button"
													// variant=""
												>
													Upload
												</Button>
											</FileUploadTrigger>
										</div>
									</FileUpload>
									{isInvalid && <FieldError errors={field.state.meta.errors} />}
								</Field>
							);
						}}
						name="files"
					/>

					<form.Field
						children={(field) => {
							const isInvalid =
								field.state.meta.isTouched && !field.state.meta.isValid;
							return (
								<Field data-invalid={isInvalid}>
									<FieldLabel htmlFor={field.name}>Name</FieldLabel>
									<Input
										aria-invalid={isInvalid}
										// disabled={isPending}
										id={field.name}
										name={field.name}
										onBlur={field.handleBlur}
										onChange={(e) => field.handleChange(e.target.value)}
										placeholder="John Doe"
										type="text"
										value={field.state.value}
									/>
									{isInvalid && <FieldError errors={field.state.meta.errors} />}
								</Field>
							);
						}}
						name="name"
					/>
					<form.Field
						children={(field) => {
							const isInvalid =
								field.state.meta.isTouched && !field.state.meta.isValid;
							return (
								<Field data-invalid={isInvalid}>
									<FieldLabel htmlFor={field.name}>Username</FieldLabel>
									<Input
										aria-invalid={isInvalid}
										// disabled={isPending}
										id={field.name}
										name={field.name}
										onBlur={field.handleBlur}
										onChange={(e) => field.handleChange(e.target.value)}
										placeholder="jdoe"
										type="text"
										value={field.state.value}
									/>
									{isInvalid && <FieldError errors={field.state.meta.errors} />}
								</Field>
							);
						}}
						name="username"
					/>
				</FieldGroup>

				<Field className="w-20">
					<Button disabled={isPending} form="bug-report-form" type="submit">
						{isPending ? <Spinner /> : "Save"}
					</Button>
				</Field>
			</form>

			<DeleteUser />
		</div>
	);
}
