import { cn } from "@/lib/utils";

interface GradientAvatarProps {
	letter?: string;
	className?: string;
}

type GradientType =
	| "aurora"
	| "neon"
	| "sunset"
	| "ocean"
	| "cosmic"
	| "vibrant";

const GRADIENT_CONFIGS: Record<GradientType, { colors: string; glow: string }> =
	{
		aurora: {
			colors: "from-emerald-400 via-cyan-500 to-blue-600",
			glow: "from-emerald-400/25 to-blue-500/25",
		},
		neon: {
			colors: "from-pink-500 via-purple-500 to-indigo-600",
			glow: "from-pink-500/30 to-purple-500/30",
		},
		sunset: {
			colors: "from-orange-400 via-red-500 to-pink-600",
			glow: "from-orange-400/25 to-pink-500/25",
		},
		ocean: {
			colors: "from-blue-400 via-teal-500 to-cyan-600",
			glow: "from-blue-400/25 to-cyan-500/25",
		},
		cosmic: {
			colors: "from-indigo-600 via-purple-600 to-pink-600",
			glow: "from-indigo-500/30 to-pink-500/30",
		},
		vibrant: {
			colors: "from-yellow-400 via-orange-500 to-red-600",
			glow: "from-yellow-400/25 to-red-500/25",
		},
	};

const GRADIENT_ORDER: GradientType[] = [
	"aurora",
	"neon",
	"sunset",
	"ocean",
	"cosmic",
	"vibrant",
];

const getRandomGradient = (): GradientType =>
	GRADIENT_ORDER[Math.floor(Math.random() * GRADIENT_ORDER.length)] ?? "cosmic";

const getGradientFromLetter = (letter: string): GradientType => {
	const char = letter.toLowerCase().charCodeAt(0);

	// not a-z → random
	if (char < 97 || char > 122) return getRandomGradient();

	// evenly bucket letters
	const bucket = Math.floor(((char - 97) / 26) * GRADIENT_ORDER.length);
	return GRADIENT_ORDER[bucket] ?? "cosmic";
};

export default function GradientAvatar({
	letter,
	className,
}: GradientAvatarProps) {
	const selected = letter ? getGradientFromLetter(letter) : getRandomGradient();
	const config = GRADIENT_CONFIGS[selected];

	return (
		<div className={cn("relative inline-flex items-center justify-center")}>
			{/* Glow */}
			<div
				aria-hidden="true"
				className={`absolute inset-0 rounded-full bg-linear-to-br ${config.glow} scale-110 opacity-60 blur-xl`}
			/>

			{/* Avatar */}
			<div
				className={cn(
					"relative flex size-11 items-center justify-center overflow-hidden rounded-full border border-white/10 bg-linear-to-br shadow-xl",
					config.colors,
					className
				)}
			>
				{/* Highlight animation */}
				<div
					aria-hidden="true"
					className="absolute inset-0 animate-pulse rounded-full bg-linear-to-tr from-white/20 to-transparent opacity-40"
				/>
			</div>
		</div>
	);
}
