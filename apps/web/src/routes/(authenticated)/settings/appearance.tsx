import { createFileRoute } from "@tanstack/react-router";
import { type LucideIcon, Monitor, Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";
import { HeadingSmall } from "@/components/heading-small";
import { cn } from "@/lib/utils";

const tabs: {
	value: "system" | "light" | "dark";
	icon: LucideIcon;
	label: string;
}[] = [
	{ value: "light", icon: Sun, label: "Light" },
	{ value: "dark", icon: Moon, label: "Dark" },
	{ value: "system", icon: Monitor, label: "System" },
];

export const Route = createFileRoute("/(authenticated)/settings/appearance")({
	component: RouteComponent,
});

function RouteComponent() {
	const { setTheme, theme } = useTheme();

	return (
		<div className="space-y-6">
			<HeadingSmall
				description="Update your account's appearance settings"
				title="Appearance settings"
			/>

			<div
				className={cn(
					"inline-flex gap-1 rounded-lg bg-neutral-100 p-1 dark:bg-neutral-800"
				)}
			>
				{tabs.map(({ value, icon: Icon, label }) => (
					<button
						className={cn(
							"flex items-center rounded-md px-3.5 py-1.5 transition-colors",
							theme === value
								? "bg-white shadow-xs dark:bg-neutral-700 dark:text-neutral-100"
								: "text-neutral-500 hover:bg-neutral-200/60 hover:text-black dark:text-neutral-400 dark:hover:bg-neutral-700/60"
						)}
						key={value}
						onClick={() => setTheme(value)}
						type="button"
					>
						<Icon className="-ml-1 h-4 w-4" />
						<span className="ml-1.5 text-sm">{label}</span>
					</button>
				))}
			</div>
		</div>
	);
}
