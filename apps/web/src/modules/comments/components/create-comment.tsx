import { useForm } from "@tanstack/react-form";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Send, Smile } from "lucide-react";
import { useState } from "react";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import {
	EmojiPicker,
	EmojiPickerContent,
	EmojiPickerFooter,
	EmojiPickerSearch,
} from "@/components/ui/emoji-picker";
import {
	InputGroup,
	InputGroupAddon,
	InputGroupTextarea,
} from "@/components/ui/input-group";
import {
	Popover,
	PopoverContent,
	PopoverTrigger,
} from "@/components/ui/popover";
import { Spinner } from "@/components/ui/spinner";
import { api } from "@/lib/ky";
import { createCommentsQueryOptions } from "../queries";

const commentScehma = z.object({
	content: z.string(),
});

type CreateCommentProps = {
	postId: string;
};
export default function CreateComment({ postId }: CreateCommentProps) {
	const queryClient = useQueryClient();
	const { mutate, isPending } = useMutation({
		mutationFn: async (input: z.infer<typeof commentScehma>) =>
			await api
				.post("comment", { json: { content: input.content, postId } })
				.json(),
		onSuccess: () => {
			queryClient.invalidateQueries({
				queryKey: createCommentsQueryOptions({ postId }).queryKey,
			});
			form.reset();
		},
	});
	const form = useForm({
		defaultValues: {
			content: "",
		} as z.infer<typeof commentScehma>,
		onSubmit: ({ value }) => mutate(value),
	});
	const [isOpen, setIsOpen] = useState(false);

	return (
		<form
			className=""
			onSubmit={(e) => {
				e.preventDefault();
				form.handleSubmit();
			}}
		>
			<InputGroup className="border-none focus:outline-none focus:ring-0 focus-visible:ring-0 focus-visible:ring-offset-0">
				<InputGroupAddon align={"inline-start"}>
					<Popover onOpenChange={setIsOpen} open={isOpen}>
						<PopoverTrigger asChild>
							<Button size={"icon"} type="button" variant={"ghost"}>
								<Smile />
							</Button>
						</PopoverTrigger>
						<PopoverContent className="w-fit p-0">
							<EmojiPicker
								className="h-[342px]"
								onEmojiSelect={({ emoji }) => {
									setIsOpen(false);
									form.setFieldValue(
										"content",
										form.getFieldValue("content") + emoji
									);
								}}
							>
								<EmojiPickerSearch />
								<EmojiPickerContent />
								<EmojiPickerFooter />
							</EmojiPicker>
						</PopoverContent>
					</Popover>
				</InputGroupAddon>
				<form.Field
					children={(field) => {
						const isInvalid =
							field.state.meta.isTouched && !field.state.meta.isValid;

						return (
							<InputGroupTextarea
								aria-invalid={isInvalid}
								className="max-h-40 min-h-10"
								disabled={isPending}
								id={field.name}
								name={field.name}
								onBlur={field.handleBlur}
								onChange={(e) => field.handleChange(e.target.value)}
								placeholder="write a comment..."
								value={field.state.value}
							/>
						);
					}}
					name="content"
				/>

				<InputGroupAddon align="inline-end">
					<Button disabled={isPending} size={"icon-sm"} type="submit">
						{isPending ? <Spinner /> : <Send />}
					</Button>
				</InputGroupAddon>
			</InputGroup>
		</form>
	);
}
