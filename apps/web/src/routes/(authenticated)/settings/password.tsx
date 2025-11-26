import { useForm } from "@tanstack/react-form";
import { useMutation } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";
import { toast } from "sonner";
import z from "zod";
import { HeadingSmall } from "@/components/heading-small";
import { Button } from "@/components/ui/button";
import {
	Field,
	FieldError,
	FieldGroup,
	FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Spinner } from "@/components/ui/spinner";
import { authClient } from "@/lib/auth";
import { catchError } from "@/lib/utils";

export const Route = createFileRoute("/(authenticated)/settings/password")({
	component: RouteComponent,
});

const passwordSchema = z
	.object({
		currentPassword: z.string().min(6),
		newPassword: z.string().min(6),
		confirmPassword: z.string(),
	})
	.refine((data) => data.newPassword === data.confirmPassword, {
		message: "Passwords don't match",
		path: ["confirmPassword"],
	});

function RouteComponent() {
	const { mutate, isPending } = useMutation({
		mutationFn: async (data: z.infer<typeof passwordSchema>) => {
			await authClient.changePassword(
				{
					currentPassword: data.currentPassword,
					newPassword: data.newPassword,
					revokeOtherSessions: true,
				},
				{
					onSuccess: () => {
						toast.success("password updated");
						form.reset();
					},
					onError: ({ error }) => {
						console.log(error.message);
						catchError(error);
					},
				}
			);
		},
	});
	const form = useForm({
		defaultValues: {
			currentPassword: "",
			newPassword: "",
			confirmPassword: "",
		} as z.infer<typeof passwordSchema>,
		validators: {
			onSubmit: passwordSchema,
		},
		onSubmit: ({ value }) => mutate(value),
	});
	return (
		<div className="space-y-6">
			<HeadingSmall
				description="Ensure your account is using a long, random password to stay secure"
				title="Update password"
			/>

			<form
				className="space-y-6"
				id="bug-report-form"
				onSubmit={(e) => {
					e.preventDefault();
					form.handleSubmit();
				}}
			>
				<FieldGroup>
					<form.Field
						children={(field) => {
							const isInvalid =
								field.state.meta.isTouched && !field.state.meta.isValid;
							return (
								<Field data-invalid={isInvalid}>
									<FieldLabel htmlFor={field.name}>Current password</FieldLabel>
									<Input
										aria-invalid={isInvalid}
										// disabled={isPending}
										id={field.name}
										name={field.name}
										onBlur={field.handleBlur}
										onChange={(e) => field.handleChange(e.target.value)}
										placeholder="Current password"
										type="password"
										value={field.state.value}
									/>
									{isInvalid && <FieldError errors={field.state.meta.errors} />}
								</Field>
							);
						}}
						name="currentPassword"
					/>
					<form.Field
						children={(field) => {
							const isInvalid =
								field.state.meta.isTouched && !field.state.meta.isValid;
							return (
								<Field data-invalid={isInvalid}>
									<FieldLabel htmlFor={field.name}>New password</FieldLabel>
									<Input
										aria-invalid={isInvalid}
										// disabled={isPending}
										id={field.name}
										name={field.name}
										onBlur={field.handleBlur}
										onChange={(e) => field.handleChange(e.target.value)}
										placeholder="New password"
										type="password"
										value={field.state.value}
									/>
									{isInvalid && <FieldError errors={field.state.meta.errors} />}
								</Field>
							);
						}}
						name="newPassword"
					/>
					<form.Field
						children={(field) => {
							const isInvalid =
								field.state.meta.isTouched && !field.state.meta.isValid;
							return (
								<Field data-invalid={isInvalid}>
									<FieldLabel htmlFor={field.name}>Confirm password</FieldLabel>
									<Input
										aria-invalid={isInvalid}
										// disabled={isPending}
										id={field.name}
										name={field.name}
										onBlur={field.handleBlur}
										onChange={(e) => field.handleChange(e.target.value)}
										placeholder="Confirm password"
										type="password"
										value={field.state.value}
									/>
									{isInvalid && <FieldError errors={field.state.meta.errors} />}
								</Field>
							);
						}}
						name="confirmPassword"
					/>

					<Field className="w-36">
						<Button disabled={isPending} form="bug-report-form" type="submit">
							{isPending ? <Spinner /> : "Save password"}
						</Button>
					</Field>
				</FieldGroup>
			</form>
		</div>
	);
}
