import Parse from "parse";
import { Button, Dialog, DialogActions, DialogTitle } from "@mui/material";
import DialogContent from "@mui/material/DialogContent";
import { FormProvider, useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { RHFTextInput } from "@/components/RHFTextInput";
import { RHFTextAreaInput } from "@/components/RHFTextAreaInput";
import { LoadingButton } from "@mui/lab";

export interface TestMessageModalProps {
	open: boolean;
	onClose: () => void;
	instance: Parse.Object;
}

const message = z.object({
	to: z.string(),
	message: z.string(),
});

type Message = z.infer<typeof message>;

export function TestMessageModal({
	open,
	instance,
	onClose,
}: TestMessageModalProps) {
	const form = useForm<Message>({
		resolver: zodResolver(message),
	});

	const onCloseClick = () => {
		form.reset({});
		onClose();
	};

	const onSubmit = async (data: Message) => {
		try {
			const response = await Parse.Cloud.run("sendTestWhatsappMessage", {
				...data,
				clientType: "whatsapp",
				clientId: instance.id,
			});
			console.log(response);
		} catch (e) {
			console.log(e);
		}
		onCloseClick();
	};

	return (
		<Dialog open={open} onClose={onCloseClick}>
			<DialogTitle>Send a test message</DialogTitle>
			<DialogContent>
				<FormProvider {...form}>
					<div className="flex flex-col gap-4 w-full h-full p-4">
						<RHFTextInput
							label="Phone number"
							required
							type="tel"
							name="to"
						/>
						<RHFTextAreaInput
							placeholder="Write your message here"
							required
							minRows={3}
							name="message"
						/>
					</div>
				</FormProvider>
			</DialogContent>
			<DialogActions>
				<Button color="info" onClick={onCloseClick}>
					Cancel
				</Button>
				<LoadingButton
					color="primary"
					onClick={form.handleSubmit(onSubmit)}
					loading={
						form.formState.isSubmitting ||
						form.formState.isValidating
					}
				>
					Send
				</LoadingButton>
			</DialogActions>
		</Dialog>
	);
}
