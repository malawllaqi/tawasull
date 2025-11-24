import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

export interface PageContainerProps {
	children: ReactNode;
	className?: string;
	/**
	 * Maximum width of the wrapper
	 * @default "7xl" (80rem/1280px)
	 */
	maxWidth?:
		| "sm"
		| "md"
		| "lg"
		| "xl"
		| "2xl"
		| "3xl"
		| "4xl"
		| "5xl"
		| "6xl"
		| "7xl"
		| "full"
		| "min"
		| "max"
		| "fit";
	/**
	 * Whether to add padding to the wrapper
	 * @default true
	 */
	withPadding?: boolean;
}

export function PageContainer({
	children,
	className,
	maxWidth = "7xl",
	withPadding = true,
}: PageContainerProps) {
	return (
		<div
			className={cn(
				"flex h-full min-h-screen w-full flex-1 flex-col gap-4 overflow-x-auto",
				withPadding && "p-4",
				maxWidth !== "full" && `mx-auto max-w-${maxWidth}`,
				className
			)}
		>
			{children}
		</div>
	);
}
