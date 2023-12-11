import Parse from "parse";
import { useEffect, useMemo, useState } from "react";
import { io } from "socket.io-client";
import { v4 as uuid } from "uuid";
import Image from "next/image";
import { LinearProgress } from "@mui/material";

export interface WhatsappConnectProps {
	instance: Parse.Object;
	client?: Parse.Object;
	onClose: () => void;
	onConnectComplete: () => void;
}

export function WhatsappConnect({
	instance,
	onClose,
	onConnectComplete,
	client,
}: WhatsappConnectProps) {
	const [error, setError] = useState();
	const [loadingStatus, setLoadingStatus] = useState<number | null>(null);
	const [qrCode, setQrCode] = useState();
	const token = useMemo(
		() => client?.get("sessionId") ?? `${instance.id}-${uuid()}`,
		[client, instance.id],
	);

	const style = {
		width: 432,
		height: 432,
	};
	useEffect(() => {
		function setup() {
			const url = `${process.env.NEXT_PUBLIC_MESSAGING_URL}/clients/whatsapp/${token}/init`;
			const socket = io(url, {
				path: `${process.env.NEXT_PUBLIC_MESSAGING_MOUNT_PATH}`,
				query: {
					session: token,
					client: "whatsapp",
					name: instance.get("name"),
				},
			});
			const onConnect = () => {
				console.info(`Connected! Waiting for input`);
			};
			const onLoading = (percentage: number) => {
				setLoadingStatus(percentage);
			};
			const onQRCode = (qrCode: any, ...args: any[]) => {
				setQrCode(qrCode);
			};
			const onSuccess = async () => {
				const whatsapp = new Parse.Object("WhatsappClient");
				await whatsapp.save({
					dhis2Instance: instance,
					sessionId: token,
					name: instance.get("name"),
					enabled: true,
				});
				onConnectComplete();
				onClose();
			};

			const onStatus = (...args: any[]) => {
				console.log(args);
			};
			const onError = (error: any) => {
				setError(error);
			};

			socket.on("connect", onConnect);
			socket.on("loading", onLoading);
			socket.on("qrCode", onQRCode);
			socket.on("success", onSuccess);
			socket.on("error", onError);
			socket.on("status", onStatus);
			return () => {
				socket.off("connect", onConnect);
				socket.off("loading", onLoading);
				socket.off("qrCode", onQRCode);
				socket.off("success", onSuccess);
				socket.off("status", onStatus);
				socket.off("error", onError);
				socket.close();
			};
		}

		return setup();
	}, [instance, onClose, onConnectComplete, token]);

	if (error) {
		return <div style={style}>{JSON.stringify(error)}</div>;
	}

	if (qrCode) {
		return (
			<div style={style}>
				<Image width={400} height={400} alt="qr-code" src={qrCode} />
			</div>
		);
	}

	if (loadingStatus !== null) {
		return (
			<div
				style={style}
				className="h-full w-full flex flex-col items-center justify-center"
			>
				<LinearProgress value={loadingStatus} />
			</div>
		);
	}

	return <div style={style}>Please wait...</div>;
}
