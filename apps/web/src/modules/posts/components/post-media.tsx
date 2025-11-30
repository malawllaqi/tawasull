import type { PostMedia } from "@tawasull/shared";
import { ImageZoom } from "@/components/ui/shadcn-io/image-zoom";
import { cn } from "@/lib/utils";

type PostMediaProps = {
	media: PostMedia[];
};
export function PostMediaPreview({ media }: PostMediaProps) {
	return (
		<div
			className={cn(
				"grid gap-3 pt-4",
				media.length > 1 ? "grid-cols-2" : "grid-cols-1"
			)}
		>
			{media.map((m) => (
				<ImageZoom
					backdropClassName={cn(
						'[&_[data-rmiz-modal-overlay="visible"]]:bg-black/80'
					)}
					className="overflow-hidden rounded-xl"
					key={m.id}
				>
					{/** biome-ignore lint/a11y/noNoninteractiveElementInteractions: <> */}
					{/** biome-ignore lint/a11y/useKeyWithClickEvents: <> */}
					<img
						alt={`Travel highlight ${m.id + 2}`}
						className="h-64 w-full object-cover transition-transform duration-700 hover:scale-105"
						onClick={(e) => {
							e.stopPropagation();
						}}
						src={m.url}
					/>
				</ImageZoom>
			))}
		</div>
	);
}
