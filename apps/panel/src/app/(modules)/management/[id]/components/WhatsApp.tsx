import Parse from "parse";
import { Button, CircularProgress } from "@mui/material";
import { useBoolean } from "usehooks-ts";
import WhatsappConnectModal from "@/app/(modules)/management/[id]/components/WhatsAppConnectModal/WhatsappConnectModal";
import React from "react";
import { WhatsAppConnectionStatus } from "@/app/(modules)/management/[id]/components/WhatsAppConnectionStatus";
import { WhatsappTestMessage } from "@/app/(modules)/management/[id]/components/WhatsappTestMessage";
import { useWhatsappClient } from "@/hooks/whatsapp";

export function WhatsApp({ instance }: { instance: Parse.Object }) {
	const {
		value: open,
		setTrue: onOpen,
		setFalse: onClose,
	} = useBoolean(false);

	const { isError, error, data, refetch, isLoading } =
		useWhatsappClient(instance);

	if (isLoading) {
		return <CircularProgress size={32} />;
	}

	if (isError) {
		return <b>{error?.message}</b>;
	}

	if (data) {
		return (
			<div className="flex flex-col gap-4">
				<div className="flex space-x-2 items-center">
					<span className="font-bold">
						Whatsapp Connection Status:
					</span>
					<WhatsAppConnectionStatus whatsappClient={data} />
					<WhatsappTestMessage instance={data} />
				</div>
			</div>
		);
	}
	return (
		<>
			{open && (
				<WhatsappConnectModal
					onConnectComplete={() => refetch()}
					open={open}
					onClose={onClose}
					instance={instance}
				/>
			)}
			<Button onClick={onOpen}>Connect to WhatsApp</Button>
		</>
	);
}
