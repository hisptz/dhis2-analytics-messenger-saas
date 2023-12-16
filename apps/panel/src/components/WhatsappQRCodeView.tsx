"use client";

import { Button, Dialog, DialogActions, DialogTitle } from "@mui/material";
import DialogContent from "@mui/material/DialogContent";
import Image from "next/image";
import { useQuery } from "@tanstack/react-query";

export interface WhatsappQRCodeViewProps {
	client: Parse.Object;
	open: boolean;
	onClose: () => void;
}

export function WhatsappQRCodeView({
	open,
	onClose,
	client,
}: WhatsappQRCodeViewProps) {
	const fetchQR = async () => {
		const session = client.get("sessionId");
		const baseUrl = `${process.env.NEXT_PUBLIC_MESSAGING_URL}/clients/whatsapp/session/${session}`;
		const response = await fetch(`${baseUrl}/qrCode`);
		return await response.json();
	};

	const { isLoading, data, error } = useQuery({
		queryKey: [client],
		queryFn: fetchQR,
		refetchInterval: 10000,
	});

	return (
		<Dialog open={open} onClose={onClose}>
			<DialogTitle>Connect to your whatsapp</DialogTitle>
			<DialogContent>
				{isLoading ? (
					<div>Loading...</div>
				) : error ? (
					<div>Error: {error.message}</div>
				) : (
					<div
						className="flex flex-col justify-center align-middle items-center"
						style={{ width: 448, height: 448 }}
					>
						<Image
							width={400}
							height={400}
							alt="qr-code"
							src={data.base64Image}
						/>
					</div>
				)}
			</DialogContent>
			<DialogActions>
				<Button onClick={onClose}>Cancel</Button>
			</DialogActions>
		</Dialog>
	);
}
