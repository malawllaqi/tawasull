import { useForm } from "@tanstack/react-form";
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

const commentScehma = z.object({
	content: z.string(),
});
export default function CreateComment() {
	const [isOpen, setIsOpen] = useState(false);
	const form = useForm({
		defaultValues: {
			content: "",
		} as z.infer<typeof commentScehma>,
	});
	return (
		<form className="">
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
									console.log(emoji);
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
								id={field.name}
								// disabled={isPending}
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
					<Button size={"icon-sm"}>
						<Send />
					</Button>
				</InputGroupAddon>
			</InputGroup>
		</form>
	);
}
