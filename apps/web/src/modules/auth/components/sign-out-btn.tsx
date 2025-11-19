import { useQueryClient } from "@tanstack/react-query";
import { useRouter } from "@tanstack/react-router";
import { LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import { authClient } from "@/lib/auth";
import { authQueryOptions } from "../queries";

export default function SignOutBtn() {
	const queryClient = useQueryClient();
	const router = useRouter();
	return (
		<Button
			className="flex w-full cursor-pointer items-center justify-start gap-2 border-0"
			onClick={async () =>
				await authClient.signOut({
					fetchOptions: {
						onResponse: async () => {
							queryClient.setQueryData(authQueryOptions().queryKey, null);
							await router.invalidate();
						},
					},
				})
			}
			variant={"ghost"}
		>
			<LogOut />
			Logout
		</Button>
	);
}
