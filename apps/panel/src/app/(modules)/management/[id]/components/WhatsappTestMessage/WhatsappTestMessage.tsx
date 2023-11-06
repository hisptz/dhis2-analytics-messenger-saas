import { Button } from "@mui/material";
import Parse from "parse";
import { useBoolean } from "usehooks-ts";
import { TestMessageModal } from "@/app/(modules)/management/[id]/components/WhatsappTestMessage/components/TestMessageModal";

export interface WhatsappTestMessageProps {
	instance: Parse.Object;
}

export function WhatsappTestMessage({ instance }: WhatsappTestMessageProps) {
	const {
		value: open,
		setTrue: onOpen,
		setFalse: onHide,
	} = useBoolean(false);

	return (
		<>
			<TestMessageModal
				open={open}
				onClose={onHide}
				instance={instance}
			/>
			<Button onClick={onOpen}>Send a test message</Button>
		</>
	);
}
