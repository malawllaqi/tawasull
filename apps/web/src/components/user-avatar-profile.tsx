import { cva, type VariantProps } from "class-variance-authority";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";
import GradientAvatar from "./ui/gradient-avatar";

const avatarVariants = cva("", {
	variants: {
		size: {
			xs: "h-7 w-7",
			sm: "h-8 w-8",
			md: "h-10 w-10",
			lg: "h-12 w-12",
			xl: "h-16 w-16",
			"2xl": "h-20 w-20",
			"3xl": "h-24 w-24",
		},
	},
	defaultVariants: {
		size: "md",
	},
});

interface UserAvatarProfileProps extends VariantProps<typeof avatarVariants> {
	url?: string | null;
	name?: string;
	className?: string;
}

export function UserAvatarProfile({
	url,
	name,
	size = "md",
	className,
}: UserAvatarProfileProps) {
	return (
		<Avatar className={cn(avatarVariants({ size }), className)}>
			<AvatarImage alt={name || ""} src={url || ""} />
			<AvatarFallback className="rounded-lg">
				<GradientAvatar
					className={cn(avatarVariants({ size }), className)}
					letter={name?.charAt(0)}
				/>
			</AvatarFallback>
		</Avatar>
	);
}
