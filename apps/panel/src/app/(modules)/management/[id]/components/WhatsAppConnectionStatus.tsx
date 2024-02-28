import Parse from "parse";
import { Wifi, WifiOff } from "@mui/icons-material";
import React from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { LoadingButton } from "@mui/lab";
import { capitalize } from "lodash";
import { useBoolean } from "usehooks-ts";
import { useWhatsappClientStatus } from "@/hooks/whatsapp";
import { WhatsappQRCodeView } from "@/components/WhatsappQRCodeView";

export function useManageWhatsappConnectionStatus(data: Parse.Object) {
	const session = data.get("sessionId");
	const baseUrl = `${process.env.NEXT_PUBLIC_MESSAGING_URL}/clients/whatsapp/session/${session}`;
	const queryClient = useQueryClient();

	const mutate = async (endpoint: string) => {
		const url = `${baseUrl}/${endpoint}`;
		const response = await fetch(url, {
			method: "POST",
		});
		return await response.json();
	};

	const { mutateAsync, isPending, error, isError } = useMutation({
		mutationKey: ["whatsapp", data.id, "status"],
		mutationFn: mutate,
		onSuccess: async (data, variables) => {
			data.set("enabled", !data.get("enabled"));
			await data.save();
			await queryClient.invalidateQueries({
				queryKey: ["whatsapp", data.id],
			});
		},
	});

	const connect = async () => mutateAsync(`start`);
	const disconnect = async () => mutateAsync(`stop`);
	const restart = async () => mutateAsync(`restart`);

	return {
		connect,
		disconnect,
		restart,
		isPending,
		error,
		isError,
	};
}

export function WhatsAppConnectionStatus({
	whatsappClient,
	hideControls,
}: {
	whatsappClient: Parse.Object;
	hideControls?: boolean;
}) {
	const {
		value: open,
		setTrue: onOpen,
		setFalse: onClose,
	} = useBoolean(false);
	const { status } = useWhatsappClientStatus(whatsappClient);

	const {
		restart,
		error: manageError,
		isError: hasManageError,
		isPending,
	} = useManageWhatsappConnectionStatus(whatsappClient);

	const onRestart = async () => {
		await restart();
		onOpen();
	};

	if (status === "CONNECTED") {
		return (
			<div className="flex flex-row gap-4">
				<div className="text-green-800 bg-green-100 rounded-lg text-xs flex space-x-1 p-1 m-auto">
					<Wifi color="success" sx={{ fontSize: 15 }} />
					<h1 className="">{capitalize(status)}</h1>
				</div>
			</div>
		);
	}

	if (status === "UNPAIRED") {
		return (
			<div className="flex flex-row gap-4">
				{open && (
					<WhatsappQRCodeView
						client={whatsappClient}
						open={open}
						onClose={onClose}
					/>
				)}
				<div className="text-red-600 bg-red-100 rounded-lg text-xs flex space-x-1 p-1 m-auto">
					<WifiOff color="error" sx={{ fontSize: 15 }} />
					<h1 className="">{capitalize(status)}</h1>
				</div>
				{!hideControls && (
					<LoadingButton
						color="success"
						onClick={onOpen}
						loadingIndicator={"Connecting"}
						loading={isPending}
						variant="text"
					>
						Pair
					</LoadingButton>
				)}
			</div>
		);
	}

	if (status === "UNPAIRED_IDLE") {
		return (
			<div className="flex flex-row gap-4">
				<div className="text-red-600 bg-red-100 rounded-lg text-xs flex space-x-1 p-1 m-auto">
					<WifiOff color="error" sx={{ fontSize: 15 }} />
					<h1 className="">{capitalize(status)}</h1>
				</div>
				{!hideControls && (
					<LoadingButton
						color="success"
						onClick={onRestart}
						loadingIndicator={"Connecting"}
						loading={isPending}
						variant="text"
					>
						Pair
					</LoadingButton>
				)}
			</div>
		);
	}

	return (
		<div className="flex flex-row gap-4">
			<div className="text-red-600 bg-red-100 rounded-lg text-xs flex space-x-1 p-1 m-auto">
				<WifiOff color="error" sx={{ fontSize: 15 }} />
				<h1 className="">{capitalize(status)}</h1>
			</div>
			{!hideControls && (
				<LoadingButton
					color="success"
					onClick={onRestart}
					loadingIndicator={"Connecting"}
					loading={isPending}
					variant="text"
				>
					Restart
				</LoadingButton>
			)}
		</div>
	);
}
