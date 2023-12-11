import Parse from "parse";
import { Button, CircularProgress } from "@mui/material";
import { useBoolean } from "usehooks-ts";
import WhatsappConnectModal from "@/app/(modules)/management/[id]/components/WhatsAppConnectModal/WhatsappConnectModal";
import { useSuspenseQuery } from "@tanstack/react-query";
import React from "react";
import { WhatsAppConnectionStatus } from "@/app/(modules)/management/[id]/components/WhatsAppConnectionStatus";
import { WhatsappTestMessage } from "@/app/(modules)/management/[id]/components/WhatsappTestMessage";

export function WhatsApp({ instance }: { instance: Parse.Object }) {
	const {
		value: open,
		setTrue: onOpen,
		setFalse: onClose,
	} = useBoolean(false);
	const fetchClient = async () => {
		return (
			(await new Parse.Query("WhatsappClient")
				.equalTo("dhis2Instance", instance)
				.first()) ?? null
		);
	};

	const { data, isLoading, isError, error, refetch } = useSuspenseQuery({
		queryKey: ["whatsapp", instance.id],
		queryFn: fetchClient,
		retry: false,
	});

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
					<WhatsAppConnectionStatus instance={instance} data={data} />
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
