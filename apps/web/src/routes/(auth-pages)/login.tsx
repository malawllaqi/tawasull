import { useForm } from "@tanstack/react-form";
import { useMutation } from "@tanstack/react-query";
import { createFileRoute, Link } from "@tanstack/react-router";
import { toast } from "sonner";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import {
	Field,
	FieldDescription,
	FieldGroup,
	FieldLabel,
	FieldSeparator,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Spinner } from "@/components/ui/spinner";
import { authClient } from "@/lib/auth";
import { SignInSocial } from "@/modules/auth/components/signin-social";

export const Route = createFileRoute("/(auth-pages)/login")({
	component: SigninForm,
});

const formSchema = z.object({
	email: z.email(),
	password: z.string().min(8),
});

export type SigninFormType = z.infer<typeof formSchema>;

export function SigninForm() {
	const { redirectUrl } = Route.useRouteContext();

	const { mutateAsync, isPending } = useMutation({
		mutationFn: async (user: SigninFormType) => {
			await authClient.signIn.email(
				{
					email: user.email,
					password: user.password,
					callbackURL: redirectUrl,
				},
				{
					onError: ({ error }) => {
						toast.error(error.message);
					},

					onSuccess: () => {
						toast.success("successfully logged in");
					},
				}
			);
		},
	});
	const form = useForm({
		defaultValues: {
			email: "",
			password: "",
		} as SigninFormType,
		validators: {
			onSubmit: formSchema,
		},
		onSubmit: async ({ value }) => {
			await mutateAsync(value);
		},
	});

	return (
		<div className="flex h-full">
			<form
				className="flex w-full max-w-2xl flex-col justify-center bg-card p-6 md:p-8"
				onSubmit={(e) => {
					e.preventDefault();
					form.handleSubmit();
				}}
			>
				<FieldGroup>
					<div className="flex flex-col items-center gap-2 text-center">
						<h1 className="font-bold text-2xl">Login</h1>
						<p className="text-balance text-muted-foreground text-sm">
							Enter your email below to Login
						</p>
					</div>
					<form.Field
						children={(field) => {
							const isInvalid =
								field.state.meta.isTouched && !field.state.meta.isValid;
							return (
								<Field data-invalid={isInvalid}>
									<FieldLabel htmlFor={field.name}>Email</FieldLabel>
									<Input
										aria-invalid={isInvalid}
										disabled={isPending}
										id={field.name}
										name={field.name}
										onBlur={field.handleBlur}
										onChange={(e) => field.handleChange(e.target.value)}
										placeholder="m@example.com"
										type="email"
										value={field.state.value}
									/>
								</Field>
							);
						}}
						name="email"
					/>

					<form.Field
						children={(field) => {
							const isInvalid =
								field.state.meta.isTouched && !field.state.meta.isValid;
							return (
								<Field data-invalid={isInvalid}>
									<FieldLabel htmlFor={field.name}>Password</FieldLabel>
									<Input
										aria-invalid={isInvalid}
										disabled={isPending}
										id={field.name}
										name={field.name}
										onBlur={field.handleBlur}
										onChange={(e) => field.handleChange(e.target.value)}
										placeholder="********"
										type="password"
										value={field.state.value}
									/>
								</Field>
							);
						}}
						name="password"
					/>

					<Field>
						<Button disabled={isPending} type="submit">
							{isPending ? <Spinner /> : "Login"}
						</Button>
					</Field>
					<FieldSeparator className="*:data-[slot=field-separator-content]:bg-card">
						Or continue with
					</FieldSeparator>
					<Field className="grid grid-cols-2 gap-4">
						<SignInSocial
							callbackURL={`${import.meta.env.VITE_WEBAPP_URL}/${redirectUrl}`}
							disabled={isPending}
							icon={
								<svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
									<path
										d="M12.48 10.92v3.28h7.84c-.24 1.84-.853 3.187-1.787 4.133-1.147 1.147-2.933 2.4-6.053 2.4-4.827 0-8.6-3.893-8.6-8.72s3.773-8.72 8.6-8.72c2.6 0 4.507 1.027 5.907 2.347l2.307-2.307C18.747 1.44 16.133 0 12.48 0 5.867 0 .307 5.387.307 12s5.56 12 12.173 12c3.573 0 6.267-1.173 8.373-3.36 2.16-2.16 2.84-5.213 2.84-7.667 0-.76-.053-1.467-.173-2.053H12.48z"
										fill="currentColor"
									/>
								</svg>
							}
							provider="google"
						/>
						<SignInSocial
							callbackURL={redirectUrl}
							disabled={isPending}
							icon={
								<svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
									<path
										d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12"
										fill="currentColor"
									/>
								</svg>
							}
							provider="github"
						/>
					</Field>

					<FieldDescription className="text-center">
						Don&apos;t have an account? <Link to="/signup">Sign up</Link>
					</FieldDescription>
				</FieldGroup>
			</form>
			<div className="relative hidden flex-1 md:block" />
		</div>
	);
}
