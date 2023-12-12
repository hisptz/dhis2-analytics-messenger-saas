import { Button, Dialog, DialogActions, DialogTitle } from "@mui/material";
import DialogContent from "@mui/material/DialogContent";
import { WhatsappConnect } from "@/app/(modules)/management/[id]/components/WhatsAppConnectModal/components/WhatsappConnect";

export interface WhatsAppConnectModalProps {
	open: boolean;
	onClose: () => void;
	onConnectComplete: () => void;
	instance: Parse.Object;
	client?: Parse.Object;
}

export default function WhatsappConnectModal({
	instance,
	open,
	onClose,
	onConnectComplete,
	client,
}: WhatsAppConnectModalProps) {
	return (
		<Dialog open={open} onClose={onClose}>
			<DialogTitle>Connect to your whatsapp</DialogTitle>
			<DialogContent>
				<WhatsappConnect
					client={client}
					onConnectComplete={onConnectComplete}
					onClose={onClose}
					instance={instance}
				/>
			</DialogContent>
			<DialogActions>
				<Button onClick={onClose}>Cancel</Button>
			</DialogActions>
		</Dialog>
	);
}
